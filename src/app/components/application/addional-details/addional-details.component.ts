import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { StepperModule } from 'primeng/stepper';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ApplicationService } from 'src/app/services/application.service';
import { LoaderComponent } from '../../Shared/loader/loader.component';
import { EmploymentDetailsRequest } from 'src/app/model/employment-details-request';
import { RelativesDetailsRequest } from 'src/app/model/relatives-details-request';
import { AdditionalDetailsRequest } from 'src/app/model/additional-details-request';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { getDateInYYYYMMDD } from '../../Shared/utils';
import { MultiSelectModule } from 'primeng/multiselect';
import { ChipModule } from 'primeng/chip';
import { DialogModule } from 'primeng/dialog';
import { mapObjectFromSnakeToCamel } from 'src/app/utils/switchObjectCase';
import { FileUploadModule } from 'primeng/fileupload';
import { WebcamImage, WebcamModule } from 'ngx-webcam';
import { FileUploadRequest } from 'src/app/model/files-upload-request';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-addional-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    InputTextModule,
    DropdownModule,
    StepperModule,
    ButtonModule,
    SelectButtonModule,
    NgxSpinnerModule,
    LoaderComponent,
    InputNumberModule,
    CalendarModule,
    DividerModule,
    MultiSelectModule,
    ChipModule,
    DialogModule,
    RouterModule,
    FileUploadModule,
    WebcamModule,
  ],
  templateUrl: './addional-details.component.html',
  styleUrl: './addional-details.component.scss',
  providers: [MessageService],
})
export class AddionalDetailsComponent implements OnInit {
  public webcamImage: WebcamImage | null = null;
  public trigger: Subject<void> = new Subject<void>();
  showWebCamModal: boolean = false;
  showPassportFrontCaptureModal: boolean = false;

  referenceId: string;
  active: number = 0;
  nationalityList: any[] = [];
  maxDate: Date;

  employmentDetailsForm: FormGroup;
  relativesDetailsForm: FormGroup;
  additionalDetailsForm: FormGroup;

  employmentDetailsRequest: EmploymentDetailsRequest;
  relativesDetailsRequest: RelativesDetailsRequest;
  additionalDetailsRequest: AdditionalDetailsRequest;
  showConfirmationModal: boolean = false;
  submitedApplicationDetails: any;

  preFetchedPhoto: string | null = null;
  preFetchedPassportFront: string | null = null;

  capturedPhoto: WebcamImage | null = null;
  capturedPassportFront: WebcamImage | null = null;

  photoFile: File | null = null;
  passportFrontFile: File | null = null;
  fileUploadRequest: FileUploadRequest;

