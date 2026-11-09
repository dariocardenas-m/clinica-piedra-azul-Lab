import { Component, Input } from '@angular/core';
import { FooterComponent } from '../../organisms/footer/footer.component';
import { HeaderComponent } from '../../organisms/header/header.component';
import { SidebarComponent } from '../../organisms/sidebar/sidebar.component';

/** Plantilla privada: cabecera, menú, contenido y pie. Se adapta a pantallas estrechas. */
@Component({
  selector: 'app-main-template',
  imports: [HeaderComponent, SidebarComponent, FooterComponent],
  template: `
    <div class="plantilla">
      <app-header />
      <div class="cuerpo">
        <app-sidebar />
        <main class="contenido">
          <h1>{{ titulo }}</h1>
          <ng-content />
        </main>
      </div>
      <app-footer />
    </div>
  `,
})
export class MainTemplateComponent {
  @Input({ required: true }) titulo = '';
}
