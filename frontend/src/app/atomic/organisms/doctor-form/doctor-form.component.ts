import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { validadorCedula } from '../../../core/cedula.validator';
import { MedicoService } from '../../../core/services/medico.service';
import { AlertComponent } from '../../atoms/alert/alert.component';
import { ButtonComponent } from '../../atoms/button/button.component';
import { InputComponent } from '../../atoms/input/input.component';
import { SelectComponent } from '../../atoms/select/select.component';

@Component({
  selector: 'app-doctor-form',
  imports: [ReactiveFormsModule, InputComponent, SelectComponent, ButtonComponent, AlertComponent],
  template: `
    <form class="formulario formulario-ancho" [formGroup]="form" (ngSubmit)="enviar()">
      <app-alert [mensaje]="error()" tipo="error" />
      <div class="dos-columnas">
        <app-input etiqueta="Nombres" ejemplo="Laura" [control]="form.controls.nombres" [mensajes]="textos" />
        <app-input etiqueta="Apellidos" ejemplo="Gómez Ríos" [control]="form.controls.apellidos" [mensajes]="textos" />
      </div>
      <div class="dos-columnas">
        <app-input etiqueta="Cédula" ejemplo="1234567890" [control]="form.controls.cedula" [mensajes]="cedula" />
        <app-input etiqueta="Especialidad" ejemplo="Medicina general" [control]="form.controls.especialidad" [mensajes]="textos" />
      </div>
      <div class="dos-columnas">
        <app-input etiqueta="Teléfono" ejemplo="3001234567" [control]="form.controls.telefono" [mensajes]="telefono" />
        <app-input etiqueta="Correo" tipo="email" ejemplo="laura.gomez@clinicapiedraazul.test" [control]="form.controls.correo" [mensajes]="correo" />
      </div>
      <app-input etiqueta="Dirección" ejemplo="Calle 5 # 4-20, Popayán" [control]="form.controls.direccion" [mensajes]="direccion" />
      <app-select etiqueta="Estado" ejemplo="Activo" [control]="form.controls.estado" [opciones]="estados" [mensajes]="{ required: 'Seleccione el estado.' }" />
      <app-button tipo="submit" [deshabilitado]="form.invalid || form.pending">Registrar médico</app-button>
    </form>
  `,
})
export class DoctorFormComponent {
  private readonly http = inject(HttpClient);
  private readonly fb = inject(FormBuilder);
  private readonly medicos = inject(MedicoService);
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
  protected readonly telefono = {
    required: 'El teléfono es obligatorio.',
    pattern: 'El teléfono debe tener entre 7 y 15 dígitos.',
  };
  protected readonly correo = {
    required: 'El correo es obligatorio.',
    email: 'Escriba un correo válido.',
  };
  protected readonly form = this.fb.nonNullable.group({
    nombres: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    apellidos: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    cedula: ['', [Validators.required, Validators.pattern(/^\d{6,12}$/)], [validadorCedula(this.http, 'medicos')]],
    especialidad: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
    telefono: ['', [Validators.required, Validators.pattern(/^\d{7,15}$/)]],
    correo: ['', [Validators.required, Validators.email, Validators.maxLength(120)]],
    direccion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(80)]],
    estado: ['ACTIVO', Validators.required],
  });

  enviar(): void {
    if (this.form.invalid || this.form.pending) {
      this.form.markAllAsTouched();
      return;
    }
    this.medicos.registrar(this.form.getRawValue()).subscribe({
      next: () => this.router.navigate(['/gestion/medicos']),
      error: (fallo: HttpErrorResponse) => {
        this.error.set(fallo.error?.mensaje ?? 'No fue posible registrar el médico.');
      },
    });
  }
}
