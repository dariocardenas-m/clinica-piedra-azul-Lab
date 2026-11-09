export const API_URL = 'http://localhost:8080';

/** Rutas que no deben llevar el JWT. El interceptor usa esta lista. */
export const RUTAS_PUBLICAS = ['/api/auth/login', '/api/medicos/publicos', '/api/salud'];
