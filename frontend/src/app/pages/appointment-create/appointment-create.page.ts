import { Component } from '@angular/core';
import { AppointmentFormComponent } from '../../atomic/organisms/appointment-form/appointment-form.component';
import { MainTemplateComponent } from '../../atomic/templates/main-template/main-template.component';

@Component({
  selector: 'app-appointment-create-page',
  imports: [MainTemplateComponent, AppointmentFormComponent],
  template: `<app-main-template titulo="Nueva cita"><app-appointment-form /></app-main-template>`,
})
export class AppointmentCreatePage {}
