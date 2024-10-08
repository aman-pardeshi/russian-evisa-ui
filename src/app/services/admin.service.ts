import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';


@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private serverUrl = environment.serverUrl;
  constructor(private http: HttpClient) {}

  getAllApplications() {
    return this.http.get<any>('')
  }
}