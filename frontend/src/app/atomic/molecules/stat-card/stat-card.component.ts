import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  template: `
    <article class="tarjeta dato">
      <span>{{ etiqueta }}</span>
      <strong>{{ valor }}</strong>
    </article>
  `,
})
export class StatCardComponent {
  @Input({ required: true }) etiqueta = '';
  @Input({ required: true }) valor: string | number = 0;
}
