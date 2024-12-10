import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppLayoutComponent } from './layout/app.layout.component';
import { LoginComponent } from './components/login/login.component';
import { ProcessApplicationsComponent } from './components/process-applications/process-applications.component';
import { ReportsComponent } from './components/reports/reports.component';
import { HomeComponent } from './components/home/home.component';
import { GeneralInformationComponent } from './components/general-information/general-information.component';
import { VisaRequirementComponent } from './components/visa-requirement/visa-requirement.component';
import { AdditionalServicesComponent } from './components/additional-services/additional-services.component';
import { PublicLayoutComponent } from './components/public-layout/public-layout.component';
import { AppliedApplicationsComponent } from './components/applied-applications/applied-applications.component';
import { TotalApplicationsComponent } from './components/total-applications/total-applications.component';
import { FaqComponent } from './components/faq/faq.component';
import { EligibleCountriesComponent } from './components/eligible-countries/eligible-countries.component';
import { SignupComponent } from './components/signup/signup.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { RefundPolicyComponent } from './components/refund-policy/refund-policy.component';
import { CookiePolicyComponent } from './components/cookie-policy/cookie-policy.component';
import { TermsConditionComponent } from './components/terms-condition/terms-condition.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'application',
        loadChildren: () =>
          import('./components/application/application.module').then(
            (m) => m.ApplicationModule
          ),
      },
      {
        path: 'user/profile',
        component: UserProfileComponent,
      },
      {
        path: 'general-information',
        component: GeneralInformationComponent,
      },
      {
        path: 'visa-requirment',
        component: VisaRequirementComponent,
      },
      {
        path: 'additional-services',
        component: AdditionalServicesComponent,
      },
      {
        path: 'faq',
        component: FaqComponent,
      },
      {
        path: 'eligible-countries',
        component: EligibleCountriesComponent,
      },
      {
        path: 'privacy-policy',
        component: PrivacyPolicyComponent,
      },
      {
        path: 'refund-policy',
        component: RefundPolicyComponent,
      },
      {
        path: 'cookie-policy',
        component: CookiePolicyComponent,
      },
      {
        path: 'terms-and-conditions',
        component: TermsConditionComponent,
      },
    ],
  },
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      // {
      //   path: 'dashboard',
      //   loadChildren: () =>
      //     import('./demo/components/dashboards/dashboards.module').then(
      //       (m) => m.DashboardsModule
      //     ),
      // },
      {
        path: 'admin/submitted-applications',
        data: { breadcrumb: 'Applications' },
        component: ProcessApplicationsComponent,
      },
      {
        path: 'admin/applied-applications',
        data: { breadcrumb: 'Applications' },
        component: AppliedApplicationsComponent,
      },
      {
        path: 'admin/total-applications',
        data: { breadcrumb: 'Applications' },
        component: TotalApplicationsComponent,
      },
      {
        path: 'admin/reports',
        data: { breadcrumb: 'Reports' },
        component: ReportsComponent,
      },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'auth',
    data: { breadcrumb: 'Auth' },
    loadChildren: () =>
      import('./demo/components/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'landing',
    loadChildren: () =>
      import('./demo/components/landing/landing.module').then(
        (m) => m.LandingModule
      ),
  },
  {
    path: 'notfound',
    loadChildren: () =>
      import('./demo/components/notfound/notfound.module').then(
        (m) => m.NotfoundModule
      ),
  },
  { path: '**', redirectTo: '/notfound' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
