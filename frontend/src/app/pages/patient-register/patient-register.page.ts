import { Component } from '@angular/core';
import { PatientFormComponent } from '../../atomic/organisms/patient-form/patient-form.component';
import { MainTemplateComponent } from '../../atomic/templates/main-template/main-template.component';

@Component({
  selector: 'app-patient-register-page',
  imports: [MainTemplateComponent, PatientFormComponent],
  template: `<app-main-template titulo="Registrar paciente"><app-patient-form /></app-main-template>`,
})
export class PatientRegisterPage {}
