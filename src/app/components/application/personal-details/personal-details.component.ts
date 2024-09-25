import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { HeaderComponent } from '../../Shared/header/header.component';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { StepperModule } from 'primeng/stepper';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import { DividerModule } from 'primeng/divider';
import { getDateInFormat } from '../../Shared/utils';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { LoaderComponent } from '../../Shared/loader/loader.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ApplicationService } from 'src/app/services/application.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PersonalDetailsRequest } from 'src/app/model/personal-details-request';
import { PassportDetailRequest } from 'src/app/model/passport-detail-request';
import { mapObjectFromSnakeToCamel } from 'src/app/utils/switchObjectCase';

interface City {
  name: string;
  code: string;
  countryCode: string;
}

@Component({
  selector: 'app-personal-details',
  standalone: true,
  imports: [
    CardModule,
    CommonModule,
    ButtonModule,
    FormsModule,
    HeaderComponent,
    ReactiveFormsModule,
    ToastModule,
    DropdownModule,
    CalendarModule,
    InputNumberModule,
    CheckboxModule,
    InputTextModule,
    StepperModule,
    ToggleButtonModule,
    IconFieldModule,
    InputIconModule,
    FileUploadModule,
    TableModule,
    DividerModule,
    NgxSpinnerModule,
    LoaderComponent,
    SelectButtonModule,
  ],
  templateUrl: './personal-details.component.html',
  styleUrl: './personal-details.component.scss',
  providers: [MessageService],
})
export class PersonalDetailsComponent implements OnInit {
  applicantDetailsForm: FormGroup;
  applicantPassportDetailsForm: FormGroup;
  countries: City[] | undefined;
  nationalityList: any[] = [];
  genderList: any[] = [];
  maxDate: Date;
  minDate: Date;
  passportExpDate: Date;
  formSubmitted: boolean = false;
  active: number = 0;
  serviceFee: any[];
  otherNationalityOptions: any[] = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];
  applicationId: string;
  personalDetailsRequest: PersonalDetailsRequest;
  passportDetailsRequest: PassportDetailRequest;
  submitedApplicationDetails: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public layoutService: LayoutService,
    private formsBuilder: FormBuilder,
    private applicationService: ApplicationService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService
  ) {
    this.route.params.subscribe((params: Params) => {
      this.applicationId = params.id;
    });

    console.log(this.applicationId);
    this.initForm();
  }

  ngOnInit() {
    this.fetchFormsOptions();
  }

  nextPage() {}

  initForm() {
    this.applicantDetailsForm = this.formsBuilder.group({
      firstName: [''],
      lastName: [''],
      gender: [''],
      dateOfBirth: [''],
      placeOfBirth: [''],
      country: [''],
      countryCode: [''],
      contactNo: [undefined],
      email: [''],
    });

    this.applicantPassportDetailsForm = this.formsBuilder.group({
      passportNumber: [''],
      passportExpiryDate: [''],
      passportDateOfIssue: [''],
      passportPlaceOfIssue: [''],
      intentedDateOfEntry: [''],
      isOtherNationality: [''],
      otherNationality: [''],
      yearOfAcquisition: [undefined],
    });
  }

  fetchFormsOptions() {
    this.genderList.push(
      { label: 'Male', value: 'M' },
      { label: 'Female', value: 'F' }
    );

    this.serviceFee = [
      {
        name: 'Visa Fee',
        amount: '$50',
      },
      {
        name: 'Service Fee',
        amount: '$10',
      },
    ];

    this.applicationService.getCountryList().subscribe((response) => {
      this.countries = response;
      this.applicantDetailsForm
        .get('countryCode')
        .patchValue(this.countries[0]);
      // console.log(this.countries);
    });

    this.applicationService.getNationalityList().subscribe((response) => {
      this.nationalityList = response;
      this.applicantDetailsForm
        .get('countryCode')
        .patchValue(this.countries[0]);
      // console.log(this.countries);
    });
  }

  formatDate(date: string) {
    if (date === '') {
      return '-';
    }
    return getDateInFormat(new Date(date));
  }

  handlePersonalDetailsSubmit(nextFunction: any) {
    this.spinner.show();
    console.log('elp-Handle Next', nextFunction);
    this.personalDetailsRequest = new PersonalDetailsRequest();
    this.personalDetailsRequest.applicationId = this.applicationId;
    this.personalDetailsRequest.firstName =
      this.applicantDetailsForm.get('firstName').value;
    this.personalDetailsRequest.lastName =
      this.applicantDetailsForm.get('lastName').value;
    this.personalDetailsRequest.gender =
      this.applicantDetailsForm.get('gender').value.label;
    this.personalDetailsRequest.dateOfBirth =
      this.applicantDetailsForm.get('dateOfBirth').value;
    this.personalDetailsRequest.placeOfBirth =
      this.applicantDetailsForm.get('placeOfBirth').value;
    this.personalDetailsRequest.country =
      this.applicantDetailsForm.get('country').value?.label;
    this.personalDetailsRequest.countryCode =
      this.applicantDetailsForm.get('countryCode').value?.countryCode;
    this.personalDetailsRequest.contactNo =
      this.applicantDetailsForm.get('contactNo').value;
    this.personalDetailsRequest.email =
      this.applicantDetailsForm.get('email').value;

    console.log(this.personalDetailsRequest);

    this.applicationService
      .submitPersonalDetails(this.personalDetailsRequest)
      .subscribe(
        (response) => {
          console.log(mapObjectFromSnakeToCamel(response.data, {}));
          this.spinner.hide();
          if (response.status === 200) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Personal Details Saved Successfully',
            });
            this.spinner.hide();
            nextFunction.emit();
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

  handlePassportDetailsSubmit(nextFunction: any) {
    this.spinner.show();

    this.passportDetailsRequest = new PassportDetailRequest();

    this.passportDetailsRequest.applicationId = this.applicationId;
    this.passportDetailsRequest.passportNumber =
      this.applicantPassportDetailsForm.get('passportNumber').value;
    this.passportDetailsRequest.passportExpiryDate =
      this.applicantPassportDetailsForm.get('passportExpiryDate').value;
    this.passportDetailsRequest.passportDateOfIssue =
      this.applicantPassportDetailsForm.get('passportDateOfIssue').value;
    this.passportDetailsRequest.passportPlaceOfIssue =
      this.applicantPassportDetailsForm.get('passportPlaceOfIssue').value;
    this.passportDetailsRequest.intentedDateOfEntry =
      this.applicantPassportDetailsForm.get('intentedDateOfEntry').value;
    this.passportDetailsRequest.isOtherNationality =
      this.applicantPassportDetailsForm.get('isOtherNationality').value;
    this.passportDetailsRequest.otherNationality =
      this.applicantPassportDetailsForm.get('otherNationality').value;
    this.passportDetailsRequest.yearOfAcquisition =
      this.applicantPassportDetailsForm.get('yearOfAcquisition').value;

    this.applicationService
      .submitPasportDetails(this.passportDetailsRequest)
      .subscribe(
        (response) => {
          this.spinner.hide();
          if (response.status === 200) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Personal Details Saved Successfully',
            });
            this.spinner.hide();
            this.submitedApplicationDetails = mapObjectFromSnakeToCamel(
              response.data,
              {}
            );
            nextFunction.emit();
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
}
