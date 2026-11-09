import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  template: `@if (mensaje) { <p [class]="'alerta alerta--' + tipo" role="alert">{{ mensaje }}</p> }`,
})
export class AlertComponent {
  @Input() mensaje = '';
  @Input() tipo: 'error' | 'exito' | 'info' = 'info';
}
