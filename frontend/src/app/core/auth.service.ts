import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { API_URL } from './api.config';
import { Perfil, Sesion } from './modelos';

interface PayloadToken {
  sub: string;
  rol: 'ADMIN' | 'PACIENTE';
  exp: number;
}

/**
 * Guarda solo el JWT. El rol que usa el menú se lee del propio token.
 * La firma la verifica el backend; aquí el token solo decide la navegación.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly clave = 'cpa_token';

  login(correo: string, password: string): Observable<Sesion> {
    return this.http
      .post<Sesion>(`${API_URL}/api/auth/login`, { correo, password })
      .pipe(tap((sesion) => sessionStorage.setItem(this.clave, sesion.token)));
  }

  perfil(): Observable<Perfil> {
    return this.http.get<Perfil>(`${API_URL}/api/auth/yo`);
  }

  cerrar(): void {
    sessionStorage.removeItem(this.clave);
  }

  token(): string | null {
    return sessionStorage.getItem(this.clave);
  }

  sesionVigente(): boolean {
    const datos = this.payload();
    return !!datos && datos.exp * 1000 > Date.now();
  }

  rol(): string | null {
    return this.payload()?.rol ?? null;
  }

  correo(): string | null {
    return this.payload()?.sub ?? null;
  }

  private payload(): PayloadToken | null {
    const token = this.token();
    if (!token) {
      return null;
    }
    try {
      const parte = token.split('.')[1];
      return JSON.parse(atob(parte.replace(/-/g, '+').replace(/_/g, '/'))) as PayloadToken;
    } catch {
      return null;
    }
  }
}
