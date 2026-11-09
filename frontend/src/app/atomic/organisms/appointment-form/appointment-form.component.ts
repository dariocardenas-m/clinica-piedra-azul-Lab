import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { CitaService } from '../../../core/services/cita.service';
import { MedicoService } from '../../../core/services/medico.service';
import { PacienteService } from '../../../core/services/paciente.service';
import { AlertComponent } from '../../atoms/alert/alert.component';
import { ButtonComponent } from '../../atoms/button/button.component';
import { InputComponent } from '../../atoms/input/input.component';
import { SelectComponent } from '../../atoms/select/select.component';

@Component({
  selector: 'app-appointment-form',
  imports: [ReactiveFormsModule, InputComponent, SelectComponent, ButtonComponent, AlertComponent],
  template: `
    <form class="formulario formulario-ancho" [formGroup]="form" (ngSubmit)="enviar()">
      <app-alert [mensaje]="error()" tipo="error" />
      <app-select etiqueta="Paciente" ejemplo="Carlos Pérez Díaz" [control]="form.controls.pacienteId" [opciones]="opcionesPacientes()" [mensajes]="obligatorio" />
      <app-select etiqueta="Médico" ejemplo="Laura Gómez Ríos · Medicina general" [control]="form.controls.medicoId" [opciones]="opcionesMedicos()" [mensajes]="obligatorio" />
      <div class="dos-columnas">
        <app-input etiqueta="Fecha" tipo="date" ejemplo="2026-12-02" [control]="form.controls.fecha" [mensajes]="obligatorio" />
        <app-input etiqueta="Hora" tipo="time" ejemplo="09:00" [control]="form.controls.hora" [mensajes]="obligatorio" />
      </div>
      <app-input etiqueta="Motivo" ejemplo="Control de medicina general" [control]="form.controls.motivo" [mensajes]="motivo" />
      <app-select etiqueta="Estado" ejemplo="Programada" [control]="form.controls.estado" [opciones]="estados" [mensajes]="obligatorio" />
      <app-input etiqueta="Observaciones" ejemplo="Traer resultados anteriores" [control]="form.controls.observaciones" [mensajes]="observaciones" />
      <app-button tipo="submit" [deshabilitado]="form.invalid">Crear cita</app-button>
    </form>
  `,
})
export class AppointmentFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly citas = inject(CitaService);
  private readonly medicosApi = inject(MedicoService);
  private readonly pacientesApi = inject(PacienteService);
  private readonly router = inject(Router);

  protected readonly error = signal('');
  protected readonly opcionesMedicos = toSignal(
    this.medicosApi.listar().pipe(
      map((lista) => lista.filter((medico) => medico.estado === 'ACTIVO').map((medico) => ({
        valor: String(medico.id),
        etiqueta: `${medico.nombres} ${medico.apellidos} · ${medico.especialidad}`,
      }))),
      catchError(() => of([] as { valor: string; etiqueta: string }[])),
    ),
    { initialValue: [] as { valor: string; etiqueta: string }[] },
  );
  protected readonly opcionesPacientes = toSignal(
    this.pacientesApi.listar().pipe(
      map((lista) => lista.filter((paciente) => paciente.estado === 'ACTIVO').map((paciente) => ({
        valor: String(paciente.id),
        etiqueta: `${paciente.nombres} ${paciente.apellidos}`,
      }))),
      catchError(() => of([] as { valor: string; etiqueta: string }[])),
    ),
    { initialValue: [] as { valor: string; etiqueta: string }[] },
  );
  protected readonly estados = [
    { valor: 'PROGRAMADA', etiqueta: 'Programada' },
    { valor: 'ATENDIDA', etiqueta: 'Atendida' },
    { valor: 'CANCELADA', etiqueta: 'Cancelada' },
  ];
  protected readonly obligatorio = { required: 'Este campo es obligatorio.' };
  protected readonly motivo = {
    required: 'El motivo es obligatorio.',
    minlength: 'Describa el motivo con al menos 5 caracteres.',
    maxlength: 'El motivo admite máximo 300 caracteres.',
  };
  protected readonly observaciones = { maxlength: 'Las observaciones admiten máximo 500 caracteres.' };
  protected readonly form = this.fb.nonNullable.group({
    pacienteId: ['', Validators.required],
    medicoId: ['', Validators.required],
    fecha: ['', Validators.required],
    hora: ['', Validators.required],
    motivo: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(300)]],
    estado: ['PROGRAMADA', Validators.required],
    observaciones: ['', Validators.maxLength(500)],
  });

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.error.set('');
    const datos = this.form.getRawValue();
    this.citas.crear({
      pacienteId: Number(datos.pacienteId),
      medicoId: Number(datos.medicoId),
      fecha: datos.fecha,
      hora: datos.hora,
      motivo: datos.motivo,
      estado: datos.estado,
      observaciones: datos.observaciones,
    }).subscribe({
      next: () => this.router.navigate(['/gestion/citas']),
      error: (fallo: HttpErrorResponse) => {
        this.error.set(fallo.error?.mensaje ?? 'No fue posible crear la cita.');
      },
    });
  }
}
