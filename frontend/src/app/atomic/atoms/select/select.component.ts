import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LabelComponent } from '../label/label.component';

export interface OpcionSelect {
  valor: string;
  etiqueta: string;
}

@Component({
  selector: 'app-select',
  imports: [ReactiveFormsModule, LabelComponent],
  template: `
    <label class="campo">
      <app-label [texto]="etiqueta" />
      <select [formControl]="control">
        <option value="">Seleccione</option>
        @for (opcion of opciones; track opcion.valor) {
          <option [value]="opcion.valor">{{ opcion.etiqueta }}</option>
        }
      </select>
      <p class="error-campo">{{ mensajeVisible() }}</p>
    </label>
  `,
})
export class SelectComponent {
  @Input({ required: true }) control!: FormControl<string>;
  @Input({ required: true }) etiqueta = '';
  @Input() opciones: OpcionSelect[] = [];
  @Input() ejemplo = '';
  @Input() mensajes: Record<string, string> = {};

  mensajeVisible(): string {
    if (!this.control?.errors || !(this.control.dirty || this.control.touched)) {
      return '';
    }
    const clave = Object.keys(this.control.errors)[0];
    return this.mensajes[clave] ?? 'Seleccione una opción.';
  }
}
