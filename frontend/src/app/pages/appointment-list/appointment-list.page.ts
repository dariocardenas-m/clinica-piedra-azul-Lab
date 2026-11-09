import { Component } from '@angular/core';
import { AppointmentListComponent } from '../../atomic/organisms/appointment-list/appointment-list.component';
import { MainTemplateComponent } from '../../atomic/templates/main-template/main-template.component';

@Component({
  selector: 'app-appointment-list-page',
  imports: [MainTemplateComponent, AppointmentListComponent],
  template: `<app-main-template titulo="Citas"><app-appointment-list alcance="todas" /></app-main-template>`,
})
export class AppointmentListPage {}
