import { inject, Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../auth.service';

/** Impide entrar a una ruta privada si no hay un JWT vigente. */
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  canActivate(): boolean | UrlTree {
    return this.auth.sesionVigente() || this.router.createUrlTree(['/ingreso']);
  }
}
