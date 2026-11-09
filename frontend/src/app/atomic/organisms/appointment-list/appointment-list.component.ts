import { AsyncPipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { ColumnaTabla, FilaTabla } from '../../../core/modelos';
import { CitaService } from '../../../core/services/cita.service';
import { AlertComponent } from '../../atoms/alert/alert.component';
import { LoadingComponent } from '../../atoms/loading/loading.component';
import { TableSectionComponent } from '../../molecules/table-section/table-section.component';

@Component({
  selector: 'app-appointment-list',
  imports: [AsyncPipe, TableSectionComponent, LoadingComponent, AlertComponent],
  template: `
    @if (estado$ | async; as estado) {
      <app-alert [mensaje]="estado.error" tipo="error" />
      <app-table-section
        [titulo]="alcance === 'propias' ? 'Mis citas' : 'Citas de la clínica'"
        [resumen]="alcance === 'propias' ? 'Médico, fecha, hora y estado de sus citas.' : 'Listado de todos los pacientes.'"
        [columnas]="columnas"
        [datos]="estado.filas"
        mensajeVacio="No hay citas registradas." />
    } @else {
      <app-loading mensaje="Cargando citas..." />
    }
  `,
})
export class AppointmentListComponent implements OnInit {
  private readonly citas = inject(CitaService);
  @Input() alcance: 'todas' | 'propias' = 'todas';

  protected columnas: ColumnaTabla[] = [];
  protected estado$!: Observable<{ error: string; filas: FilaTabla[] }>;

  ngOnInit(): void {
    this.columnas = this.alcance === 'propias'
      ? [
          { clave: 'medico', titulo: 'Médico' },
          { clave: 'fecha', titulo: 'Fecha' },
          { clave: 'hora', titulo: 'Hora' },
          { clave: 'motivo', titulo: 'Motivo' },
          { clave: 'estado', titulo: 'Estado', tipo: 'estado' },
        ]
      : [
          { clave: 'paciente', titulo: 'Paciente' },
          { clave: 'medico', titulo: 'Médico' },
          { clave: 'fecha', titulo: 'Fecha' },
          { clave: 'hora', titulo: 'Hora' },
          { clave: 'motivo', titulo: 'Motivo' },
          { clave: 'estado', titulo: 'Estado', tipo: 'estado' },
        ];
    const fuente = this.alcance === 'propias' ? this.citas.misCitas() : this.citas.listar();
    this.estado$ = fuente.pipe(
      map((lista) => ({
        error: '',
        filas: lista.map((cita) => ({
          paciente: cita.paciente,
          medico: cita.medico,
          fecha: cita.fecha,
          hora: cita.hora,
          motivo: cita.motivo,
          estado: cita.estado,
        })),
      })),
      catchError(() => of({ error: 'No fue posible cargar las citas.', filas: [] })),
    );
  }
}
