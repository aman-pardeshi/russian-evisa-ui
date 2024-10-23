import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ApplicationService } from 'src/app/services/application.service';
import { LoaderComponent } from '../Shared/loader/loader.component';
import { getDateInFormat } from '../Shared/utils';

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
})
export class ApplicationComponent implements OnInit {
  applications: any[] = [];
  visaApprovalDate: string = ''


  constructor(
    private router: Router,
    private applicationService: ApplicationService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.applicationService.getAllApplications().subscribe(
      (response) => {
        if (response.data.length > 0) {
          this.applications = response.data;
        }
      },
      (err) => {
        console.error('error', err);
      }
    );

    const newDate = new Date();
    newDate.setDate(newDate.getDate() + 5);
    this.visaApprovalDate = getDateInFormat(newDate);
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
