import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { validadorCedula } from '../../../core/cedula.validator';
import { PacienteService } from '../../../core/services/paciente.service';
import { AlertComponent } from '../../atoms/alert/alert.component';
import { ButtonComponent } from '../../atoms/button/button.component';
import { InputComponent } from '../../atoms/input/input.component';
import { SelectComponent } from '../../atoms/select/select.component';

@Component({
  selector: 'app-patient-form',
  imports: [ReactiveFormsModule, InputComponent, SelectComponent, ButtonComponent, AlertComponent],
  template: `
    <form class="formulario formulario-ancho" [formGroup]="form" (ngSubmit)="enviar()">
      <app-alert [mensaje]="error()" tipo="error" />
      <div class="dos-columnas">
        <app-input etiqueta="Nombres" ejemplo="Carlos" [control]="form.controls.nombres" [mensajes]="textos" />
        <app-input etiqueta="Apellidos" ejemplo="Pérez Díaz" [control]="form.controls.apellidos" [mensajes]="textos" />
      </div>
      <div class="dos-columnas">
        <app-input etiqueta="Cédula" ejemplo="9988776655" [control]="form.controls.cedula" [mensajes]="cedula" />
        <app-input etiqueta="Fecha de nacimiento" tipo="date" ejemplo="1998-04-12" [control]="form.controls.fechaNacimiento" [mensajes]="fecha" />
      </div>
      <div class="dos-columnas">
        <app-input etiqueta="Teléfono" ejemplo="3115556677" [control]="form.controls.telefono" [mensajes]="telefono" />
        <app-input etiqueta="Correo" tipo="email" ejemplo="carlos.perez@clinicapiedraazul.test" [control]="form.controls.correo" [mensajes]="correo" />
      </div>
      <app-input etiqueta="Dirección" ejemplo="Carrera 8 # 10-15, Popayán" [control]="form.controls.direccion" [mensajes]="direccion" />
      <div class="dos-columnas">
        <app-input etiqueta="Usuario de acceso" ejemplo="carlos.perez" [control]="form.controls.nombreUsuario" [mensajes]="usuario" />
        <app-input etiqueta="Contraseña" tipo="password" ejemplo="Paciente123*" [control]="form.controls.password" [mensajes]="clave" />
      </div>
      <app-input etiqueta="Confirmar contraseña" tipo="password" ejemplo="Paciente123*" [control]="form.controls.confirmar" [mensajes]="clave" />
      <app-select etiqueta="Estado" ejemplo="Activo" [control]="form.controls.estado" [opciones]="estados" [mensajes]="{ required: 'Seleccione el estado.' }" />
      <app-button tipo="submit" [deshabilitado]="form.invalid || form.pending">Registrar paciente</app-button>
    </form>
  `,
})
export class PatientFormComponent {
  private readonly http = inject(HttpClient);
  private readonly fb = inject(FormBuilder);
  private readonly pacientes = inject(PacienteService);
  private readonly router = inject(Router);

  protected readonly error = signal('');
  protected readonly estados = [
    { valor: 'ACTIVO', etiqueta: 'Activo' },
    { valor: 'INACTIVO', etiqueta: 'Inactivo' },
  ];
  protected readonly textos = {
    required: 'Este campo es obligatorio.',
    minlength: 'El texto es demasiado corto.',
    maxlength: 'El texto es demasiado largo.',
  };
  protected readonly direccion = {
    required: 'La dirección es obligatoria.',
    minlength: 'La dirección es demasiado corta.',
    maxlength: 'La dirección admite máximo 80 caracteres.',
  };
  protected readonly cedula = {
    required: 'La cédula es obligatoria.',
    pattern: 'La cédula debe tener entre 6 y 12 dígitos.',
    cedulaExiste: 'Esta cédula ya está registrada.',
    conexionCedula: 'No se pudo verificar la cédula. Revisa la conexión.',
  };
  protected readonly telefono = { required: 'El teléfono es obligatorio.', pattern: 'El teléfono debe tener entre 7 y 15 dígitos.' };
  protected readonly correo = { required: 'El correo es obligatorio.', email: 'Escriba un correo válido.' };
  protected readonly fecha = { required: 'La fecha es obligatoria.', fechaFutura: 'La fecha no puede ser futura.' };
  protected readonly usuario = { required: 'El usuario es obligatorio.', pattern: 'Use de 4 a 30 letras, números, punto o guion.' };
  protected readonly clave = { required: 'La contraseña es obligatoria.', minlength: 'Mínimo 8 caracteres.', noCoincide: 'Las contraseñas no coinciden.' };

  protected readonly form = this.fb.nonNullable.group(
    {
      nombres: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
      apellidos: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
      cedula: ['', [Validators.required, Validators.pattern(/^\d{6,12}$/)], [validadorCedula(this.http, 'pacientes')]],
      fechaNacimiento: ['', [Validators.required, fechaNoFutura]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{7,15}$/)]],
      correo: ['', [Validators.required, Validators.email]],
      direccion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(80)]],
      nombreUsuario: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9._-]{4,30}$/)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(72)]],
      confirmar: ['', Validators.required],
      estado: ['ACTIVO', Validators.required],
    },
    { validators: clavesIguales },
  );

  enviar(): void {
    if (this.form.invalid || this.form.pending) {
      this.form.markAllAsTouched();
      return;
    }
    const datos = this.form.getRawValue();
    this.pacientes.registrar({
      nombres: datos.nombres,
      apellidos: datos.apellidos,
      cedula: datos.cedula,
      fechaNacimiento: datos.fechaNacimiento,
      telefono: datos.telefono,
      correo: datos.correo,
      direccion: datos.direccion,
      estado: datos.estado,
      nombreUsuario: datos.nombreUsuario,
      password: datos.password,
    }).subscribe({
      next: () => this.router.navigate(['/gestion/pacientes']),
      error: (fallo: HttpErrorResponse) => {
        this.error.set(fallo.error?.mensaje ?? 'No fue posible registrar el paciente.');
      },
    });
  }
}

function fechaNoFutura(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }
  return control.value <= new Date().toISOString().slice(0, 10) ? null : { fechaFutura: true };
}

function clavesIguales(grupo: AbstractControl): ValidationErrors | null {
  const clave = grupo.get('password')?.value;
  const confirmar = grupo.get('confirmar');
  if (!confirmar) {
    return null;
  }
  if (clave !== confirmar.value) {
    confirmar.setErrors({ ...(confirmar.errors ?? {}), noCoincide: true });
    return { noCoincide: true };
  }
  if (confirmar.hasError('noCoincide')) {
    const restantes = { ...(confirmar.errors ?? {}) };
    delete restantes['noCoincide'];
    confirmar.setErrors(Object.keys(restantes).length ? restantes : null);
  }
  return null;
}
