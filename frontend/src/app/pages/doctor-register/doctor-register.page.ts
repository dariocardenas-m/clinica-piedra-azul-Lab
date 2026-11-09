import { Component } from '@angular/core';
import { DoctorFormComponent } from '../../atomic/organisms/doctor-form/doctor-form.component';
import { MainTemplateComponent } from '../../atomic/templates/main-template/main-template.component';

@Component({
  selector: 'app-doctor-register-page',
  imports: [MainTemplateComponent, DoctorFormComponent],
  template: `<app-main-template titulo="Registrar médico"><app-doctor-form /></app-main-template>`,
})
export class DoctorRegisterPage {}
