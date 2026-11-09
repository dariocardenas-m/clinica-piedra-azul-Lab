import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, provideRouter, Router } from '@angular/router';
import { RoleGuard } from './role.guard';

function token(rol: string): void {
  const exp = Math.floor(Date.now() / 1000) + 3600;
  const cuerpo = btoa(JSON.stringify({ sub: 'a@b.test', rol, exp }));
  sessionStorage.setItem('cpa_token', `aaa.${cuerpo}.firma`);
}

function ruta(roles: string[]): ActivatedRouteSnapshot {
  return { data: { roles } } as unknown as ActivatedRouteSnapshot;
}

describe('RoleGuard', () => {
  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
  });

  afterEach(() => sessionStorage.clear());

  it('envía al ingreso cuando no hay sesión', () => {
    const router = TestBed.inject(Router);
    const resultado = TestBed.inject(RoleGuard).canActivate(ruta(['ADMIN']));
    expect(router.serializeUrl(resultado as never)).toBe('/ingreso');
  });

  it('deja pasar al administrador en una ruta de administración', () => {
    token('ADMIN');
    expect(TestBed.inject(RoleGuard).canActivate(ruta(['ADMIN']))).toBe(true);
  });

  it('deja pasar al paciente en sus propias citas', () => {
    token('PACIENTE');
    expect(TestBed.inject(RoleGuard).canActivate(ruta(['PACIENTE']))).toBe(true);
  });

  it('niega al paciente una ruta de administrador', () => {
    token('PACIENTE');
    const router = TestBed.inject(Router);
    const resultado = TestBed.inject(RoleGuard).canActivate(ruta(['ADMIN']));
    expect(router.serializeUrl(resultado as never)).toBe('/panel?aviso=sin-permiso');
  });
});
