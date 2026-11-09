import { Component } from '@angular/core';
import { PatientListComponent } from '../../atomic/organisms/patient-list/patient-list.component';
import { MainTemplateComponent } from '../../atomic/templates/main-template/main-template.component';

@Component({
  selector: 'app-patient-list-page',
  imports: [MainTemplateComponent, PatientListComponent],
  template: `<app-main-template titulo="Pacientes"><app-patient-list /></app-main-template>`,
})
export class PatientListPage {}
