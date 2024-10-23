import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
import { LoaderComponent } from '../Shared/loader/loader.component';
import { TableModule } from 'primeng/table';
import { ApplicationService } from 'src/app/services/application.service';
import { AdminService } from 'src/app/services/admin.service';
import { MessageService } from 'primeng/api';
import { getDateInDDMMYYY } from '../Shared/utils';
// import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    DropdownModule,
    ButtonModule,
    CalendarModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    LoaderComponent,
    TableModule,
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
  providers: [MessageService],
})
export class ReportsComponent implements OnInit {
  reportTypes: any[] = [];
  nationalityList: any[] = [];
  statusList: any[] = [];
  categorization: any[] = [];
  reportSearchForm: FormGroup;

  submittedApplicationReportList: any[] = [];
  appliedVisaReportList: any[] = [];
  processedVisaReportList: any[] = [];
  accountReportsList: any[] = [];
  incompleteApplicationsReportListL: any[] = [];

  header: any[] = [];

  constructor(
    private applicationService: ApplicationService,
    private formsBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private adminService: AdminService,
    private messageService: MessageService
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.reportTypes = [
      { label: 'Application Submitted', value: 'Application Submitted' },
      { label: 'Applied Visa', value: 'Applied Visa' },
      { label: 'Processed Visa', value: 'Processed Visa' },
      { label: 'Account Report', value: 'Account Report' },
      { label: 'Incomplete Application', value: 'Incomplete Application' },
    ];

    this.statusList.push(
      { label: 'Pending', value: 'M' },
      { label: 'Approved', value: 'M' },
      { label: 'Rejected', value: 'M' },
      { label: 'Refunded', value: 'M' }
    );

    this.categorization.push(
      { label: 'Red Applications', value: 'M' },
      { label: 'Blue Applications', value: 'M' },
      { label: 'Green Applications', value: 'M' }
    );

    this.applicationService.getNationalityList().subscribe((response) => {
      this.nationalityList = response;
    });
  }

  initForm() {
    this.reportSearchForm = this.formsBuilder.group({
      reportType: ['', Validators.required],
      startDate: [''],
      endDate: [''],
    });
  }

  onSearch() {
    this.spinner.show();
    this.header = [];
    this.submittedApplicationReportList = [];
    this.appliedVisaReportList = [];
    this.processedVisaReportList = [];
    this.accountReportsList = [];
    this.incompleteApplicationsReportListL = [];

    const searchParams = {
      startDate: this.reportSearchForm.get('startDate').value
        ? getDateInDDMMYYY(this.reportSearchForm.get('startDate').value)
        : '',
      endDate: this.reportSearchForm.get('endDate').value
        ? getDateInDDMMYYY(this.reportSearchForm.get('endDate').value)
        : '',
    };

    // debugger;
    switch (this.reportSearchForm.get('reportType')?.value?.value) {
      case 'Application Submitted':
        this.header = [
          'S.No.',
          'Application ID',
          'Name',
          'Passport Number',
          'Nationality',
          'Visa Fee',
          'Service Fee',
          'Payment Reference Number',
          'Submitted on',
          'Current Stage',
        ];

        this.adminService.getSubmittedApplicationReport(searchParams).subscribe(
          (response) => {
            if (response?.reports?.length > 0) {
              this.submittedApplicationReportList = response?.reports;
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
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error?.error?.message,
            });

            this.spinner.hide();
          }
        );

        break;

      case 'Applied Visa':
        this.header = [
          'S.No.',
          'Application ID',
          'Name',
          'Passport Number',
          'Nationality',
          'Visa Fee',
          'Service Fee',
          'Payment Reference Number',
          'Visa Applied on',
          'Visa Applied by',
          'Current Stage',
        ];

        this.adminService.getAppliedVisaReport(searchParams).subscribe(
          (response) => {
            if (response?.reports?.length > 0) {
              this.appliedVisaReportList = response?.reports;
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
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error?.error?.message,
            });

            this.spinner.hide();
          }
        );

        break;
      case 'Processed Visa':
        this.header = [
          'S.No.',
          'Application ID',
          'Name',
          'Passport Number',
          'Nationality',
          'Visa Fee',
          'Service Fee',
          'Payment Reference Number',
          'Approved/Rejected on',
          'Approved/Rejected by',
          'Current stage',
        ];

