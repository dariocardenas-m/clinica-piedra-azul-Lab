import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { AppointmentCreatePage } from './pages/appointment-create/appointment-create.page';
import { AppointmentListPage } from './pages/appointment-list/appointment-list.page';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { DoctorListPage } from './pages/doctor-list/doctor-list.page';
import { DoctorRegisterPage } from './pages/doctor-register/doctor-register.page';
import { LoginPage } from './pages/login/login.page';
import { MyAppointmentsPage } from './pages/my-appointments/my-appointments.page';
import { PatientListPage } from './pages/patient-list/patient-list.page';
import { PatientRegisterPage } from './pages/patient-register/patient-register.page';
import { PublicDoctorsPage } from './pages/public-doctors/public-doctors.page';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'medicos' },
  { path: 'ingreso', component: LoginPage },
  { path: 'medicos', component: PublicDoctorsPage },
  { path: 'panel', component: DashboardPage, canActivate: [AuthGuard] },
  { path: 'gestion/medicos', component: DoctorListPage, canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN'] } },
  { path: 'gestion/medicos/nuevo', component: DoctorRegisterPage, canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN'] } },
  { path: 'gestion/pacientes', component: PatientListPage, canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN'] } },
  { path: 'gestion/pacientes/nuevo', component: PatientRegisterPage, canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN'] } },
  { path: 'gestion/citas', component: AppointmentListPage, canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN'] } },
  { path: 'gestion/citas/nueva', component: AppointmentCreatePage, canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMIN'] } },
  { path: 'mis-citas', component: MyAppointmentsPage, canActivate: [AuthGuard, RoleGuard], data: { roles: ['PACIENTE'] } },
  { path: '**', redirectTo: 'medicos' },
];
