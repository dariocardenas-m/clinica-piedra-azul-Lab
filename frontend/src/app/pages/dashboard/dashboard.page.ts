import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, forkJoin, map, of } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { Cita } from '../../core/modelos';
import { CitaService } from '../../core/services/cita.service';
import { MedicoService } from '../../core/services/medico.service';
import { PacienteService } from '../../core/services/paciente.service';
import { AlertComponent } from '../../atomic/atoms/alert/alert.component';
import { LoadingComponent } from '../../atomic/atoms/loading/loading.component';
import { StatCardComponent } from '../../atomic/molecules/stat-card/stat-card.component';
import { TableSectionComponent } from '../../atomic/molecules/table-section/table-section.component';
import { MainTemplateComponent } from '../../atomic/templates/main-template/main-template.component';
import { FilaTabla } from '../../core/modelos';

@Component({
  selector: 'app-dashboard-page',
  imports: [MainTemplateComponent, StatCardComponent, TableSectionComponent, AlertComponent, LoadingComponent, AsyncPipe],
  template: `
    <app-main-template titulo="Panel">
      @if (aviso) { <app-alert [mensaje]="aviso" tipo="error" /> }
      @if (auth.rol() === 'ADMIN') {
        @if (admin$ | async; as datos) {
          <app-alert [mensaje]="datos.error" tipo="error" />
          <section class="rejilla-datos">
            <app-stat-card etiqueta="Médicos" [valor]="datos.medicos" />
            <app-stat-card etiqueta="Pacientes" [valor]="datos.pacientes" />
            <app-stat-card etiqueta="Citas" [valor]="datos.citas" />
          </section>
          <app-table-section titulo="Citas registradas" resumen="Vista reciente de todas las citas." [columnas]="columnasAdmin" [datos]="datos.filas" />
        } @else { <app-loading /> }
      } @else {
        @if (paciente$ | async; as datos) {
          <app-alert [mensaje]="datos.error" tipo="error" />
          <section class="tarjeta" style="margin-bottom: 1rem">
            <h2>Su cuenta</h2>
            <p>{{ datos.nombre }}</p>
            <p>{{ datos.correo }} · Paciente</p>
          </section>
          <section class="rejilla-datos">
            <app-stat-card etiqueta="Próximas citas" [valor]="datos.proximas.length" />
            <app-stat-card etiqueta="Historial" [valor]="datos.historial.length" />
          </section>
          <app-table-section titulo="Próximas citas" [columnas]="columnasPaciente" [datos]="datos.proximas" mensajeVacio="No tiene citas próximas." />
          <div class="separador"></div>
          <app-table-section titulo="Historial de citas" [columnas]="columnasPaciente" [datos]="datos.historial" mensajeVacio="Todavía no hay citas anteriores." />
        } @else { <app-loading /> }
      }
    </app-main-template>
  `,
})
export class DashboardPage {
  protected readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly medicos = inject(MedicoService);
  private readonly pacientes = inject(PacienteService);
  private readonly citas = inject(CitaService);
  protected aviso = this.route.snapshot.queryParamMap.get('aviso') === 'sin-permiso'
    ? 'Su rol no puede abrir esa página.'
    : '';
  protected readonly columnasAdmin = [
    { clave: 'paciente', titulo: 'Paciente' },
    { clave: 'medico', titulo: 'Médico' },
    { clave: 'fecha', titulo: 'Fecha' },
    { clave: 'hora', titulo: 'Hora' },
    { clave: 'estado', titulo: 'Estado', tipo: 'estado' as const },
  ];
  protected readonly columnasPaciente = [
    { clave: 'medico', titulo: 'Médico' },
    { clave: 'fecha', titulo: 'Fecha' },
    { clave: 'hora', titulo: 'Hora' },
    { clave: 'estado', titulo: 'Estado', tipo: 'estado' as const },
  ];
  protected readonly admin$ = forkJoin({
    medicos: this.medicos.listar(),
    pacientes: this.pacientes.listar(),
    citas: this.citas.listar(),
    perfil: this.auth.perfil(),
  }).pipe(
    map((datos) => ({
      error: '',
      medicos: datos.medicos.length,
      pacientes: datos.pacientes.length,
      citas: datos.citas.length,
      filas: datos.citas.map(aFila),
    })),
    catchError(() => of({ error: 'No fue posible cargar el panel.', medicos: 0, pacientes: 0, citas: 0, filas: [] as FilaTabla[] })),
  );
  protected readonly paciente$ = forkJoin({
    citas: this.citas.misCitas(),
    perfil: this.auth.perfil(),
  }).pipe(
    map((datos) => {
      const hoy = new Date().toISOString().slice(0, 10);
      const filas = datos.citas.map(aFilaPaciente);
      return {
        error: '',
        nombre: [datos.perfil.nombres, datos.perfil.apellidos].filter(Boolean).join(' ') || datos.perfil.nombreUsuario,
        correo: datos.perfil.correo,
        proximas: filas.filter((fila) => String(fila['fecha']) >= hoy && fila['estado'] !== 'CANCELADA'),
        historial: filas.filter((fila) => String(fila['fecha']) < hoy || fila['estado'] === 'ATENDIDA'),
      };
    }),
    catchError(() => of({ error: 'No fue posible cargar sus citas.', nombre: '', correo: '', proximas: [] as FilaTabla[], historial: [] as FilaTabla[] })),
  );
}

function aFila(cita: Cita): FilaTabla {
  return { paciente: cita.paciente, medico: cita.medico, fecha: cita.fecha, hora: cita.hora, estado: cita.estado };
}

function aFilaPaciente(cita: Cita): FilaTabla {
  return { medico: cita.medico, fecha: cita.fecha, hora: cita.hora, estado: cita.estado };
}
