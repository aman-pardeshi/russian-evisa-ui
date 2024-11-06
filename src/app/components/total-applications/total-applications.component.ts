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
import { getDateInDDMMYYY, getDateInFormat } from '../Shared/utils';

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
    TimelineModule,
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
    this.applicationsList = [];
    this.applicationSearchParams = new ApplicationSearchRequest();
    this.applicationSearchParams.searchBy =
      this.applicationSearchForm.get('searchBy')?.value?.value;
    switch (this.applicationSearchParams.searchBy) {
      case 'applicationId':
        this.applicationSearchParams.applicationId =
          this.applicationSearchForm.get('applicationId').value;
        break;

      case 'firstName':
        this.applicationSearchParams.firstName =
          this.applicationSearchForm.get('firstName').value;
        break;

      case 'lastName':
        this.applicationSearchParams.lastName =
          this.applicationSearchForm.get('lastName').value;
        break;

      case 'passport':
        this.applicationSearchParams.passport =
          this.applicationSearchForm.get('passport').value;
        break;

      case 'date':
        this.applicationSearchParams.fromDate = this.applicationSearchForm.get(
          'fromDate'
        ).value
          ? getDateInDDMMYYY(this.applicationSearchForm.get('fromDate').value)
          : '';
        this.applicationSearchParams.toDate = this.applicationSearchForm.get(
          'toDate'
        ).value
          ? getDateInDDMMYYY(this.applicationSearchForm.get('toDate').value)
          : '';
        break;

      default:
        break;
    }

    this.adminService
      .getAllApplications(this.applicationSearchParams)
      .subscribe(
        (response) => {
          if (response?.admin_applications?.length > 0) {
            this.applicationsList = mapArrayFromSnakeToCamel(
              response.admin_applications
            );
          } else {
            this.messageService.add({
              severity: 'error',
              detail: 'No Application Present',
            });
          }
          this.spinner.hide();
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
      case 'approved':
        return 'success';

      case 'applied':
        return 'warning';

      case 'rejected':
        return 'danger';

      case 'submitted':
        return 'info';

      default:
        break;
    }
  }

  handleApplicationOpen(application: any) {
    this.showApplicationDetailsDialog = true;
    this.currentApplicationDetails = {
      firstName: application?.firstName,
      lastName: application?.lastName,
      gender: application?.gender,
      dateOfBirth: getDateInFormat(new Date(application?.dateOfBirth)),
      passportNumber: application.passportNumber,
      passportPlaceOfIssue: application.passportPlaceOfIssue,
      passportExpiryDate: getDateInFormat(
        new Date(application?.passportExpiryDate)
      ),
      passportDateOfIssue: getDateInFormat(
        new Date(application?.passportDateOfIssue)
      ),
      contactNo: `${application?.countryCode} ${application?.mobile}`,
      submissionId: application?.submissionId,
      status: application.status,
      photo: application?.photo?.url,
      passportFront: application?.passportPhotoFront?.url,
      passportBack: application?.passportPhotoBack?.url,
      referenceId: application?.referenceId,
      serviceFee: application?.serviceFee,
      visaFee: application?.visaFee,
    };
    this.selectedApplicationHistory = application.applicationHistories;
  }
}
