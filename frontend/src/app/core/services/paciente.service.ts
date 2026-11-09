import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../api.config';
import { Paciente } from '../modelos';

export interface PacienteNuevo {
  nombres: string;
  apellidos: string;
  cedula: string;
  fechaNacimiento: string;
  telefono: string;
  correo: string;
  direccion: string;
  estado: string;
  nombreUsuario: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class PacienteService {
  private readonly http = inject(HttpClient);

  listar(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${API_URL}/api/pacientes`);
  }

  registrar(paciente: PacienteNuevo): Observable<Paciente> {
    return this.http.post<Paciente>(`${API_URL}/api/pacientes`, paciente);
  }
}
