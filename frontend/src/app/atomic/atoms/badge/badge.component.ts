import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-badge',
  template: `<span [class]="'insignia insignia--' + texto">{{ texto }}</span>`,
})
export class BadgeComponent {
  @Input({ required: true }) texto = '';
}
