import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../auth.service';

/** Impide entrar cuando el rol del token no es el que exige la ruta. */
@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    if (!this.auth.sesionVigente()) {
      return this.router.createUrlTree(['/ingreso']);
    }
    const roles = (route.data['roles'] as string[] | undefined) ?? [];
    const rol = this.auth.rol();
    if (rol && roles.includes(rol)) {
      return true;
    }
    return this.router.createUrlTree(['/panel'], { queryParams: { aviso: 'sin-permiso' } });
  }
}
