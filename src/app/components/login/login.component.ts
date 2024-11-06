declare var google: any;
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { LoginRequest } from 'src/app/model/login-request';
import { Message, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { NgxSpinner, NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { LoaderComponent } from '../Shared/loader/loader.component';
import { GoogleAuthService } from 'src/app/google-auth.service';
import { interval, Subscription } from 'rxjs';
import { InputOtpModule } from 'primeng/inputotp';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { MessagesModule } from 'primeng/messages';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ButtonModule,
    CarouselModule,
    InputTextModule,
    DividerModule,
    ReactiveFormsModule,
    ToastModule,
    NgxSpinnerModule,
    LoaderComponent,
    DialogModule,
    CommonModule,
    FormsModule,
    MessagesModule,
    InputOtpModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [MessageService],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  loginRequest: LoginRequest;
  isSignin: boolean = true;

  private clientId = environment.googleClientId;
  private sdkLoaded: boolean = false;

  constructor(
    private layoutService: LayoutService,
    private formsBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private messageService: MessageService,
    private spinner: NgxSpinnerService,
    private googleAuthService: GoogleAuthService
  ) {
    this.initForm();
    this.loadGoogleSDK();
  }

  private loadGoogleSDK(): void {
    if (!this.sdkLoaded) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.sdkLoaded = true;
        this.initializeGoogleLogin();
      };
      document.body.appendChild(script);
    }
  }

  private initializeGoogleLogin() {
    if (typeof google !== 'undefined') {
      google.accounts.id.initialize({
        client_id: this.clientId,
        callback: this.handleGoogleCredentialResponse.bind(this),
      });

      google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        {
          theme: 'filled-blue',
          size: 'large',
          shape: 'rectangle',
          width: '100%',
        }
      );
    }
  }

  ngOnInit(): void {
    this.loadGoogleSDK();
    google.accounts.id.renderButton(
      document.getElementById('google-signin-button'),
      {
        theme: 'filled-blue',
        size: 'large',
        shape: 'rectangle',
        width: 350,
      }
    );
  }

  initForm() {
    this.loginForm = this.formsBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  get filledInput(): boolean {
    return this.layoutService.config().inputStyle === 'filled';
  }

  handleLogin() {
    this.spinner.show();
    this.loginRequest = new LoginRequest();
    this.loginRequest.email = this.loginForm.get('email').value;
    this.loginRequest.password = this.loginForm.get('password').value;
    this.userService.loginUser(this.loginRequest).subscribe(
      (response) => {
        if (response.data && response?.data?.role === 'admin') {
          this.spinner.hide();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Logged in successfully',
          });
          const serializedUserData = JSON.stringify({
            authToken: response?.token,
            userData: response?.data,
          });
          localStorage.setItem('userDetails', serializedUserData);
          this.userService.setUserLoggedIn(true);
          this.router.navigate(['/dashboard']);
        } else {
          this.spinner.hide();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Logged in successfully',
          });
          const serializedUserData = JSON.stringify({
            authToken: response?.token,
            userData: response?.data,
          });
          localStorage.setItem('userDetails', serializedUserData);
          this.userService.setUserLoggedIn(true);
          this.router.navigate(['/application']);
        }
      },
      (error) => {
        this.spinner.hide();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error?.error?.message,
        });
      }
    );
  }

  handleSignUp() {}

  loginWithGoogle() {
    this.googleAuthService.signInWithGoogle();
  }

  verifyOtp() {}

  handleGoogleCredentialResponse(response: any) {
    if (response) {
      const payload = this.decodeToken(response.credential);

      this.spinner.show();
      this.userService.signInWithGoogle(payload).subscribe(
        (response) => {
          if (response.data && response?.data?.role !== 'admin') {
            this.spinner.hide();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Logged in successfully',
            });

            const serializedUserData = JSON.stringify({
              authToken: response?.token,
              userData: response?.data,
            });
            localStorage.setItem('userDetails', serializedUserData);
            this.userService.setUserLoggedIn(true);
            this.router.navigate(['/application']);
          }
        },
        (error) => {
          this.spinner.hide();
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error?.error?.message,
          });
        }
      );
    }
  }

  private decodeToken(token: string) {
    const decodedToken = JSON.parse(atob(token.split('.')[1]));

    return {
      google_response: {
        accessToken: '',
        profileObj: {
          googleId: decodedToken?.sub,
          imageUrl: decodedToken?.picture,
          email: decodedToken?.email,
          name: decodedToken?.name,
          givenName: decodedToken?.given_name,
        },
      },
    };
  }

  googleSign() {}
}
