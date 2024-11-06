import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
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
import {
  getDateInDDMMYYY,
  getDateInFormat,
  getDateInYYYYMMDD,
} from '../../Shared/utils';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { LoaderComponent } from '../../Shared/loader/loader.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ApplicationService } from 'src/app/services/application.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PersonalDetailsRequest } from 'src/app/model/personal-details-request';
import { PassportDetailRequest } from 'src/app/model/passport-detail-request';
import { mapObjectFromSnakeToCamel } from 'src/app/utils/switchObjectCase';
import { FileUploadRequest } from 'src/app/model/files-upload-request';
import { map, Observable, of, Subject } from 'rxjs';
import { WebcamImage, WebcamModule } from 'ngx-webcam';
import { DialogModule } from 'primeng/dialog';
// import * as Tesseract from 'tesseract.js';

interface City {
  name: string;
  code: string;
  countryCode: string;
}

export function asyncEmailValidator(
  control: AbstractControl
): Observable<ValidationErrors | null> {
  return of(control.value).pipe(
    // delay(2000), // Simulate a delay for async validation
    map((email) => {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      return emailRegex.test(email) ? null : { invalidEmail: true };
    })
  );
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
    WebcamModule,
    DialogModule,
  ],
  templateUrl: './personal-details.component.html',
  styleUrl: './personal-details.component.scss',
  providers: [MessageService],
})
export class PersonalDetailsComponent implements OnInit {
  public webcamImage: WebcamImage | null = null;
  public trigger: Subject<void> = new Subject<void>();
  showWebCamModal: boolean = false;
  showPassportFrontCaptureModal: boolean = false;
  showPassportBackCaptureModal: boolean = false;

