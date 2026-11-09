import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { ButtonComponent } from '../../atoms/button/button.component';

@Component({
  selector: 'app-header',
  imports: [RouterLink, ButtonComponent],
  template: `
    <header class="cabecera">
      <a class="marca" routerLink="/medicos">
        <img class="escudo" src="escudo-unicauca.svg" alt="Escudo de la Universidad del Cauca" />
        <span>
          <small>Universidad del Cauca</small>
          <strong>
            <svg class="cruz" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M10 3h4v7h7v4h-7v7h-4v-7H3v-4h7V3z" fill="currentColor"/>
            </svg>
            Clínica Piedra Azul
          </strong>
        </span>
      </a>
      <div class="acciones-cabecera">
        @if (auth.sesionVigente()) {
          <span class="usuario-sesion">{{ auth.correo() }} · {{ auth.rol() === 'ADMIN' ? 'Administrador' : 'Paciente' }}</span>
          <app-button variante="texto" (click)="salir()">Cerrar sesión</app-button>
        } @else {
          <a class="entrar" routerLink="/ingreso">Ingresar</a>
        }
      </div>
    </header>
  `,
})
export class HeaderComponent {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  salir(): void {
    this.auth.cerrar();
    this.router.navigate(['/ingreso']);
  }
}
