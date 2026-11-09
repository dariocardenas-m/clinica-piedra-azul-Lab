import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AvisoService {
  private readonly actual = new BehaviorSubject<{ texto: string; tipo: 'error' | 'exito' | 'info' } | null>(null);
  readonly aviso$ = this.actual.asObservable();

  mostrar(texto: string, tipo: 'error' | 'exito' | 'info' = 'info'): void {
    this.actual.next({ texto, tipo });
  }

  limpiar(): void {
    this.actual.next(null);
  }
}
