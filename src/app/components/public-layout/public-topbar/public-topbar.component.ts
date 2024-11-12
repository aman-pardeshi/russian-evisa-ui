import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-public-topbar',
  standalone: true,
  imports: [ButtonModule, CommonModule, RouterModule, SidebarModule],
  templateUrl: './public-topbar.component.html',
  styleUrl: './public-topbar.component.scss',
})
export class PublicTopbarComponent implements OnInit {
  userDetails: any | null = null;
  showUserIcon: boolean = false;
  private subscription!: Subscription;
  showMobileNavBar: boolean = false;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private userService: UserService
  ) {}

  tabs: MenuItem[] = [
    {
      label: 'Home',
      routerLink: '/',
    },
    {
      label: 'General Information',
      routerLink: '/general-information',
    },
    {
      label: 'Visa Requirement',
      routerLink: '/visa-requirment',
    },
    {
      label: 'Additional Services',
      routerLink: '/additional-services',
    },
    {
      label: 'FAQ',
      routerLink: '/faq',
    },
  ];

  ngOnInit(): void {
    this.subscription = this.userService.isUserLoggedIn$.subscribe(
      (isLoggedIn) => {
        this.showUserIcon = isLoggedIn;
      }
    );

    const userDetailsFromStorage = this.userService.getUserDetails;
    this.userDetails = userDetailsFromStorage?.userData;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  handleLogOut() {
    this.userService.setUserLoggedIn(false);
    this.router.navigate(['/']);
  }

  handleApplyRedirection() {
    if (this.showUserIcon) {
      this.router.navigate(['/application']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  toggleHeader() {
    this.showMobileNavBar = !this.showMobileNavBar;
  }
}
