import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private serverUrl = environment.serverUrl;
  constructor(private http: HttpClient) {}

  loginUser(details: any) {
    return this.http.post<any>(this.serverUrl + `sessions`, details);
  }
}
