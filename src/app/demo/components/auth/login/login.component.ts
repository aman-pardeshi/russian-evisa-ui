import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
	templateUrl: './login.component.html'
})
export class LoginComponent {

	constructor(private layoutService: LayoutService) {}

	get filledInput(): boolean {
		return this.layoutService.config().inputStyle === 'filled';
	}

}
