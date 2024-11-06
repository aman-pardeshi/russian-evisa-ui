import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';

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
    DialogModule,
  ],
  templateUrl: './track-status.component.html',
  styleUrl: './track-status.component.scss',
  providers: [MessageService],
})
export class TrackStatusComponent implements OnInit {
  trackStatusForm: FormGroup;
  applications: any[] = [];
  trackStatusResponse: any[] = [];
  showTrackStatusModal: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private applicationService: ApplicationService
  ) {}

  ngOnInit() {
    this.spinner.show();
    this.applicationService.getAllSubmittedApplications().subscribe(
      (response) => {
        if (response.data.length > 0) {
          this.applications = response.data;
        }
        this.spinner.hide();
      },
      (err) => {
        this.spinner.hide();
        console.error('error', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err?.error?.message,
        });
      }
    );
  }

  handleTrackStatus(applicationDetails: any) {
    this.spinner.show();
    this.trackStatusResponse = []

    const requestParams = {
      referenceId: applicationDetails?.reference_id,
    };

    this.applicationService.getApplicationStatus(requestParams).subscribe(
      (response) => {
        this.spinner.hide();
        this.trackStatusResponse = response?.track_statuses;
        this.showTrackStatusModal = true
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

  createNewApplication() {
    this.spinner.show();

    this.applicationService.createApplication().subscribe(
      (response) => {
        if (response.reference_id) {
          this.router.navigate(['/application/apply/', response.reference_id]);
        }
        this.spinner.hide();
      },
      (error) => {
        console.error('error', error);
        this.spinner.hide();
      }
    );
  }
}
