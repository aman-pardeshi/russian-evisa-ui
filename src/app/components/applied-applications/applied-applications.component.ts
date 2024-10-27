import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
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
import { mapArrayFromSnakeToCamel, mapObjectFromSnakeToCamel } from 'src/app/utils/switchObjectCase';
import { TimelineModule } from 'primeng/timeline';
import { getDateInDDMMYYY, getDateInFormat } from '../Shared/utils';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';

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
  @ViewChild('fileUpload') fileUpload!: FileUpload;
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
      .getAppliedApplication(this.applicationSearchParams)
      .subscribe(
        (response) => {
          if (response?.admin_applications?.length > 0) {
            this.applicationsList = mapArrayFromSnakeToCamel(
              response.admin_applications
            );
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
      id: application?.id,
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
    };

    this.selectedApplicationHistory = application.applicationHistories;
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
          this.showApprovalConfirmationDialog = false;
          this.handleApplicationOpen(
            mapObjectFromSnakeToCamel(response?.admin_application, {})
          );
          this.applicationsList = this.applicationsList.filter(
            (application) =>
              application.id !== this.currentApplicationDetails.id
          );
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
          this.showRejectionConfirmationDialog = false;
          this.handleApplicationOpen(
            mapObjectFromSnakeToCamel(response?.admin_application, {})
          );
          this.applicationsList = this.applicationsList.filter(
            (application) =>
              application.id !== this.currentApplicationDetails.id
          );
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

  clearApprovalDocument() {
    this.approvalDocument = null
    this.fileUpload?.clear();
    this.showApprovalConfirmationDialog = true;
  }
}
