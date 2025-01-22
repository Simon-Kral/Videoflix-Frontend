import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { UtilityService } from '../../../services/utility/utility.service';
import { NgClass } from '@angular/common';

@Component({
	selector: 'app-header',
	standalone: true,
	imports: [RouterLink, NgClass],
	templateUrl: './header.component.html',
	styleUrl: './header.component.scss',
})
export class HeaderComponent {
	currentRouteSig = signal<String>('');

	authService = inject(AuthService);
	utilityService = inject(UtilityService);

	constructor(private router: Router) {
		router.events.subscribe((val) => {
			if (val instanceof NavigationEnd) {
				this.currentRouteSig.update(() => val.url);
				// console.log(this.currentRouteSig());
			}
		});
	}

	login() {
		this.router.navigateByUrl('browse');
	}

	logout() {
		this.authService.logout();
	}
}
