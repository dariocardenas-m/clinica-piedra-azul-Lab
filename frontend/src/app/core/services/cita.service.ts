import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../api.config';
import { Cita } from '../modelos';

export interface CitaNueva {
  pacienteId: number;
  medicoId: number;
  fecha: string;
  hora: string;
  motivo: string;
  estado: string;
  observaciones: string;
}

@Injectable({ providedIn: 'root' })
export class CitaService {
  private readonly http = inject(HttpClient);

  listar(): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${API_URL}/api/citas`);
  }

  misCitas(): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${API_URL}/api/citas/mis-citas`);
  }

  crear(cita: CitaNueva): Observable<Cita> {
    return this.http.post<Cita>(`${API_URL}/api/citas`, cita);
  }
}
