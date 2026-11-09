import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../core/auth.service';
import { AlertComponent } from '../../atoms/alert/alert.component';
import { ButtonComponent } from '../../atoms/button/button.component';
import { InputComponent } from '../../atoms/input/input.component';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, InputComponent, ButtonComponent, AlertComponent],
  template: `
    <form class="tarjeta formulario formulario-ancho" [formGroup]="form" (ngSubmit)="enviar()">
      <h2>Ingreso al sistema</h2>
      <app-alert [mensaje]="error()" tipo="error" />
      <app-input etiqueta="Correo" tipo="email" ejemplo="admin@clinicapiedraazul.test" [control]="form.controls.correo" [mensajes]="mensajesCorreo" />
      <app-input etiqueta="Contraseña" tipo="password" ejemplo="Admin123*" [control]="form.controls.password" [mensajes]="mensajesClave" />
      <app-button tipo="submit" [deshabilitado]="form.invalid || enviando()">Ingresar</app-button>
    </form>
  `,
})
export class LoginFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly enviando = signal(false);
  protected readonly error = signal('');
  protected readonly mensajesCorreo = {
    required: 'El correo es obligatorio.',
    email: 'Escriba un correo válido.',
  };
  protected readonly mensajesClave = { required: 'La contraseña es obligatoria.' };
  protected readonly form = this.fb.nonNullable.group({
    correo: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.enviando.set(true);
    this.error.set('');
    const { correo, password } = this.form.getRawValue();
    this.auth.login(correo.trim().toLowerCase(), password).subscribe({
      next: () => this.router.navigate(['/panel']),
      error: (fallo: HttpErrorResponse) => {
        this.enviando.set(false);
        this.error.set(fallo.error?.mensaje ?? 'No fue posible iniciar sesión.');
      },
    });
  }
}
