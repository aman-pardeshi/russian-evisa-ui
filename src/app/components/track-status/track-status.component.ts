import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { TimelineModule } from 'primeng/timeline';
import { ToastModule } from 'primeng/toast';
import { LoaderComponent } from '../Shared/loader/loader.component';
import { ApplicationService } from 'src/app/services/application.service';
import { getDateInYYYYMMDD } from '../Shared/utils';

@Component({
  selector: 'app-track-status',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    InputTextModule,
    CalendarModule,
    TimelineModule,
    NgxSpinnerModule,
    LoaderComponent,
  ],
  templateUrl: './track-status.component.html',
  styleUrl: './track-status.component.scss',
  providers: [MessageService],
})
export class TrackStatusComponent {
  trackStatusForm: FormGroup;
  trackStatusResponse: any[] = [];
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private applicationService: ApplicationService
  ) {
    this.initForm();
  }

  initForm() {
    this.trackStatusForm = this.fb.group({
      searchParameter: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
    });
  }

  onSubmit() {
    this.spinner.show();

    const requestParams = {
      referenceId: this.trackStatusForm.get('searchParameter').value,
      dateOfBirth: getDateInYYYYMMDD(
        this.trackStatusForm.get('dateOfBirth').value
      ),
    };

    this.applicationService.getApplicationStatus(requestParams).subscribe(
      (response) => {
        this.spinner.hide();
        this.trackStatusResponse = response?.track_statuses
        console.log(response);
      },
      (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.message,
        });

        this.spinner.hide();
      }
    );
  }
}
