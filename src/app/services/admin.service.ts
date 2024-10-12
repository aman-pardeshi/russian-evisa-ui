import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private serverUrl = environment.serverUrl;
  constructor(private http: HttpClient) {}

  getAllApplications(params: any) {
    return this.http.post<any>(
      this.serverUrl + '/admin/all_applications',
      params
    );
  }

  getSubmittedApplications(params: any) {
    return this.http.post<any>(
      this.serverUrl + '/admin/submitted_applications',
      params
    );
  }

  getAppliedApplication(params: any) {
    return this.http.post<any>(
      this.serverUrl + '/admin/applied_applications',
      params
    );
  }

  applyVisaForApplication(params: any) {
    return this.http.post<any>(this.serverUrl + '/admin/apply_visa', params);
  }

  approveApplication(params: any) {
    return this.http.post<any>(this.serverUrl + '/admin/approve_visa', params);
  }

  rejectApplication(params: any) {
    return this.http.post<any>(this.serverUrl + '/admin/reject_visa', params);
  }

  // Reports APIs
  getSubmittedApplicationReport(params: any) {
    return this.http.post<any>(
      this.serverUrl + '/report/submitted_applications',
      params
    );
  }

  getAppliedVisaReport(params: any) {
    return this.http.post<any>(this.serverUrl + '/report/applied_visa', params);
  }

  getProcessedVisaReport(params: any) {
    return this.http.post<any>(
      this.serverUrl + '/report/processed_visa',
      params
    );
  }

  getAccountsReport(params: any) {
    return this.http.post<any>(
      this.serverUrl + '/report/accounts_report',
      params
    );
  }

  getImcompleteApplicationReport(params: any) {
    return this.http.post<any>(
      this.serverUrl + '/report/incomplete_applications',
      params
    );
  }
}
