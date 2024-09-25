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
import { MessageService } from 'primeng/api';
import { ApplicationService } from 'src/app/services/application.service';

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
  ],
  templateUrl: './process-applications.component.html',
  styleUrl: './process-applications.component.scss',
  providers: [MessageService],
})
export class ProcessApplicationsComponent {
  applicationSearchForm: FormGroup;
  applicationFilterForm: FormGroup;
  nationalityList: any[] = [];
  statusList: any[] = [];
  categorization: any[] = [];
  showApplicationDetailsDialog: boolean = false;

  applicationsList: any[];
  selectedApplications: any[] = [];

  currentApplicationDetails: any;

  constructor(
    private formsBuilder: FormBuilder,
    private applicationService: ApplicationService,
    private spinner: NgxSpinnerService,
    private messageService: MessageService
  ) {
    this.initForm();
    this.onSearch();
  }

  initForm() {
    this.applicationSearchForm = this.formsBuilder.group({
      query: [''],
      applicantName: [''],
      startDate: [''],
      endDate: [''],
    });

    this.applicationFilterForm = this.formsBuilder.group({
      nationality: [{ label: 'All Nationality', value: 'All' }],
      status: [{ label: 'All Status', value: 'All' }],
      categorization: [{ label: 'All Categorization', value: 'All' }],
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
    const searchParams = {};
    this.applicationService.getReport(searchParams).subscribe((response) => {
      this.applicationsList = response.data;
      this.spinner.hide();
    });
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
      firstName: application.name.split(' ')[0],
      lastName: application.name.split(' ')[1],
      gender: 'Male',
      dateOfBirth: '04 Jun, 1992',
      passportNumber: application.passportNumber,
      passportPlaceOfIssue: 'Mumbai',
      passportExpiryDate: '15 Sept, 2040',
      passportDateOfIssue: '01 Sept, 2020',
      contactNo: '+91 9856432120',
      applicationId: application.applicationNumber,
      status: application.status,
    };
    console.log(application);
  }

  onApprov() {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Application Updated Successfully',
    });
  }

  onFilterChange() {
    this.spinner.show();
    const searchParams = {};
    const nationalityFilter =
      this.applicationFilterForm.get('nationality').value.value === 'All'
        ? ''
        : this.applicationFilterForm.get('nationality').value.value;
    const statusFilter =
      this.applicationFilterForm.get('status').value.value === 'All'
        ? ''
        : this.applicationFilterForm.get('status').value.value;
    const categorizationFilter =
      this.applicationFilterForm.get('categorization').value.value === 'All'
        ? ''
        : this.applicationFilterForm.get('categorization').value.value;

    this.applicationService.getReport(searchParams).subscribe((response) => {
      // debugger
      this.applicationsList = response.data.filter((x) => {
        return (
          x.status.includes(statusFilter) &&
          x.flag.includes(categorizationFilter)
        );
      });

      this.spinner.hide();
    });
  }
}
