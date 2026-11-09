import { Component, inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MedicoService } from '../../../core/services/medico.service';
import { FilaTabla } from '../../../core/modelos';
import { AlertComponent } from '../../atoms/alert/alert.component';
import { LoadingComponent } from '../../atoms/loading/loading.component';
import { TableSectionComponent } from '../../molecules/table-section/table-section.component';

@Component({
  selector: 'app-doctor-list',
  imports: [AsyncPipe, TableSectionComponent, LoadingComponent, AlertComponent],
  template: `
    @if (estado$ | async; as estado) {
      <app-alert [mensaje]="estado.error" tipo="error" />
      <app-table-section
        titulo="Médicos registrados"
        resumen="Información completa, visible solo para administración."
        [columnas]="columnas"
        [datos]="estado.filas"
        mensajeVacio="Todavía no hay médicos registrados." />
    } @else {
      <app-loading mensaje="Cargando médicos..." />
    }
  `,
})
export class DoctorListComponent {
  private readonly medicos = inject(MedicoService);
  protected readonly columnas = [
    { clave: 'nombre', titulo: 'Nombre' },
    { clave: 'cedula', titulo: 'Cédula' },
    { clave: 'especialidad', titulo: 'Especialidad' },
    { clave: 'telefono', titulo: 'Teléfono' },
    { clave: 'correo', titulo: 'Correo' },
    { clave: 'estado', titulo: 'Estado', tipo: 'estado' as const },
  ];
  protected readonly estado$ = this.medicos.listar().pipe(
    map((lista) => ({
      error: '',
      filas: lista.map((medico) => ({
        nombre: `${medico.nombres} ${medico.apellidos}`,
        cedula: medico.cedula,
        especialidad: medico.especialidad,
        telefono: medico.telefono,
        correo: medico.correo,
        estado: medico.estado,
      })) as FilaTabla[],
    })),
    catchError(() => of({ error: 'No fue posible cargar los médicos.', filas: [] as FilaTabla[] })),
  );
}
