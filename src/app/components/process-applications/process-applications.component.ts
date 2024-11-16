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
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';
import { LoaderComponent } from '../Shared/loader/loader.component';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApplicationService } from 'src/app/services/application.service';
import { AdminService } from 'src/app/services/admin.service';
import {
  mapArrayFromSnakeToCamel,
  mapObjectFromSnakeToCamel,
} from 'src/app/utils/switchObjectCase';
import { ApplicationSearchRequest } from 'src/app/model/application-search-request';
import { TimelineModule } from 'primeng/timeline';
import { getDateInDDMMYYY, getDateInFormat } from '../Shared/utils';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ChipModule } from 'primeng/chip';

@Component({
  selector: 'app-process-applications',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DropdownModule,
    ButtonModule,
    CalendarModule,
    TableModule,
    InputTextModule,
    SplitButtonModule,
    NgxSpinnerModule,
    LoaderComponent,
    TagModule,
    DialogModule,
    DividerModule,
    ToastModule,
    TimelineModule,
    ConfirmPopupModule,
    ChipModule,
  ],
  templateUrl: './process-applications.component.html',
  styleUrl: './process-applications.component.scss',
  providers: [MessageService, ConfirmationService],
})
export class ProcessApplicationsComponent {
  searchBy: string = 'date';
  applicationSearchForm: FormGroup;
  applicationSearchParams: ApplicationSearchRequest;
  applicationFilterForm: FormGroup;
  nationalityList: any[] = [];
  statusList: any[] = [];
  categorization: any[] = [];
  showApplicationDetailsDialog: boolean = false;

  applicationsList: any[];
  selectedApplications: any[] = [];

  currentApplicationDetails: any;
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
    private adminService: AdminService,
    private confirmationService: ConfirmationService
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

  ngOnInit() {
    this.statusList.push(
      { label: 'All Status', value: 'All' },
      { label: 'Pending', value: 'Pending' },
      { label: 'Approved', value: 'Approved' },
      { label: 'Rejected', value: 'Rejected' },
      { label: 'On-Hold', value: 'On-Hold' }
    );

    this.categorization.push(
      { label: 'All Categorization', value: 'All' },
      { label: 'Red Applications', value: 'Red' },
      { label: 'Blue Applications', value: 'Blue' },
      { label: 'Green Applications', value: 'Green' }
    );

    this.applicationService.getNationalityList().subscribe((response) => {
      this.nationalityList = response;
      this.nationalityList.unshift({ label: 'All Nationality', value: 'All' });
    });
  }

  onSearch() {
    this.spinner.show();
    this.applicationSearchParams = new ApplicationSearchRequest();
    this.applicationSearchParams.searchBy =
      this.applicationSearchForm.get('searchBy')?.value?.value;

    this.applicationsList = [];

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
      .getSubmittedApplications(this.applicationSearchParams)
      .subscribe(
        (response) => {
          if (response?.admin_applications?.length > 0) {
            this.applicationsList = mapArrayFromSnakeToCamel(
              response?.admin_applications
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
      serviceFee: application?.serviceFee,
      visaFee: application?.visaFee,

      intentedDateOfEntry: getDateInFormat(
        new Date(application?.intentedDateOfEntry)),
      returnDate: getDateInFormat(
        new Date(application?.returnDate)),
      tripPurpose: application?.tripPurpose,
      isOtherNationality: application?.isOtherNationality,
      otherNationality: application?.otherNationality,
      yearOfAcquistion: application?.yearOfAcquistion,

      currentlyEmployedOrStudying: application?.currentlyEmployedOrStudying,
      employmentOrStudyDetails: application?.employmentOrStudyDetails,

      maritalStatus: application?.maritalStatus,
      partnerDetails: application?.partnerDetails,
      hasMother: application?.hasMother,
      motherDetails: application?.motherDetails,
      hasFather: application?.hasFather,
      fatherDetails: application?.fatherDetails,

      homeAddress: application?.homeAddress,
      typeOfAccommodation: application?.typeOfAccommodation,
      accommodationDetails: application?.accommodationDetails,
      visitedCountriesRecently: application?.visitedCountriesRecently,
      visitedCountriesDetails: application?.visitedCountriesDetails,
    };

    this.selectedApplicationHistory = application.applicationHistories;
  }

  handleApplyVisa() {
    this.spinner.show();

    const params = {
      referenceId: this.currentApplicationDetails.referenceId,
    };

    this.adminService.applyVisaForApplication(params).subscribe(
      (response) => {
        this.spinner.hide();
        this.handleApplicationOpen(
          mapObjectFromSnakeToCamel(response?.admin_application, {})
        );
        this.applicationsList = this.applicationsList.filter(
          (application) => application.id !== this.currentApplicationDetails.id
        );
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Visa Applied Successfully',
        });
      },
      (error) => {
        this.spinner.hide();
        this.messageService.add({
          severity: 'error',
          detail: error?.error?.message,
        });
      }
    );

    // this.messageService.add({
    //   severity: 'success',
    //   summary: 'Success',
    //   detail: 'Application Updated Successfully',
    // });
  }

  onFilterChange() {
    this.searchBy = this.applicationSearchForm.get('searchBy')?.value?.value;
  }

  confirmPopup(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.handleApplyVisa();
      },
      reject: () => {
        // this.messageService.add({
        //   severity: 'error',
        //   summary: 'Rejected',
        //   detail: 'You have rejected',
        //   life: 3000,
        // });
      },
    });
  }

  downloadFile(url: string, fileType: string) {
    const fileName = `${this.currentApplicationDetails?.firstName} ${this.currentApplicationDetails?.lastName} -  ${fileType}.png`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.blob();
      })
      .then((blob) => {
        const anchor = document.createElement('a');
        const imageData = window.URL.createObjectURL(blob);

        anchor.href = imageData;
        anchor.download = fileName;
        anchor.click();

        window.URL.revokeObjectURL(url);
        anchor.remove();
      })
      .catch((error) => console.error('Error downloading the file:', error));
  }
}
