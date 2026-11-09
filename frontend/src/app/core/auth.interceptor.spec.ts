import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { authInterceptor } from './auth.interceptor';
import { AvisoService } from './aviso.service';

describe('authInterceptor', () => {
  let http: HttpClient;
  let controlador: HttpTestingController;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    controlador = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controlador.verify();
    sessionStorage.clear();
  });

  it('adjunta el JWT en una ruta privada', () => {
    sessionStorage.setItem('cpa_token', 'token-privado');
    http.get('http://localhost:8080/api/medicos').subscribe();
    const peticion = controlador.expectOne('http://localhost:8080/api/medicos');
    expect(peticion.request.headers.get('Authorization')).toBe('Bearer token-privado');
    peticion.flush([]);
  });

  it('no adjunta el JWT al directorio público aunque haya sesión', () => {
    sessionStorage.setItem('cpa_token', 'token-privado');
    http.get('http://localhost:8080/api/medicos/publicos').subscribe();
    const peticion = controlador.expectOne('http://localhost:8080/api/medicos/publicos');
    expect(peticion.request.headers.has('Authorization')).toBe(false);
    peticion.flush([]);
  });

  it('ante un 401 privado cierra la sesión y abre el ingreso', () => {
    sessionStorage.setItem('cpa_token', 'token-privado');
    const router = TestBed.inject(Router);
    const navegar = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    http.get('http://localhost:8080/api/citas').subscribe({ error: () => undefined });
    controlador.expectOne('http://localhost:8080/api/citas').flush(
      { mensaje: 'No autenticado' },
      { status: 401, statusText: 'Unauthorized' },
    );
    expect(sessionStorage.getItem('cpa_token')).toBeNull();
    expect(navegar).toHaveBeenCalledWith(['/ingreso']);
  });

  it('un 401 del login no redirige otra vez al ingreso', () => {
    const router = TestBed.inject(Router);
    const navegar = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    http.post('http://localhost:8080/api/auth/login', {}).subscribe({ error: () => undefined });
    controlador.expectOne('http://localhost:8080/api/auth/login').flush(
      { mensaje: 'Correo o contraseña incorrectos.' },
      { status: 401, statusText: 'Unauthorized' },
    );
    expect(navegar).not.toHaveBeenCalled();
  });

  it('un 403 muestra el aviso y conserva la sesión', () => {
    sessionStorage.setItem('cpa_token', 'token-privado');
    const avisos = TestBed.inject(AvisoService);
    const recibidos: unknown[] = [];
    avisos.aviso$.subscribe((aviso) => recibidos.push(aviso));
    http.get('http://localhost:8080/api/pacientes').subscribe({ error: () => undefined });
    controlador.expectOne('http://localhost:8080/api/pacientes').flush(
      { mensaje: 'No tiene permiso para esta operación.' },
      { status: 403, statusText: 'Forbidden' },
    );
    expect(recibidos.at(-1)).toEqual({
      texto: 'No tiene permiso para esta operación.',
      tipo: 'error',
    });
    expect(sessionStorage.getItem('cpa_token')).toBe('token-privado');
  });
});
