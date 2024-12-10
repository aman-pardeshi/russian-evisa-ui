import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';

@Component({
  selector: 'app-cookie-policy',
  standalone: true,
  imports: [CommonModule, FormsModule, InputSwitchModule],
  templateUrl: './cookie-policy.component.html',
  styleUrl: './cookie-policy.component.scss',
})
export class CookiePolicyComponent {
  necessaryCookie: boolean = true;
  analyticalCookies: boolean = true;
  FunctionalityCookies: boolean = true;
  TargetingCookie: boolean = true;
}
