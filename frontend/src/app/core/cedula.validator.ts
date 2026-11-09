import { HttpClient } from '@angular/common/http';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, filter, map, Observable, of, share, Subject, switchMap, take, timeout } from 'rxjs';
import { API_URL } from './api.config';

interface ResultadoCedula {
  cedula: string;
  existe: boolean;
  fallo: boolean;
}

/**
 * Espera a que la persona deje de escribir, ignora repeticiones y cancela
 * la consulta anterior si la cédula cambia. Esas tres decisiones son
 * debounceTime, distinctUntilChanged y switchMap.
 */
export function validadorCedula(http: HttpClient, tipo: 'medicos' | 'pacientes'): AsyncValidatorFn {
  const valores = new Subject<string>();
  const respuestas = valores.pipe(
    debounceTime(400),
    distinctUntilChanged(),
    switchMap((cedula) =>
      http
        .get<{ existe: boolean }>(`${API_URL}/api/${tipo}/verificar-cedula`, { params: { cedula } })
        .pipe(
          map((respuesta) => ({ cedula, existe: respuesta.existe, fallo: false })),
          catchError(() => of({ cedula, existe: false, fallo: true })),
        ),
    ),
    share(),
  );

  return (control: AbstractControl) => {
    const cedula = String(control.value ?? '').trim();
    if (!/^\d{6,12}$/.test(cedula)) {
      return of(null);
    }
    return new Observable((observador) => {
      const suscripcion = respuestas
        .pipe(
          filter((respuesta) => respuesta.cedula === cedula),
          take(1),
          timeout(8000),
          catchError(() => of<ResultadoCedula>({ cedula, existe: false, fallo: true })),
        )
        .subscribe((respuesta) => {
          if (respuesta.fallo) {
            observador.next({ conexionCedula: true });
          } else if (respuesta.existe) {
            observador.next({ cedulaExiste: true });
          } else {
            observador.next(null);
          }
          observador.complete();
        });
      valores.next(cedula);
      return () => suscripcion.unsubscribe();
    });
  };
}
