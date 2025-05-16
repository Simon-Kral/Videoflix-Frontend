import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { UtilityService } from '../../../services/utility/utility.service';
import { NgClass } from '@angular/common';
import { VideoService } from '../../../services/video/video.service';

@Component({
	selector: 'app-header',
	standalone: true,
	imports: [RouterLink, NgClass],
	templateUrl: './header.component.html',
	styleUrl: './header.component.scss',
})
export class HeaderComponent {
	authService = inject(AuthService);
	utilityService = inject(UtilityService);
	videoService = inject(VideoService);

	constructor() {}

	logout() {
		this.utilityService.observer?.disconnect();
		this.videoService.bgVideoUrlSig.update(() => undefined);
		this.authService.logout();
	}
}
