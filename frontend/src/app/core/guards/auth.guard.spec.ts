import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../auth.service';

describe('AuthGuard', () => {
  it('redirige al ingreso cuando no hay sesión', () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
    const guard = TestBed.inject(AuthGuard);
    const router = TestBed.inject(Router);
    sessionStorage.clear();
    const resultado = guard.canActivate();
    expect(router.serializeUrl(resultado as never)).toBe('/ingreso');
  });

  it('permite el paso cuando el token sigue vigente', () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
    const auth = TestBed.inject(AuthService);
    const exp = Math.floor(Date.now() / 1000) + 3600;
    const cuerpo = btoa(JSON.stringify({ sub: 'a@b.test', rol: 'ADMIN', exp }));
    sessionStorage.setItem('cpa_token', `aaa.${cuerpo}.firma`);
    expect(auth.sesionVigente()).toBe(true);
    expect(TestBed.inject(AuthGuard).canActivate()).toBe(true);
    sessionStorage.clear();
  });
});
