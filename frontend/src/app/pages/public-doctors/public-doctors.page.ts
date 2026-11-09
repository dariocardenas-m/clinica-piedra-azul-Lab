import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { MedicoService } from '../../core/services/medico.service';
import { FilaTabla } from '../../core/modelos';
import { AlertComponent } from '../../atomic/atoms/alert/alert.component';
import { LoadingComponent } from '../../atomic/atoms/loading/loading.component';
import { TableSectionComponent } from '../../atomic/molecules/table-section/table-section.component';
import { PublicTemplateComponent } from '../../atomic/templates/public-template/public-template.component';

@Component({
  selector: 'app-public-doctors-page',
  imports: [PublicTemplateComponent, TableSectionComponent, LoadingComponent, AlertComponent, AsyncPipe],
  template: `
    <app-public-template>
      <section class="portada">
        <img class="escudo" src="escudo-unicauca.svg" alt="" />
        <div>
          <p class="sobrelinea">Directorio público</p>
          <h1>Médicos de la Clínica Piedra Azul</h1>
          <p>Especialidades disponibles para la comunidad. Esta consulta no pide sesión y no muestra cédula, teléfono ni dirección.</p>
        </div>
      </section>
      @if (estado$ | async; as estado) {
        <app-alert [mensaje]="estado.error" tipo="error" />
        <app-table-section
          titulo="Equipo médico"
          resumen="Especialidades disponibles en la clínica."
          [columnas]="columnas"
          [datos]="estado.filas"
          mensajeVacio="No hay médicos activos." />
      } @else {
        <app-loading mensaje="Cargando el directorio..." />
      }
    </app-public-template>
  `,
})
export class PublicDoctorsPage {
  private readonly medicos = inject(MedicoService);
  protected readonly columnas = [
    { clave: 'nombre', titulo: 'Nombre' },
    { clave: 'especialidad', titulo: 'Especialidad' },
  ];
  protected readonly estado$ = this.medicos.listarPublicos().pipe(
    map((lista) => ({
      error: '',
      filas: lista.map((medico) => ({
        nombre: `${medico.nombres} ${medico.apellidos}`,
        especialidad: medico.especialidad,
      })) as FilaTabla[],
    })),
    catchError(() => of({ error: 'No fue posible consultar los médicos.', filas: [] as FilaTabla[] })),
  );
}
