import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { ApplicationComponent } from './application.component';
import { TrackStatusComponent } from '../track-status/track-status.component';

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
      {
        path: 'track-status',
        component: TrackStatusComponent,
      },
    ]),
  ],
  exports: [RouterModule],
})
export class ApplicationRoutingModule {}
