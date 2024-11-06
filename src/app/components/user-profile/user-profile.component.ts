import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { UserService } from 'src/app/services/user.service';
import { LoaderComponent } from '../Shared/loader/loader.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    NgxSpinnerModule,
    LoaderComponent,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
  providers: [MessageService],
})
export class UserProfileComponent implements OnInit {
  userDetailsForm: FormGroup;
  profileImage: File | null = null;
  prefetchProfileImage: string | null = null;

  constructor(
    private formsBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private messageService: MessageService,
    private spinner: NgxSpinnerService
  ) {
    this.initForm();
  }

  initForm() {
    this.userDetailsForm = this.formsBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      contact: [''],
    });
  }

  ngOnInit(): void {
    const { userData } = this.userService.getUserDetails;
    this.userDetailsForm.patchValue({
      name: userData?.name || '',
      email: userData?.email || '',
      contact: userData?.mobile_number || '',
    });

    this.prefetchProfileImage = userData?.profile?.url;
  }
}
