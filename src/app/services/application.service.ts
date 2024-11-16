import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { PassportDetailRequest } from '../model/passport-detail-request';
import { FileUploadRequest } from '../model/files-upload-request';
import { EmploymentDetailsRequest } from '../model/employment-details-request';
import { RelativesDetailsRequest } from '../model/relatives-details-request';
import { AdditionalDetailsRequest } from '../model/additional-details-request';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private serverUrl = environment.serverUrl;
  constructor(private http: HttpClient) {}

  getCountryList() {
    return this.http.get<any>('assets/data/countries.json');
  }

  getNationalityList() {
    return this.http.get<any>('assets/data/nationality.json');
  }

  getReport(searchParams: any) {
    return this.http.get<any>('assets/data/sample-report.json');
  }

  getAllApplications() {
    return this.http.get<any>(
      this.serverUrl + '/evisa_applications/get_all_applications'
    );
  }

  getAllSubmittedApplications() {
    return this.http.get<any>(
      this.serverUrl + '/evisa_applications/get_all_submitted_applications'
    );
  }

  createApplication() {
    return this.http.post<any>(this.serverUrl + '/evisa_applications', {});
  }

  deleteApplication(params: any) {
    return this.http.post<any>(
      this.serverUrl + '/evisa_applications/delete',
      params
    );
  }

  submitPersonalDetails(personalDetails: any) {
    return this.http.post<any>(
      this.serverUrl + '/evisa_applications/update_applicant_details',
      personalDetails
    );
  }

  submitPasportDetails(passportDetails: PassportDetailRequest) {
    return this.http.post<any>(
      this.serverUrl + '/evisa_applications/update_passport_details',
      passportDetails
    );
  }

  uploadDocuments(files: any) {
    return this.http.post<any>(
      this.serverUrl + '/evisa_applications/upload_documents',
      files
    );
  }

  submitEmploymentDetails(params: EmploymentDetailsRequest) {
    return this.http.post<any>(
      this.serverUrl + '/evisa_applications/update_employement_details',
      params
    );
  }

  submitRelativesDetails(params: RelativesDetailsRequest) {
    return this.http.post<any>(
      this.serverUrl + '/evisa_applications/update_relatives_details',
      params
    );
  }

  submitAdditionalDetails(params: AdditionalDetailsRequest) {
    return this.http.post<any>(
      this.serverUrl + '/evisa_applications/update_additional_details',
      params
    );
  }

  getApplicationDetails(params: any) {
    return this.http.post<any>(
      this.serverUrl + '/evisa_applications/get_application_details',
      params
    );
  }

  submitApplication(params: any) {
    return this.http.post<any>(
      this.serverUrl + '/evisa_applications/update_status',
      params
    );
  }

  getApplicationStatus(params: any) {
    return this.http.post<any>(
      this.serverUrl + '/evisa_applications/track_status',
      params
    );
  }
}
