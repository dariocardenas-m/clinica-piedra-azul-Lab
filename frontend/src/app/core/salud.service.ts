import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from './api.config';

/** Contrato JSON de GET /api/salud. Debe coincidir con el DTO del backend. */
export interface SaludRespuesta {
  aplicacion: string;
  estado: string;
  mensaje: string;
}

/**
 * Primera comunicación entre Angular y Spring Boot.
 * En las etapas siguientes habrá servicios por módulo (médicos, pacientes, citas).
 */
@Injectable({ providedIn: 'root' })
export class SaludService {
  private readonly http = inject(HttpClient);

  consultar(): Observable<SaludRespuesta> {
    return this.http.get<SaludRespuesta>(`${API_URL}/api/salud`);
  }
}
