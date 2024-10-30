import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ApplicationService } from 'src/app/services/application.service';
import { getDateInFormat } from '../Shared/utils';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

interface City {
  name: string;
  code: string;
  countryCode: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ButtonModule,
    CarouselModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private subscription!: Subscription;
  countries: City[] | undefined;
  visaApprovalDate: string = '';
  showContinueApplicationPopUp: boolean = false;
  isUserLoggedIn = false;
  testimonials: any = [
    {
      reviewer_profile: 'assets/demo/images/avatar/profile.jpg',
      reviewer_name: 'Itachi',
      country: 'Japan',
      review:
        'The team was helpful and attentive, and that they highly recommend the agency.',
    },
    {
      reviewer_profile: 'assets/demo/images/avatar/xuxuefeng.png',
      reviewer_name: 'Itachi',
      country: 'Japan',
      review:
        'The team was helpful and attentive, and that they highly recommend the agency.',
    },
    {
      reviewer_profile: 'assets/demo/images/avatar/ionibowcher.png',
      reviewer_name: 'Itachi',
      country: 'Japan',
      review:
        'Team helped through a roller coaster ride and that they highly recommend them.',
    },
    {
      reviewer_profile: 'assets/demo/images/avatar/asiyajavayant.png',
      reviewer_name: 'Itachi',
      country: 'Japan',
      review:
        'The team was helpful and attentive, and that they highly recommend the agency.',
    },
  ];
  carouselResponsiveOptions = [
    {
      breakpoint: '500px',
      numVisible: 1,
      numScroll: 1,
    },
  ];

  constructor(
    private layoutService: LayoutService,
    private applicationService: ApplicationService,
    private router: Router,
    private userService: UserService
  ) {}
  scrollTo(viewChild: HTMLElement) {
    viewChild.scrollIntoView({ behavior: 'smooth' });
  }

  ngOnInit() {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + 5);
    this.visaApprovalDate = getDateInFormat(newDate);

    this.subscription = this.userService.isUserLoggedIn$.subscribe(
      (isLoggedIn) => {
        this.isUserLoggedIn = isLoggedIn;
        this.showContinueApplicationPopUp = isLoggedIn
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get backgroundStyle(): object {
    let path = 'assets/demo/images/landing/';
    let image =
      this.layoutService.config().colorScheme === 'dark'
        ? 'line-effect-dark.svg'
        : 'line-effect.svg';

    return { 'background-image': 'url(' + path + image + ')' };
  }

  handleApplyRedirection() {
    if (this.isUserLoggedIn) {
      this.router.navigate(['/application']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
