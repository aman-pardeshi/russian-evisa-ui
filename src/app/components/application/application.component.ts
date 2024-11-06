import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ApplicationService } from 'src/app/services/application.service';
import { LoaderComponent } from '../Shared/loader/loader.component';
import { getDateInFormat } from '../Shared/utils';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-application',
  standalone: true,
  imports: [
    RouterModule,
    ToastModule,
    ButtonModule,
    CommonModule,
    NgxSpinnerModule,
    LoaderComponent,
  ],
  templateUrl: './application.component.html',
  styleUrl: './application.component.scss',
  providers: [MessageService],
})
export class ApplicationComponent implements OnInit {
  applications: any[] = [];
  visaApprovalDate: string = '';

  constructor(
    private router: Router,
    private applicationService: ApplicationService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService
  ) {
    this.spinner.show();
    this.applicationService.getAllApplications().subscribe(
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

    const newDate = new Date();
    newDate.setDate(newDate.getDate() + 5);
    this.visaApprovalDate = getDateInFormat(newDate);
  }

  ngOnInit() {}

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

  handleDelete(id: string) {
    this.spinner.show();

    const params = {
      referenceId: id,
    };

    this.applicationService.deleteApplication(params).subscribe(
      (response) => {
        this.spinner.hide();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Application Deleted Successfully',
        });

        this.applications = this.applications.filter(
          (x) => x.reference_id !== id
        );
      },
      (error) => {
        console.error('error', error);
        this.spinner.hide();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.message,
        });
      }
    );
  }
}
