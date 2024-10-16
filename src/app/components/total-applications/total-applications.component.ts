import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { AdminService } from 'src/app/services/admin.service';
import { ApplicationService } from 'src/app/services/application.service';
import { LoaderComponent } from '../Shared/loader/loader.component';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { first } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { ApplicationSearchRequest } from 'src/app/model/application-search-request';
import { mapArrayFromSnakeToCamel } from 'src/app/utils/switchObjectCase';
import { DividerModule } from 'primeng/divider';
import { TimelineModule } from 'primeng/timeline';

@Component({
  selector: 'app-total-applications',
  standalone: true,
  imports: [
    ToastModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DropdownModule,
    InputTextModule,
    NgxSpinnerModule,
    LoaderComponent,
    TagModule,
    DialogModule,
    TableModule,
    CalendarModule,
    ButtonModule,
    DividerModule,
    TimelineModule
  ],
  templateUrl: './total-applications.component.html',
  styleUrl: './total-applications.component.scss',
  providers: [MessageService],
})
export class TotalApplicationsComponent {
  searchBy: string = 'date';
  applicationSearchForm: FormGroup;
  applicationSearchParams: ApplicationSearchRequest;
  applicationsList: any[];
  showApplicationDetailsDialog: boolean = false;
  currentApplicationDetails: any;
  selectedApplications: any[] = [];
  selectedApplicationHistory: [] = [];

  searchByList: any[] = [
    { label: 'Application ID', value: 'applicationId' },
    { label: 'First Name', value: 'firstName' },
    { label: 'Last Name', value: 'lastName' },
    { label: 'Passport', value: 'passport' },
    { label: 'Date', value: 'date' },
  ];

  constructor(
    private formsBuilder: FormBuilder,
    private applicationService: ApplicationService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService,
    private adminService: AdminService
  ) {
    this.initForm();
  }

  initForm() {
    this.applicationSearchForm = this.formsBuilder.group({
      searchBy: [{ label: 'Date', value: 'date' }],
      applicationId: [''],
      firstName: [''],
      lastName: [''],
      passport: [''],
      fromDate: [''],
      toDate: [''],
    });
  }

  onFilterChange() {
    this.searchBy = this.applicationSearchForm.get('searchBy')?.value?.value;
  }

  onSearch() {
    this.spinner.show();
    this.applicationSearchParams = new ApplicationSearchRequest();
    this.applicationSearchParams.searchBy =
      this.applicationSearchForm.get('searchBy')?.value?.value;
    this.applicationSearchParams.applicationId =
      this.applicationSearchForm.get('applicationId')?.value;

    this.adminService
      .getAllApplications(this.applicationSearchParams)
      .subscribe(
        (response) => {
          console.log(response);
          if (response?.admin_applications?.length > 0) {
            this.applicationsList = mapArrayFromSnakeToCamel(
              response.admin_applications
            );
            console.log(this.applicationsList);
            this.spinner.hide();
          } else {
            this.messageService.add({
              severity: 'error',
              detail: 'No Application Present',
            });
          }
        },
        (error) => {
          this.spinner.hide();
          this.messageService.add({
            severity: 'error',
            detail: 'Error While Fetching Applications',
          });
        }
      );
  }

  getSeverity(value: string) {
    switch (value) {
      case 'Approved':
        return 'success';

      case 'Pending':
        return 'warning';

      case 'Rejected':
        return 'danger';

      case 'On-Hold':
        return 'info';

      default:
        break;
    }
  }

  handleApplicationOpen(application: any) {
    this.showApplicationDetailsDialog = true;
    this.currentApplicationDetails = {
      firstName: application.firstName,
      lastName: application.lastName,
      gender: 'Male',
      dateOfBirth: '04 Jun, 1992',
      passportNumber: application.passportNumber,
      passportPlaceOfIssue: 'Mumbai',
      passportExpiryDate: '15 Sept, 2040',
      passportDateOfIssue: '01 Sept, 2020',
      contactNo: '+91 9856432120',
      referenceId: application.referenceId,
      status: application.status,
    };
    this.selectedApplicationHistory = application.applicationHistories;
    console.log(application);
  }
}
