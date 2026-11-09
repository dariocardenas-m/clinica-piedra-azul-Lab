export interface Sesion {
  token: string;
  tipo: string;
  correo: string;
  rol: 'ADMIN' | 'PACIENTE';
  nombreUsuario: string;
}

export interface Perfil {
  id: number;
  nombreUsuario: string;
  correo: string;
  rol: string;
  nombres: string | null;
  apellidos: string | null;
}

export interface Medico {
  id: number;
  nombres: string;
  apellidos: string;
  cedula: string;
  especialidad: string;
  telefono: string;
  correo: string;
  direccion: string;
  estado: string;
}

export interface MedicoPublico {
  id: number;
  nombres: string;
  apellidos: string;
  especialidad: string;
}

export interface Paciente {
  id: number;
  nombres: string;
  apellidos: string;
  cedula: string;
  fechaNacimiento: string;
  telefono: string;
  correo: string;
  direccion: string;
  estado: string;
  nombreUsuario: string;
}

export interface Cita {
  id: number;
  pacienteId: number;
  paciente: string;
  medicoId: number;
  medico: string;
  especialidad: string;
  fecha: string;
  hora: string;
  motivo: string;
  estado: string;
  observaciones: string | null;
}

export interface ColumnaTabla {
  clave: string;
  titulo: string;
  tipo?: 'texto' | 'estado';
}

export type FilaTabla = Record<string, string | number | null>;
