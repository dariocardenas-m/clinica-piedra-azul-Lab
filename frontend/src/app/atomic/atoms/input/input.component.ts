import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LabelComponent } from '../label/label.component';

@Component({
  selector: 'app-input',
  imports: [ReactiveFormsModule, LabelComponent],
  template: `
    <label class="campo">
      <app-label [texto]="etiqueta" />
      <input [type]="tipo" [formControl]="control" [attr.maxlength]="maximo" [attr.placeholder]="ejemplo || null" />
      <p class="error-campo">{{ mensajeVisible() }}</p>
    </label>
  `,
})
export class InputComponent {
  @Input({ required: true }) control!: FormControl<string>;
  @Input({ required: true }) etiqueta = '';
  @Input() tipo = 'text';
  @Input() maximo: number | null = null;
  @Input() ejemplo = '';
  @Input() mensajes: Record<string, string> = {};

  mensajeVisible(): string {
    if (!this.control || !this.control.errors || !(this.control.dirty || this.control.touched)) {
      return '';
    }
    const clave = Object.keys(this.control.errors)[0];
    return this.mensajes[clave] ?? 'El valor no es válido.';
  }
}
