import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  template: `<p class="cargando">{{ mensaje }}</p>`,
})
export class LoadingComponent {
  @Input() mensaje = 'Cargando...';
}
