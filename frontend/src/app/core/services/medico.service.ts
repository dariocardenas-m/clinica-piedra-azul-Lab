import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../api.config';
import { Medico, MedicoPublico } from '../modelos';

@Injectable({ providedIn: 'root' })
export class MedicoService {
  private readonly http = inject(HttpClient);

  listarPublicos(): Observable<MedicoPublico[]> {
    return this.http.get<MedicoPublico[]>(`${API_URL}/api/medicos/publicos`);
  }

  listar(): Observable<Medico[]> {
    return this.http.get<Medico[]>(`${API_URL}/api/medicos`);
  }

  registrar(medico: Omit<Medico, 'id'>): Observable<Medico> {
    return this.http.post<Medico>(`${API_URL}/api/medicos`, medico);
  }
}
