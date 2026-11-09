import { Component, Input } from '@angular/core';
import { ColumnaTabla, FilaTabla } from '../../../core/modelos';
import { TableComponent } from '../../atoms/table/table.component';

/** Molécula obligatoria: título más la tabla reutilizable. */
@Component({
  selector: 'app-table-section',
  imports: [TableComponent],
  template: `
    <section class="tarjeta">
      <h2>{{ titulo }}</h2>
      @if (resumen) { <p>{{ resumen }}</p> }
      <app-table [columnas]="columnas" [datos]="datos" [mensajeVacio]="mensajeVacio" />
    </section>
  `,
})
export class TableSectionComponent {
  @Input({ required: true }) titulo = '';
  @Input() resumen = '';
  @Input({ required: true }) columnas: ColumnaTabla[] = [];
  @Input({ required: true }) datos: FilaTabla[] = [];
  @Input() mensajeVacio = 'No hay registros para mostrar.';
}
