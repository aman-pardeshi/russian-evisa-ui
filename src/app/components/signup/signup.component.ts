declare var google: any;
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
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { LoaderComponent } from '../Shared/loader/loader.component';
import { DialogModule } from 'primeng/dialog';
import { InputOtpModule } from 'primeng/inputotp';
import { Message, MessageService } from 'primeng/api';
import { interval, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { GoogleAuthService } from 'src/app/google-auth.service';
import { MessagesModule } from 'primeng/messages';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    DividerModule,
    ReactiveFormsModule,
    ToastModule,
    NgxSpinnerModule,
    LoaderComponent,
    DialogModule,
    FormsModule,
    InputOtpModule,
    MessagesModule,
  ],

  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  providers: [MessageService],
})
export class SignupComponent {
  signUpForm: FormGroup;
  showOtpDialogue: boolean = false;
  oneTimePassword: number | undefined;
  messages: Message[] | undefined;
  generatedOtp: number;
  timerSubscription: Subscription;
  timeLeft: number = 60;
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
    this.signUpForm = this.formsBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  get filledInput(): boolean {
    return this.layoutService.config().inputStyle === 'filled';
  }

  loginWithGoogle() {
    this.googleAuthService.signInWithGoogle();
  }

  startTimer(): void {
    this.timeLeft = 600;
    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.timerSubscription.unsubscribe();
      }
    });
  }

  displayTime(seconds: number): string {
    const minutes: number = Math.floor(seconds / 60);
    const remainingSeconds: number = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  sendOtp() {
    this.spinner.show();
    this.generatedOtp = Math.floor(100000 + Math.random() * 900000);

    const otpRequest = {
      email: this.signUpForm.get('email').value,
      otp: this.generatedOtp.toString(),
    };

    this.spinner.hide();
    this.startTimer();
    this.showOtpDialogue = true;

    console.log('OTP => ', otpRequest.otp);

    this.userService.sendOtp(otpRequest).subscribe(
      (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'OTP Send successfully',
        });
      },
      (err) => {
        console.error(err);
      }
    );
  }

  handleOtpSubmit() {
    this.spinner.show();
    // this.isFormEdited = false;
    if (
      this.generatedOtp &&
      this.generatedOtp === +this.oneTimePassword &&
      this.timeLeft > 0
    ) {
      const userParams = {
        name: this.signUpForm.get('name')?.value,
        email: this.signUpForm.get('email')?.value,
        password: this.signUpForm.get('password').value,
      };

      this.userService.signUpUser(userParams).subscribe(
        (response) => {
          if (response.data && response?.data?.role === 'applicant') {
            this.spinner.hide();
            this.showOtpDialogue = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Sign Up successfully',
            });
            const serializedUserData = JSON.stringify({
              authToken: response?.token,
              userData: response?.data,
            });
            localStorage.setItem('userDetails', serializedUserData);
            this.userService.setUserLoggedIn(true);

            this.router.navigate(['/application']);
          } else {
            this.spinner.hide();
            this.messages = [
              {
                severity: 'error',
                detail: 'Something went wrong',
              },
            ];
          }
        },
        (err) => {
          console.error(err);
          this.messages = [
            {
              severity: 'error',
              detail: 'Something went wrong',
            },
          ];
        }
      );
    } else if (this.timeLeft === 0) {
      this.messages = [
        {
          severity: 'error',
          detail: 'Timer has expired. Please resend new OTP',
        },
      ];
    } else {
      this.messages = [{ severity: 'error', detail: 'Incorrect OTP' }];
    }

    this.spinner.hide();
  }

  handleGoogleCredentialResponse(response: any) {
    if (response) {
      const payload = this.decodeToken(response.credential);

      this.spinner.show();
      this.userService.signInWithGoogle(payload).subscribe(
        (response) => {
          console.log(response);
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
          console.log(error);
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
}
