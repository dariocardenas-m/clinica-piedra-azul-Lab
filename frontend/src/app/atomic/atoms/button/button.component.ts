import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  template: `<button [class]="'btn btn--' + variante" [type]="tipo" [disabled]="deshabilitado"><ng-content /></button>`,
})
export class ButtonComponent {
  @Input() tipo: 'button' | 'submit' = 'button';
  @Input() variante: 'primario' | 'secundario' | 'texto' = 'primario';
  @Input() deshabilitado = false;
}
