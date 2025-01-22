import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './services/auth/auth.service';
import { UserInterface } from './interfaces/user';
import { UtilityService } from './services/utility/utility.service';
@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
})
export class AppComponent {
	title = 'Videoflix';

	authService = inject(AuthService);
	utilityService = inject(UtilityService);

	private router = inject(Router);
	private navEndEvent = this.router.events.pipe(filter((event) => event instanceof NavigationEnd));

	constructor() {
		this.navEndEvent.subscribe((event) => {
			const currentUrl = event.url;
			const token = this.getToken();
			const user = this.authService.currentUserSig();
			if (token) {
				this.handlePostLoginSection(currentUrl, user);
			} else {
				this.handlePreLoginSection(currentUrl);
			}
			// this.utilityService.hideOverlay(true);
			// this.utilityService.userMenu = false;
		});
		// this.checkViewport();
	}

	getToken(): string | null {
		return localStorage.getItem('token') ? localStorage.getItem('token') : sessionStorage.getItem('token');
	}

	handlePreLoginSection(currentUrl: string): void {
		this.utilityService.locationSig.update(() => {
			return 'pre_login';
		});
		if (this.utilityService.bgImageSig() != 'url(/assets/img/background1.webp)') {
			this.utilityService.bgImageSig.update(() => {
				return 'url(/assets/img/background1.webp)';
			});
		}
		if (currentUrl.includes('/home') && !this.utilityService.inLegals(currentUrl)) {
			this.router.navigateByUrl('/login');
		}
	}

	async handlePostLoginSection(currentUrl: string, user: UserInterface | null | undefined): Promise<void> {
		this.utilityService.locationSig.update(() => {
			return 'post_login';
		});
		if (!this.utilityService.inPostLogin(currentUrl)) {
			this.router.navigateByUrl('/browse');
		}
		if (!user) {
			await this.getUser();
		}
		// if (this.dataSignalsEmpty()) {
		// 	await this.getData();
		// }
	}

	async getUser(): Promise<void> {
		this.utilityService.loading = true;
		let resp = await this.authService.getUser();
		this.authService.currentUserSig.set(resp.user);
		this.utilityService.loading = false;
	}
}
