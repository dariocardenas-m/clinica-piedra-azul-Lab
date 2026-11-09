import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="menu" aria-label="Navegación principal">
      <p class="menu-titulo">Consulta</p>
      <a routerLink="/panel" routerLinkActive="activo">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 4h7v7H4V4zm9 0h7v4h-7V4zM4 13h7v7H4v-7zm9-3h7v10h-7V10z"/></svg>
        Panel
      </a>
      @if (auth.rol() === 'ADMIN') {
        <p class="menu-titulo">Administración</p>
        <a routerLink="/gestion/medicos" routerLinkActive="activo">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm-7 8a7 7 0 0 1 14 0z"/></svg>
          Médicos
        </a>
        <a routerLink="/gestion/medicos/nuevo" routerLinkActive="activo">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z"/></svg>
          Registrar médico
        </a>
        <a routerLink="/gestion/pacientes" routerLinkActive="activo">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm8 1a3 3 0 1 0-3-3 3 3 0 0 0 3 3zM2 19a6 6 0 0 1 12 0zm12 0a6 6 0 0 1 8 0z"/></svg>
          Pacientes
        </a>
        <a routerLink="/gestion/pacientes/nuevo" routerLinkActive="activo">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M15 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zM3 19a7 7 0 0 1 11.5-5.3L13 15h2v2h2v2h2v2H3z"/></svg>
          Registrar paciente
        </a>
        <a routerLink="/gestion/citas" routerLinkActive="activo">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 2h2v2h6V2h2v2h3v18H4V4h3zm12 8H5v10h14z"/></svg>
          Citas
        </a>
        <a routerLink="/gestion/citas/nueva" routerLinkActive="activo">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 2h2v2h6V2h2v2h3v6h-2V8H6v12h6v2H4V4h3zm9 10h2v3h3v2h-3v3h-2v-3h-3v-2h3z"/></svg>
          Nueva cita
        </a>
      } @else {
        <p class="menu-titulo">Mi atención</p>
        <a routerLink="/mis-citas" routerLinkActive="activo">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 2h2v2h6V2h2v2h3v18H4V4h3zm0 8h10v2H7zm0 4h7v2H7z"/></svg>
          Mis citas
        </a>
      }
    </nav>
  `,
})
export class SidebarComponent {
  protected readonly auth = inject(AuthService);
}
