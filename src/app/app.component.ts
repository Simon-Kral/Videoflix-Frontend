import { Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AuthService } from './services/auth/auth.service';
import { UserInterface } from './interfaces/user';
import { UtilityService } from './services/utility/utility.service';
import { NgStyle } from '@angular/common';
import { DbService } from './services/db/db.service';
@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet, NgStyle],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
})
export class AppComponent implements OnDestroy {
	title = 'Videoflix';

	authService = inject(AuthService);
	dbService = inject(DbService);
	utilityService = inject(UtilityService);

	private router = inject(Router);
	private navEndEvent = this.router.events.pipe(filter((event) => event instanceof NavigationEnd));

	queryParamMapSub: Subscription;
	navEndEventSub: Subscription;

	constructor(private route: ActivatedRoute) {
		this.queryParamMapSub = this.route.queryParamMap.subscribe((params) => {
			const activation = params.get('activation');
			if (activation) {
				this.utilityService.notificateUser(activation);
			}
		});
		this.navEndEventSub = this.navEndEvent.subscribe((event) => {
			this.utilityService.currentUrl = event.url;
			const token = this.getToken();
			if (token) {
				this.handlePostLoginSection();
			} else {
				this.handlePreLoginSection();
			}
		});
	}

	ngOnDestroy(): void {
		this.queryParamMapSub.unsubscribe();
		this.navEndEventSub.unsubscribe();
	}

	getToken(): string | null {
		return localStorage.getItem('token') ? localStorage.getItem('token') : sessionStorage.getItem('token');
	}

	handlePreLoginSection(): void {
		if (this.utilityService.bgImageSig() != 'url(/assets/img/background1.webp)') {
			this.utilityService.bgImageSig.update(() => {
				return 'url(/assets/img/background1.webp)';
			});
		}
		if (this.utilityService.currentUrl.includes('/home') && !this.utilityService.inLegals()) {
			this.router.navigateByUrl('/login');
		}
	}

	async handlePostLoginSection(): Promise<void> {
		if (!this.authService.currentUserSig()) {
			await this.getUser();
		}
		if (this.readyForPostLogin() && !this.utilityService.inLegals()) {
			this.router.navigateByUrl('/browse');
		}
	}

	async getUser(): Promise<void> {
		try {
			this.utilityService.loading = true;
			let resp = await this.authService.getUser();
			this.authService.currentUserSig.set(resp.user);
			this.utilityService.loading = false;
		} catch (error) {
			this.dbService.handleBackendErrors(error);
		}
	}

	readyForPostLogin() {
		return this.authService.currentUserSig() && !this.utilityService.inPostLogin();
	}
}
