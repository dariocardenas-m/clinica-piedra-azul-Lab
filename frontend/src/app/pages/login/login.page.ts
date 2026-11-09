import { Component } from '@angular/core';
import { LoginFormComponent } from '../../atomic/organisms/login-form/login-form.component';
import { PublicTemplateComponent } from '../../atomic/templates/public-template/public-template.component';

@Component({
  selector: 'app-login-page',
  imports: [PublicTemplateComponent, LoginFormComponent],
  template: `
    <app-public-template>
      <section class="portada">
        <img class="escudo" src="escudo-unicauca.svg" alt="Escudo de la Universidad del Cauca" />
        <div>
          <p class="sobrelinea">Laboratorio de Ingeniería del Software III</p>
          <h1>Bienvenida a la Clínica Piedra Azul</h1>
          <p>Gestión de médicos, pacientes y citas para la comunidad de la Universidad del Cauca, en Popayán.</p>
        </div>
      </section>
      <app-login-form />
    </app-public-template>
  `,
})
export class LoginPage {}
