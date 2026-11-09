import { Component, Input } from '@angular/core';
import { BadgeComponent } from '../badge/badge.component';
import { ColumnaTabla, FilaTabla } from '../../../core/modelos';

/**
 * Tabla única para médicos, pacientes y citas.
 * Recibe las columnas, los títulos y las filas; no conoce el módulo de negocio.
 */
@Component({
  selector: 'app-table',
  imports: [BadgeComponent],
  template: `
    @if (datos.length === 0) {
      <p>{{ mensajeVacio }}</p>
    } @else {
      <div class="tabla-contenedor">
        <table>
          <thead>
            <tr>
              @for (columna of columnas; track columna.clave) {
                <th>{{ columna.titulo }}</th>
              }
            </tr>
          </thead>
          <tbody>
            @for (fila of datos; track $index) {
              <tr>
                @for (columna of columnas; track columna.clave) {
                  <td>
                    @if (columna.tipo === 'estado') {
                      <app-badge [texto]="texto(fila, columna.clave)" />
                    } @else {
                      {{ texto(fila, columna.clave) }}
                    }
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  `,
})
export class TableComponent {
  @Input({ required: true }) columnas: ColumnaTabla[] = [];
  @Input({ required: true }) datos: FilaTabla[] = [];
  @Input() mensajeVacio = 'No hay registros para mostrar.';

  texto(fila: FilaTabla, clave: string): string {
    const valor = fila[clave];
    return valor === null || valor === undefined || valor === '' ? '—' : String(valor);
  }
}
