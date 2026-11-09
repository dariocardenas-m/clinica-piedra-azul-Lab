import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { RUTAS_PUBLICAS } from './api.config';
import { AuthService } from './auth.service';
import { AvisoService } from './aviso.service';

/**
 * Adjunta el JWT solo a las rutas privadas y reacciona a 401 y 403.
 * No redirige si la petición es el propio login: eso evitaría un ciclo.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const avisos = inject(AvisoService);
  const esPublica = RUTAS_PUBLICAS.some((ruta) => req.url.includes(ruta));
  const token = auth.token();
  const salida = !esPublica && token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(salida).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/api/auth/login') && !router.url.startsWith('/ingreso')) {
        auth.cerrar();
        router.navigate(['/ingreso']);
      }
      if (error.status === 403) {
        avisos.mostrar('No tiene permiso para esta operación.', 'error');
      }
      return throwError(() => error);
    }),
  );
};
