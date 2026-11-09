import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-label',
  template: `<span class="etiqueta" [attr.id]="para">{{ texto }}</span>`,
})
export class LabelComponent {
  @Input({ required: true }) texto = '';
  @Input() para = '';
}