  applicantDetailsForm: FormGroup;
  applicantPassportDetailsForm: FormGroup;
  countries: City[] | undefined;
  nationalityList: any[] = [];
  genderList: any[] = [];
  maxDate: Date;
  minDate: Date;
  secondMinDate: Date;
  passportExpDate: Date;
  formSubmitted: boolean = false;
  active: number = 0;
  serviceFee: any[];
  otherNationalityOptions: any[] = [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ];
  referenceId: string;
  personalDetailsRequest: PersonalDetailsRequest;
  passportDetailsRequest: PassportDetailRequest;
  submitedApplicationDetails: any;
  photoFile: File | null = null;
  preFetchedPhoto: string | null = null;
  preFetchedPassportFront: string | null = null;
  preFetchedPassportBack: string | null = null;
  capturedPhoto: WebcamImage | null = null;
  capturedPassportFront: WebcamImage | null = null;
  capturedPassportBack: WebcamImage | null = null;
  passportFrontFile: File | null = null;
  passportBackFile: File | null = null;
  fileUploadRequest: FileUploadRequest;

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
      this.referenceId = params.id;
    });

    this.initForm();
  }

  ngOnInit() {
    this.passportExpDate = new Date();
    this.minDate = new Date();
    this.secondMinDate = new Date();
    this.secondMinDate.setDate(this.passportExpDate.getDate() + 1);
    this.maxDate = new Date();
    this.passportExpDate.setDate(this.passportExpDate.getDate() + 180);
    this.fetchFormsOptions();
    this.fetchApplicationDetails();
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

  public handlePassportBackImage(webcamImage: WebcamImage): void {
    this.capturedPassportBack = webcamImage;
    this.showPassportBackCaptureModal = false;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  nextPage() {}

  initForm() {
    this.applicantDetailsForm = this.formsBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      placeOfBirth: ['', Validators.required],
      country: ['', Validators.required],
      countryCode: ['', Validators.required],
      contactNo: [undefined, Validators.required],
      email: [
        '',
        [Validators.required, Validators.email],
        [asyncEmailValidator],
      ],
    });

    this.applicantPassportDetailsForm = this.formsBuilder.group({
      passportNumber: ['', Validators.required],
      passportExpiryDate: ['', Validators.required],
      passportDateOfIssue: ['', Validators.required],
      passportPlaceOfIssue: ['', Validators.required],
      intentedDateOfEntry: ['', Validators.required],
      isOtherNationality: ['', Validators.required],
      otherNationality: ['', Validators.required],
      yearOfAcquisition: [undefined, Validators.required],
    });
  }

  fetchApplicationDetails() {
    const params = {
      referenceId: this.referenceId,
    };
    this.applicationService.getApplicationDetails(params).subscribe(
      (response) => {
        if (response.status === 200) {
          this.spinner.hide();
          this.submitedApplicationDetails = mapObjectFromSnakeToCamel(
            response.data,
            {}
          );

          this.updateFormFields();
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

  updateFormFields() {
    this.applicantDetailsForm.patchValue({
      firstName: this.submitedApplicationDetails.firstName,
      lastName: this.submitedApplicationDetails.lastName,
      gender: this.submitedApplicationDetails.gender
        ? this.genderList.filter(
            (x) => this.submitedApplicationDetails.gender === x.value
          )[0]
        : null,
      dateOfBirth: this.submitedApplicationDetails?.dateOfBirth
        ? new Date(this.submitedApplicationDetails?.dateOfBirth)
        : null,
      placeOfBirth: this.submitedApplicationDetails.placeOfBirth,
      country: this.submitedApplicationDetails.country
        ? this.nationalityList.filter(
            (x) => x.label === this.submitedApplicationDetails.country
          )[0]
        : null,
      countryCode: this.submitedApplicationDetails.countryCode
        ? this.countries?.filter(
            (x) =>
              x.countryCode === this.submitedApplicationDetails?.countryCode
          )[0]
        : null,
      contactNo: this.submitedApplicationDetails.mobile,
      email:
        this.submitedApplicationDetails.email ||
        this.submitedApplicationDetails.groupEmail,
    });

    this.applicantPassportDetailsForm.patchValue({
      passportNumber: this.submitedApplicationDetails?.passportNumber,
      passportExpiryDate: this.submitedApplicationDetails?.passportExpiryDate
        ? new Date(this.submitedApplicationDetails?.passportExpiryDate)
        : null,
      passportDateOfIssue: this.submitedApplicationDetails?.passportDateOfIssue
        ? new Date(this.submitedApplicationDetails?.passportDateOfIssue)
        : null,
      passportPlaceOfIssue:
        this.submitedApplicationDetails?.passportPlaceOfIssue,
      intentedDateOfEntry: this.submitedApplicationDetails?.intentedDateOfEntry
        ? new Date(this.submitedApplicationDetails?.intentedDateOfEntry)
        : null,
      isOtherNationality: this.submitedApplicationDetails?.isOtherNationality,
      otherNationality: this.submitedApplicationDetails?.otherNationality
        ? this.nationalityList.filter(
            (x) => x.label === this.submitedApplicationDetails.otherNationality
          )[0]
        : null,
      yearOfAcquisition:
        this.submitedApplicationDetails?.yearOfAcquistion || null,
    });

    if (this.submitedApplicationDetails?.photo?.url) {
      this.preFetchedPhoto = this.submitedApplicationDetails?.photo?.url;
    }

    if (this.submitedApplicationDetails?.passportPhotoFront?.url) {
      this.preFetchedPassportFront =
        this.submitedApplicationDetails?.passportPhotoFront?.url;
    }

    if (this.submitedApplicationDetails?.passportPhotoBack?.url) {
      this.preFetchedPassportBack =
        this.submitedApplicationDetails?.passportPhotoBack?.url;
    }
  }

  fetchFormsOptions() {
    this.genderList.push(
      { label: 'Male', value: 'Male' },
      { label: 'Female', value: 'Female' }
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
    });

    this.applicationService.getNationalityList().subscribe((response) => {
      this.nationalityList = response;
      this.applicantDetailsForm
        .get('countryCode')
        .patchValue(this.countries[0]);
    });
  }

  formatDate(date: string) {
    if (date === '' || !date) {
      return '-';
    }
    return getDateInFormat(new Date(date));
  }

  handlePersonalDetailsSubmit(nextFunction: any) {
    this.spinner.show();
    this.personalDetailsRequest = new PersonalDetailsRequest();
    this.personalDetailsRequest.referenceId = this.referenceId;
    this.personalDetailsRequest.firstName =
      this.applicantDetailsForm.get('firstName').value;
    this.personalDetailsRequest.lastName =
      this.applicantDetailsForm.get('lastName').value;
    this.personalDetailsRequest.gender =
      this.applicantDetailsForm.get('gender').value?.label;
    this.personalDetailsRequest.dateOfBirth = getDateInYYYYMMDD(
      this.applicantDetailsForm.get('dateOfBirth').value
    );
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

    this.applicationService
      .submitPersonalDetails(this.personalDetailsRequest)
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

    this.passportDetailsRequest.referenceId = this.referenceId;
    this.passportDetailsRequest.passportNumber =
      this.applicantPassportDetailsForm.get('passportNumber').value;
    this.passportDetailsRequest.passportExpiryDate = getDateInYYYYMMDD(
      this.applicantPassportDetailsForm.get('passportExpiryDate').value
    );
    this.passportDetailsRequest.passportDateOfIssue = getDateInYYYYMMDD(
      this.applicantPassportDetailsForm.get('passportDateOfIssue').value
    );
    this.passportDetailsRequest.passportPlaceOfIssue =
      this.applicantPassportDetailsForm.get('passportPlaceOfIssue').value;
    this.passportDetailsRequest.intentedDateOfEntry = getDateInYYYYMMDD(
      this.applicantPassportDetailsForm.get('intentedDateOfEntry').value
    );
    this.passportDetailsRequest.isOtherNationality =
      this.applicantPassportDetailsForm.get('isOtherNationality').value;
    this.passportDetailsRequest.otherNationality =
      this.applicantPassportDetailsForm.get('otherNationality').value?.label;
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

  onFileSelect(event: any, type: string) {
    const file = event.files[0];
    if (type === 'photo') {
      this.photoFile = file;
    } else if (type === 'passportFront') {
      this.passportFrontFile = file;
      this.extractTextFromImage(this.passportFrontFile);
    } else if (type === 'passportBack') {
      this.passportBackFile = file;
    }
  }

  extractTextFromImage(file: File) {
    // Tesseract.recognize(file, 'eng', {
    //   logger: (info) => console.log(info), // Optional: log progress
    // }).then(({ data: { text } }) => {
    //   console.log('extracted-text', text);
    //   // this.fillFormWithExtractedData(text);
    // });
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

    if (this.passportBackFile) {
      formData.append('passportBack', this.passportBackFile); // Correct file input
    }

    if (this.capturedPassportBack) {
      const blob = this.base64ToBlob(this.capturedPassportBack.imageAsBase64);
      formData.append('passportBack', blob, 'passport-back.jpg');
    }

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

  processPayment() {
    this.spinner.show();

    const params = {
      referenceId: this.referenceId,
    };

    this.applicationService.submitApplication(params).subscribe(
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
            detail: 'Application Created Successfully',
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

  private base64ToBlob(base64: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = Array.from(byteCharacters, (char) =>
      char.charCodeAt(0)
    );
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'image/jpeg' });
  }
}
