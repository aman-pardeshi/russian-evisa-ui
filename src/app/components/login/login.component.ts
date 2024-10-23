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
  signUpForm: FormGroup;
  loginRequest: LoginRequest;
  isSignin: boolean = true;

  showOtpDialogue: boolean = false;
  oneTimePassword: number | undefined;
  messages: Message[] | undefined;
  generatedOtp: number;
  timerSubscription: Subscription;
  timeLeft: number = 60;

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
  }

  ngOnInit(): void {}

  initForm() {
    this.loginForm = this.formsBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.signUpForm = this.formsBuilder.group({
      name: ['', Validators.required],
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
        if (response.data && response?.data?.role === 'applicant') {
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
          this.router.navigate(['/application']);
        } else if (response.data && response?.data?.role === 'admin') {
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
          this.router.navigate(['/dashboard']);
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

      // debugger

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
}
