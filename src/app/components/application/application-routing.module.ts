import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { ApplicationComponent } from './application.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ApplicationComponent,
      },
      {
        path: 'apply/:id',
        component: PersonalDetailsComponent,
      },
    ]),
  ],
  exports: [RouterModule],
})
export class ApplicationRoutingModule {}
