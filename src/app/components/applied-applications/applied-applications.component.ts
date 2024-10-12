import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { LoaderComponent } from '../Shared/loader/loader.component';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { ApplicationSearchRequest } from 'src/app/model/application-search-request';
import { ApplicationService } from 'src/app/services/application.service';
import { AdminService } from 'src/app/services/admin.service';
import { mapArrayFromSnakeToCamel } from 'src/app/utils/switchObjectCase';
import { TimelineModule } from 'primeng/timeline';
import { getDateInFormat } from '../Shared/utils';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-applied-applications',
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
    FileUploadModule,
  ],
  templateUrl: './applied-applications.component.html',
  styleUrl: './applied-applications.component.scss',
  providers: [MessageService],
})
export class AppliedApplicationsComponent {
  searchBy: string = 'date';
  applicationSearchForm: FormGroup;
  applicationSearchParams: ApplicationSearchRequest;
  applicationsList: any[];
  showApplicationDetailsDialog: boolean = false;
  showApprovalConfirmationDialog: boolean = false;
  showRejectionConfirmationDialog: boolean = false;

  currentApplicationDetails: any;
  selectedApplications: any[] = [];
  selectedApplicationHistory: [] = [];
  approvalDocument: File | null = null;
  rejectionNote: string = '';

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

    this.adminService
      .getAppliedApplication(this.applicationSearchParams)
      .subscribe(
        (response) => {
          if (response?.admin_applications?.length > 0) {
            this.applicationsList = mapArrayFromSnakeToCamel(
              response.admin_applications
            );
            console.log(this.applicationsList);
            this.spinner.hide();
          } else {
            this.spinner.hide();
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
            detail: 'Something went wrong',
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

  handleApprove() {
    this.spinner.show();
    const formData = new FormData();

    formData.append('referenceId', this.currentApplicationDetails.referenceId);

    if (this.approvalDocument) {
      formData.append('approvalDocument', this.approvalDocument);
    }

    this.adminService.approveApplication(formData).subscribe(
      (response) => {
        if (response.admin_application) {
          this.spinner.hide();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Applicaion Approved Successfully',
          });
        }
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

  handleReject() {
    this.spinner.show();
    const formData = new FormData();

    formData.append('referenceId', this.currentApplicationDetails.referenceId);

    formData.append('rejectionNote', this.rejectionNote);

    this.adminService.rejectApplication(formData).subscribe(
      (response) => {
        if (response.admin_application) {
          this.spinner.hide();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Applicaion Rejected Successfully',
          });
        }
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

  onFileSelect(event: any) {
    const file = event.files[0];
    this.approvalDocument = file;
  }
}
