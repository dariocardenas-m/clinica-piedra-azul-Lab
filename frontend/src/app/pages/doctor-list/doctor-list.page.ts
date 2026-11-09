import { Component } from '@angular/core';
import { DoctorListComponent } from '../../atomic/organisms/doctor-list/doctor-list.component';
import { MainTemplateComponent } from '../../atomic/templates/main-template/main-template.component';

@Component({
  selector: 'app-doctor-list-page',
  imports: [MainTemplateComponent, DoctorListComponent],
  template: `<app-main-template titulo="Médicos"><app-doctor-list /></app-main-template>`,
})
export class DoctorListPage {}