        this.adminService.getProcessedVisaReport(searchParams).subscribe(
          (response) => {
            if (response?.reports?.length > 0) {
              this.processedVisaReportList = response?.reports;
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
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error?.error?.message,
            });

            this.spinner.hide();
          }
        );
        break;
      case 'Account Report':
        this.header = [
          'S.No.',
          'Email Address',
          'Name',
          'Created on',
          'Phone number (if applicable)',
          'Number of applications submitted',
          'Number of incomplete applications',
        ];

        this.adminService.getAccountsReport(searchParams).subscribe(
          (response) => {
            if (response?.accounts_reports?.length > 0) {
              this.accountReportsList = response?.accounts_reports;
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
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error?.error?.message,
            });

            this.spinner.hide();
          }
        );
        break;
      case 'Incomplete Application':
        this.header = [
          'S.No.',
          'Application ID',
          'Name',
          'Passport Number',
          'Nationality',
          'Account Email Address',
        ];

        this.adminService
          .getImcompleteApplicationReport(searchParams)
          .subscribe(
            (response) => {
              if (response?.incomplete_applications_reports?.length > 0) {
                this.incompleteApplicationsReportListL =
                  response?.incomplete_applications_reports;
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
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: error?.error?.message,
              });

              this.spinner.hide();
            }
          );
        break;
      default:
        return;
    }
  }

  exportExcel() {
    // this.spinner.show()
    let excelData = [];
    let data: any[];

    const fromDate = getDateInDDMMYYY(
      this.reportSearchForm.get('startDate').value
    );

    const toDate = getDateInDDMMYYY(this.reportSearchForm.get('endDate').value);

    switch (this.reportSearchForm.get('reportType')?.value?.value) {
      case 'Application Submitted':
        excelData = this.submittedApplicationReportList;
        break;

      case 'Applied Visa':
        excelData = this.appliedVisaReportList;
        break;

      case 'Processed Visa':
        excelData = this.processedVisaReportList;
        break;

      case 'Account Report':
        excelData = this.accountReportsList;
        break;

      case 'Incomplete Application':
        excelData = this.incompleteApplicationsReportListL;
        break;

      default:
        return;
    }

    data = excelData;

    const extractedData = data.map(
      (obj: { [s: string]: unknown } | ArrayLike<unknown>) => Object.values(obj)
    );

    for (let count = 0; count < extractedData.length; count++) {
      extractedData[count].unshift(count + 1);
    }

    // const workbook = new Workbook();
    // const worksheet = workbook.addWorksheet('Reports Data');

    // const reportPeriod = worksheet.addRow([
    //   'Report Period : ' + ' From ' + fromDate + ' To ' + toDate,
    // ]);
    // reportPeriod.font = { bold: true };

    // const headerRow = worksheet.addRow(this.header);
    // headerRow.font = { bold: true };

    // headerRow.eachCell((cell, number) => {
    //   cell.fill = {
    //     type: 'pattern',
    //     pattern: 'solid',
    //     fgColor: { argb: 'd8d8d8' },
    //     bgColor: { argb: 'FF0000FF' },
    //   };
    //   cell.border = {
    //     top: { style: 'thin' },
    //     left: { style: 'thin' },
    //     bottom: { style: 'thin' },
    //     right: { style: 'thin' },
    //   };
    // });

    // extractedData.forEach((d: any) => {
    //   const row = worksheet.addRow(d);
    //   //   row.eachCell((cell, number) => {
    //   //      row.eachCell({ includeEmpty: true }, function(cell, number) => {

    //   row.eachCell({ includeEmpty: true }, function (cell, colNumber) {
    //     cell.border = {
    //       top: { style: 'thin' },
    //       left: { style: 'thin' },
    //       bottom: { style: 'thin' },
    //       right: { style: 'thin' },
    //     };
    //   });
    // });

    // worksheet.getColumn(1).width = 33;
    // worksheet.getColumn(2).width = 30;
    // worksheet.getColumn(3).width = 25;
    // worksheet.getColumn(4).width = 35;
    // worksheet.getColumn(5).width = 35;
    // worksheet.getColumn(6).width = 32;
    // worksheet.getColumn(7).width = 35;
    // worksheet.getColumn(8).width = 35;
    // worksheet.getColumn(9).width = 25;
    // worksheet.getColumn(10).width = 30;
    // worksheet.getColumn(11).width = 30;
    // worksheet.getColumn(12).width = 30;

    // const currDate = new Date();
    // const formattedDate = currDate
    //   .toLocaleDateString('en-GB', {
    //     day: 'numeric',
    //     month: 'short',
    //     year: 'numeric',
    //   })
    //   .replace(/ /g, '-');

    // workbook.xlsx.writeBuffer().then((data) => {
    //   const blob = new Blob([data], {
    //     type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    //   });
    //   fs.saveAs(
    //     blob,
    //     this.reportSearchForm.get('reportType')?.value?.value +
    //       '_' +
    //       formattedDate +
    //       '.xlsx'
    //   );
    // });
  }
}
