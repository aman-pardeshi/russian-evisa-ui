import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppTopBarComponent } from 'src/app/layout/app.topbar.component';
import { PublicTopbarComponent } from "./public-topbar/public-topbar.component";
import { PublicFooterComponent } from "./public-footer/public-footer.component";

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, PublicTopbarComponent, PublicFooterComponent],
  templateUrl: './public-layout.component.html',
  styleUrl: './public-layout.component.scss'
})
export class PublicLayoutComponent {

}
