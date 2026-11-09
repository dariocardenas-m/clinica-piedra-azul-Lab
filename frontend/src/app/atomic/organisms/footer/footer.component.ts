import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="pie">
      <div class="pie-marca">
        <img src="escudo-unicauca.svg" alt="" />
        <div>
          <strong>Clínica Piedra Azul · Popayán</strong>
          <p>Laboratorio de Ingeniería del Software III · Universidad del Cauca</p>
        </div>
      </div>
      <nav class="redes" aria-label="Redes sociales">
        <a href="https://www.facebook.com/unicauca" target="_blank" rel="noopener noreferrer" aria-label="Facebook de la Universidad del Cauca">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1z"/></svg>
        </a>
        <a href="https://www.instagram.com/unicauca/" target="_blank" rel="noopener noreferrer" aria-label="Instagram de la Universidad del Cauca">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5zm8 2H8a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3zm-4 3.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2zm0 2A1.8 1.8 0 1 0 13.8 12 1.8 1.8 0 0 0 12 10.2zM17.4 6.6a1 1 0 1 1-1 1 1 1 0 0 1 1-1z"/></svg>
        </a>
        <a href="https://x.com/unicauca" target="_blank" rel="noopener noreferrer" aria-label="X de la Universidad del Cauca">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14.7 10.3 21.4 3h-1.6l-5.8 6.4L9.2 3H3.5l7 10L3.5 21h1.6l6.2-6.8L14.8 21h5.7l-5.8-10.7z"/></svg>
        </a>
        <a href="https://www.youtube.com/@unicauca" target="_blank" rel="noopener noreferrer" aria-label="YouTube de la Universidad del Cauca">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M22 12.2s0-3.2-.4-4.6c-.2-.9-.9-1.6-1.8-1.8C18.2 5.4 12 5.4 12 5.4s-6.2 0-7.8.4c-.9.2-1.6.9-1.8 1.8C2 9 2 12.2 2 12.2s0 3.2.4 4.6c.2.9.9 1.6 1.8 1.8 1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.4.4-4.6.4-4.6zM10 15.5v-6.6l5.2 3.3z"/></svg>
        </a>
      </nav>
    </footer>
  `,
})
export class FooterComponent {}
