import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { FilaTabla } from '../../../core/modelos';
import { PacienteService } from '../../../core/services/paciente.service';
import { AlertComponent } from '../../atoms/alert/alert.component';
import { LoadingComponent } from '../../atoms/loading/loading.component';
import { TableSectionComponent } from '../../molecules/table-section/table-section.component';

@Component({
  selector: 'app-patient-list',
  imports: [AsyncPipe, TableSectionComponent, LoadingComponent, AlertComponent],
  template: `
    @if (estado$ | async; as estado) {
      <app-alert [mensaje]="estado.error" tipo="error" />
      <app-table-section
        titulo="Pacientes registrados"
        resumen="Cada fila corresponde a una ficha y a su cuenta de acceso."
        [columnas]="columnas"
        [datos]="estado.filas"
        mensajeVacio="Todavía no hay pacientes registrados." />
    } @else {
      <app-loading mensaje="Cargando pacientes..." />
    }
  `,
})
export class PatientListComponent {
  private readonly pacientes = inject(PacienteService);
  protected readonly columnas = [
    { clave: 'nombre', titulo: 'Nombre' },
    { clave: 'cedula', titulo: 'Cédula' },
    { clave: 'correo', titulo: 'Correo' },
    { clave: 'telefono', titulo: 'Teléfono' },
    { clave: 'usuario', titulo: 'Usuario' },
    { clave: 'estado', titulo: 'Estado', tipo: 'estado' as const },
  ];
  protected readonly estado$ = this.pacientes.listar().pipe(
    map((lista) => ({
      error: '',
      filas: lista.map((paciente) => ({
        nombre: `${paciente.nombres} ${paciente.apellidos}`,
        cedula: paciente.cedula,
        correo: paciente.correo,
        telefono: paciente.telefono,
        usuario: paciente.nombreUsuario,
        estado: paciente.estado,
      })) as FilaTabla[],
    })),
    catchError(() => of({ error: 'No fue posible cargar los pacientes.', filas: [] as FilaTabla[] })),
  );
}
