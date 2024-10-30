import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private serverUrl = environment.serverUrl;
  private userDetails: any | null = null;
  private _isUserLoggedIn$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    this.userDetails = localStorage.getItem('userDetails')
      ? JSON.parse(localStorage.getItem('userDetails'))
      : null;
    this._isUserLoggedIn$.next(this.userDetails !== null);
  }

  get getUserDetails() {
    return this.userDetails;
  }

  get isUserLoggedIn$() {
    return this._isUserLoggedIn$.asObservable();
  }

  setUserLoggedIn(status: boolean): void {
    this._isUserLoggedIn$.next(status);
    if (!status) {
      localStorage.removeItem('userDetails'); // Clear user data on log out
    }
  }

  loginUser(details: any) {
    return this.http.post<any>(this.serverUrl + `/sessions`, details);
  }

  sendOtp(details: any) {
    return this.http.post<any>(this.serverUrl + `/users/send_otp`, details);
  }

  signUpUser(details: any) {
    return this.http.post<any>(this.serverUrl + `/users`, details);
  }

  logOutUser() {}

  signInWithGoogle(details: any) {
    return this.http.post<any>(this.serverUrl + `/sessions/google`, details);
  }
}
