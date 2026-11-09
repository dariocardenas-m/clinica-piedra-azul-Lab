import { Component } from '@angular/core';
import { AppointmentListComponent } from '../../atomic/organisms/appointment-list/appointment-list.component';
import { MainTemplateComponent } from '../../atomic/templates/main-template/main-template.component';

@Component({
  selector: 'app-my-appointments-page',
  imports: [MainTemplateComponent, AppointmentListComponent],
  template: `<app-main-template titulo="Mis citas"><app-appointment-list alcance="propias" /></app-main-template>`,
})
export class MyAppointmentsPage {}
