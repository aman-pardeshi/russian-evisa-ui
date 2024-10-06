import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-public-topbar',
  standalone: true,
  imports: [ButtonModule, CommonModule, RouterModule],
  templateUrl: './public-topbar.component.html',
  styleUrl: './public-topbar.component.scss',
})
export class PublicTopbarComponent {
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
  ];
}
