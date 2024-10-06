import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { LoginRequest } from 'src/app/model/login-request';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { NgxSpinner, NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { LoaderComponent } from '../Shared/loader/loader.component';

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
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [MessageService],
})
export class LoginComponent {
  loginForm: FormGroup;
  loginRequest: LoginRequest;
  constructor(
    private layoutService: LayoutService,
    private formsBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private messageService: MessageService,
    private spinner: NgxSpinnerService
  ) {
    this.initForm();
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
        console.log(response);
        if (response.data && response?.data?.role === 'applicant') {
          this.spinner.hide();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Logged in successfully',
          });
          this.router.navigate(['/application']);
        } else if (response.data && response?.data?.role === 'admin') {
          this.spinner.hide();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Logged in successfully',
          });
          this.router.navigate(['/dashboard']);
        }
      },
      (error) => {
        console.log(error.error);
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
