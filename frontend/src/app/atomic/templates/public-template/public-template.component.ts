import { Component } from '@angular/core';
import { FooterComponent } from '../../organisms/footer/footer.component';
import { HeaderComponent } from '../../organisms/header/header.component';

@Component({
  selector: 'app-public-template',
  imports: [HeaderComponent, FooterComponent],
  template: `
    <div class="plantilla-publica">
      <app-header />
      <main class="publico">
        <ng-content />
      </main>
      <app-footer />
    </div>
  `,
})
export class PublicTemplateComponent {}
