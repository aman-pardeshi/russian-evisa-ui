import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor(private layoutService: LayoutService) {}
  scrollTo(viewChild: HTMLElement) {
    viewChild.scrollIntoView({ behavior: 'smooth' });
  }

  get backgroundStyle(): object {
    let path = 'assets/demo/images/landing/';
    let image =
      this.layoutService.config().colorScheme === 'dark'
        ? 'line-effect-dark.svg'
        : 'line-effect.svg';

    return { 'background-image': 'url(' + path + image + ')' };
  }
}