  employmentOptions: any[] = [
    { label: 'Work', value: 'Work' },
    { label: 'Study', value: 'Study' },
    { label: 'Neither', value: 'Neither' },
  ];
  genderList: any[] = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
  ];
  maritalStatusOptions: any[] = [
    { label: 'Single', value: 'Single' },
    { label: 'Married', value: 'Married' },
    { label: 'Divorced', value: 'Divorced' },
    { label: 'Separated', value: 'Separated' },
    { label: 'Widowed', value: 'Widowed' },
    { label: 'Civil Partnership', value: 'Civil Partnership' },
    {
      label: 'Dissolved Civil Partnership',
      value: 'Dissolved Civil Partnership',
    },
  ];
  accommodationList: any[] = [
    { label: 'Hotel', value: 'Hotel' },
    { label: 'Individual', value: 'Individual' },
  ];

  yesNoOptions: any[] = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formsBuilder: FormBuilder,
    private applicationService: ApplicationService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService
  ) {
    this.route.params.subscribe((params: Params) => {
      this.referenceId = params.id;
    });

    this.initForm();
  }

  ngOnInit() {
    this.maxDate = new Date();
    this.applicationService.getNationalityList().subscribe((response) => {
      this.nationalityList = response;
    });
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public handleImage(webcamImage: WebcamImage): void {
    this.capturedPhoto = webcamImage;
    this.showWebCamModal = false;
  }

  public handlePassportFrontImage(webcamImage: WebcamImage): void {
    this.capturedPassportFront = webcamImage;
    this.showPassportFrontCaptureModal = false;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  onFileSelect(event: any, type: string) {
    const file = event.files[0];
    if (type === 'photo') {
      this.photoFile = file;
    } else if (type === 'passportFront') {
      this.passportFrontFile = file;
      // this.extractTextFromImage(this.passportFrontFile);
    } else if (type === 'passportBack') {
      // this.passportBackFile = file;
    }
  }

  initForm() {
    this.employmentDetailsForm = this.formsBuilder.group({
      currentlyEmployedOrStudying: ['', Validators.required],
      organizationName: ['', Validators.required],
      workPosition: ['', Validators.required],
      workAddress: ['', Validators.required],
      workTelephone: [undefined, Validators.required],
      workEmail: ['', Validators.required],
      instituteName: ['', Validators.required],
      instituteAddress: ['', Validators.required],
      instituteTelephone: [undefined, Validators.required],
      instituteEmail: ['', Validators.required],
    });

    this.relativesDetailsForm = this.formsBuilder.group({
      maritalStatus: ['', Validators.required],
      partnerSurname: ['', Validators.required],
      partnerName: ['', Validators.required],
      partnerDateOfBirth: ['', Validators.required],
      partnerGender: ['', Validators.required],
      partnerPlaceOfBirth: ['', Validators.required],
      partnerNationality: ['', Validators.required],
      hasMother: ['', Validators.required],
      motherSurname: ['', Validators.required],
      motherName: ['', Validators.required],
      motherDateOfBirth: ['', Validators.required],
      motherPlaceOfBirth: ['', Validators.required],
      hasFather: ['', Validators.required],
      fatherSurname: ['', Validators.required],
      fatherName: ['', Validators.required],
      fatherDateOfBirth: ['', Validators.required],
      fatherPlaceOfBirth: ['', Validators.required],
    });

    this.additionalDetailsForm = this.formsBuilder.group({
      homeAddress: ['', Validators.required],
      typeOfAccommodation: ['', Validators.required],
      hotelName: ['', Validators.required],
      hotelAddress: ['', Validators.required],
      hotelTelephone: [undefined, Validators.required],
      hotelEmail: ['', Validators.required],
      hotelBookingNumber: ['', Validators.required],
      individualName: ['', Validators.required],
      individualAddress: ['', Validators.required],
      individualTelephone: [undefined, Validators.required],
      individualEmail: ['', Validators.required],
      vistedCountriesRecently: ['', Validators.required],
      visitedCountriesDetails: ['', Validators.required],
    });
  }

  handleFileUpload(nextFunction: any) {
    this.spinner.show();

    const formData = new FormData();

    formData.append('referenceId', this.referenceId);

    if (this.photoFile) {
      formData.append('photo', this.photoFile); // Correct file input
    }
    if (this.capturedPhoto) {
      const blob = this.base64ToBlob(this.capturedPhoto.imageAsBase64);
      formData.append('photo', blob, 'photo.jpg');
    }
    if (this.passportFrontFile) {
      formData.append('passportFront', this.passportFrontFile); // Correct file input
    }
    if (this.capturedPassportFront) {
      const blob = this.base64ToBlob(this.capturedPassportFront.imageAsBase64);
      formData.append('passportFront', blob, 'passport-front.jpg');
    }

    // if (this.passportBackFile) {
    //   formData.append('passportBack', this.passportBackFile); // Correct file input
    // }

    // if (this.capturedPassportBack) {
    //   const blob = this.base64ToBlob(this.capturedPassportBack.imageAsBase64);
    //   formData.append('passportBack', blob, 'passport-back.jpg');
    // }

    this.applicationService.uploadDocuments(formData).subscribe(
      (response) => {
        if (response.status === 200) {
          this.spinner.hide();
          this.submitedApplicationDetails = mapObjectFromSnakeToCamel(
            response.data,
            {}
          );
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Document Uploaded Successfully',
          });
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

  handleEmploymentDetailsSubmit(nextFunction: any) {
    this.spinner.show();

    this.employmentDetailsRequest = new EmploymentDetailsRequest();

    this.employmentDetailsRequest.referenceId = this.referenceId;

    this.employmentDetailsRequest.currentlyEmployedOrStudying =
      this.employmentDetailsForm.get('currentlyEmployedOrStudying').value;

    if (this.employmentDetailsRequest.currentlyEmployedOrStudying === 'Work') {
      this.employmentDetailsRequest.employmentOrStudyDetails = {
        organizationName: this.employmentDetailsForm
          .get('organizationName')
          .value?.toUpperCase(),
        workPosition: this.employmentDetailsForm
          .get('workPosition')
          .value?.toUpperCase(),
        workAddress: this.employmentDetailsForm
          .get('workAddress')
          .value?.toUpperCase(),
        workTelephone: this.employmentDetailsForm.get('workTelephone').value,
        workEmail: this.employmentDetailsForm
          .get('workEmail')
          .value?.toUpperCase(),
      };
    }

    if (this.employmentDetailsRequest.currentlyEmployedOrStudying === 'Study') {
      this.employmentDetailsRequest.employmentOrStudyDetails = {
        instituteName: this.employmentDetailsForm
          .get('instituteName')
          .value?.toUpperCase(),
        instituteAddress: this.employmentDetailsForm
          .get('instituteAddress')
          .value?.toUpperCase(),
        instituteTelephone:
          this.employmentDetailsForm.get('instituteTelephone').value,
        instituteEmail: this.employmentDetailsForm
          .get('instituteEmail')
          .value?.toUpperCase(),
      };
    }

    this.applicationService
      .submitEmploymentDetails(this.employmentDetailsRequest)
      .subscribe(
        (response) => {
          if (response.status === 200) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Employment Details Saved Successfully',
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

  handleRelativesDetailsSubmit(nextFunction: any) {
    this.spinner.show();

    this.relativesDetailsRequest = new RelativesDetailsRequest();

    this.relativesDetailsRequest.referenceId = this.referenceId;

    this.relativesDetailsRequest.maritalStatus =
      this.relativesDetailsForm.get('maritalStatus').value;
    this.relativesDetailsRequest.hasMother =
      this.relativesDetailsForm.get('hasMother').value;
    this.relativesDetailsRequest.hasFather =
      this.relativesDetailsForm.get('hasFather').value;

    if (this.relativesDetailsForm.get('maritalStatus').value !== 'Single') {
      this.relativesDetailsRequest.partnerDetails = {
        partnerSurname: this.relativesDetailsForm
          .get('partnerSurname')
          .value?.toUpperCase(),
        partnerName: this.relativesDetailsForm
          .get('partnerName')
          .value?.toUpperCase(),
        partnerDateOfBirth: getDateInYYYYMMDD(
          this.relativesDetailsForm.get('partnerDateOfBirth').value &&
            this.relativesDetailsForm.get('partnerDateOfBirth').value
        ),
        partnerGender:
          this.relativesDetailsForm.get('partnerGender').value?.value,
        partnerPlaceOfBirth: this.relativesDetailsForm
          .get('partnerPlaceOfBirth')
          .value?.toUpperCase(),
        partnerNationality:
          this.relativesDetailsForm.get('partnerNationality').value?.label,
      };
    }

    if (this.relativesDetailsForm.get('hasMother').value) {
      this.relativesDetailsRequest.motherDetails = {
        motherSurname: this.relativesDetailsForm
          .get('motherSurname')
          .value?.toUpperCase(),
        motherName: this.relativesDetailsForm
          .get('motherName')
          .value?.toUpperCase(),
        motherDateOfBirth: getDateInYYYYMMDD(
          this.relativesDetailsForm.get('motherDateOfBirth').value
        ),
        motherPlaceOfBirth: this.relativesDetailsForm
          .get('motherPlaceOfBirth')
          .value?.toUpperCase(),
      };
    }

    if (this.relativesDetailsForm.get('hasFather').value) {
      this.relativesDetailsRequest.fatherDetails = {
        fatherSurname: this.relativesDetailsForm
          .get('fatherSurname')
          .value?.toUpperCase(),
        fatherName: this.relativesDetailsForm
          .get('fatherName')
          .value?.toUpperCase(),
        fatherDateOfBirth: getDateInYYYYMMDD(
          this.relativesDetailsForm.get('fatherDateOfBirth').value
        ),
        fatherPlaceOfBirth: this.relativesDetailsForm
          .get('fatherPlaceOfBirth')
          .value?.toUpperCase(),
      };
    }

    this.applicationService
      .submitRelativesDetails(this.relativesDetailsRequest)
      .subscribe(
        (response) => {
          if (response?.status === 200) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Details Saved Successfully',
            });
            nextFunction.emit();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Something went wrong',
            });
          }
          this.spinner.hide();
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

  handleAdditionalDetailsSubmit() {
    this.spinner.show()
    this.additionalDetailsRequest = new AdditionalDetailsRequest();

    const formValues = this.additionalDetailsForm;
    const requestParams = this.additionalDetailsRequest;
    requestParams.referenceId = this.referenceId;
    requestParams.homeAddress = formValues
      .get('homeAddress')
      .value?.toUpperCase();
    requestParams.typeOfAccommodation = formValues.get(
      'typeOfAccommodation'
    ).value?.value;
    requestParams.vistedCountriesRecently = formValues.get(
      'vistedCountriesRecently'
    ).value;

    if (formValues.get('typeOfAccommodation').value?.value === 'Hotel') {
      requestParams.accommodationDetails = {
        hotelName: formValues.get('hotelName').value?.toUpperCase(),
        hotelAddress: formValues.get('hotelAddress').value?.toUpperCase(),
        hotelTelephone: formValues.get('hotelTelephone').value,
        hotelEmail: formValues.get('hotelEmail').value?.toUpperCase(),
        hotelBookingNumber: formValues
          .get('hotelBookingNumber')
          .value?.toUpperCase(),
      };
    }

    if (formValues.get('typeOfAccommodation').value?.value === 'Individual') {
      requestParams.accommodationDetails = {
        individualName: formValues.get('individualName').value?.toUpperCase(),
        individualAddress: formValues
          .get('individualAddress')
          .value?.toUpperCase(),
        individualTelephone: formValues
          .get('individualTelephone')
          .value,
        individualEmail: formValues.get('individualEmail').value?.toUpperCase(),
      };
    }

    if (formValues.get('vistedCountriesRecently').value) {
      requestParams.visitedCountriesDetails = formValues
        .get('visitedCountriesDetails')
        .value?.map((x) => x.label);
    }

    this.applicationService.submitAdditionalDetails(requestParams).subscribe(
      (response) => {
        if (response.status === 200) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Additional Details Saved Successfully',
          });
          this.showConfirmationModal = true;
          this.submitedApplicationDetails = mapObjectFromSnakeToCamel(
            response.data,
            {}
          );
          this.spinner.hide();
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

  checkEmploymentSectionNextValidation() {
    if (
      this.employmentDetailsForm.get('currentlyEmployedOrStudying').value ===
      'Work'
    ) {
      return !(
        this.employmentDetailsForm.controls['organizationName'].valid &&
        this.employmentDetailsForm.controls['workPosition'].valid &&
        this.employmentDetailsForm.controls['workAddress'].valid &&
        this.employmentDetailsForm.controls['workTelephone'].valid &&
        this.employmentDetailsForm.controls['workEmail']?.valid
      );
    }

    if (
      this.employmentDetailsForm.get('currentlyEmployedOrStudying').value ===
      'Study'
    ) {
      return !(
        this.employmentDetailsForm.controls['instituteName'].valid &&
        this.employmentDetailsForm.controls['instituteAddress'].valid &&
        this.employmentDetailsForm.controls['instituteTelephone'].valid &&
        this.employmentDetailsForm.controls['instituteEmail'].valid
      );
    }

    return !this.employmentDetailsForm.controls['currentlyEmployedOrStudying']
      .valid;
  }

  checkRelationSectionNextValidation() {
    const rdForm = this.relativesDetailsForm;

    const areFieldsValid = (fields: string[]): boolean =>
      fields.every((field) => rdForm.controls[field]?.valid);

    const validatePartnerDetails =
      rdForm.get('maritalStatus').value !== 'Single' &&
      !areFieldsValid([
        'partnerSurname',
        'partnerName',
        'partnerDateOfBirth',
        'partnerGender',
        'partnerPlaceOfBirth',
        'partnerNationality',
      ]);

    const validateMotherDetails =
      rdForm.controls['hasMother'].value &&
      !areFieldsValid([
        'motherSurname',
        'motherName',
        'motherDateOfBirth',
        'motherPlaceOfBirth',
      ]);

    const validateFatherDetails =
      rdForm.controls['hasFather'].value &&
      !areFieldsValid([
        'fatherSurname',
        'fatherName',
        'fatherDateOfBirth',
        'fatherPlaceOfBirth',
      ]);

    return (
      validatePartnerDetails || validateMotherDetails || validateFatherDetails
    );
  }

  checkAdditionalSectionNextValidation() {
    const adForm = this.additionalDetailsForm;

    const areFieldsValid = (fields: string[]): boolean =>
      fields.every((field) => adForm.controls[field]?.valid);

    const typeOfAccommodation = adForm.get('typeOfAccommodation')?.value?.value;

    const validateAccommodationDetails = (() => {
      if (typeOfAccommodation === 'Hotel') {
        return !areFieldsValid([
          'hotelName',
          'hotelAddress',
          'hotelTelephone',
          'hotelEmail',
          'hotelBookingNumber',
        ]);
      } else if (typeOfAccommodation === 'Individual') {
        return !areFieldsValid([
          'individualName',
          'individualAddress',
          'individualTelephone',
          'individualEmail',
        ]);
      }
      return false;
    })();

    const validateRecentTravel =
      adForm.controls['vistedCountriesRecently'].value &&
      !areFieldsValid(['visitedCountriesDetails']);

    const validateHomeAddress = !adForm.controls['homeAddress']?.valid;

    return (
      validateHomeAddress ||
      validateAccommodationDetails ||
      validateRecentTravel
    );
  }

  private base64ToBlob(base64: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = Array.from(byteCharacters, (char) =>
      char.charCodeAt(0)
    );
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'image/jpeg' });
  }
}
