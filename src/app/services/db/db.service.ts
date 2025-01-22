import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';
import { lastValueFrom, Observable } from 'rxjs';
import { Video } from '../../interfaces/video';
import { Category } from '../../interfaces/category';

@Injectable({
	providedIn: 'root',
})
export class DbService {
	http = inject(HttpClient);
	authService = inject(AuthService);

	backendErrorsSig = signal<any>(undefined);

	constructor() {}

	handleBackendErrors(error: unknown) {
		if (error instanceof HttpErrorResponse) {
			this.renderBackendErrors(error);
		}
	}

	renderBackendErrors(error: HttpErrorResponse) {
		this.backendErrorsSig.update(() => {
			let backendErrors = [];
			for (let value of Object.values(error.error)) {
				backendErrors.push(value);
			}
			return [...backendErrors];
		});
	}

	resetBackendErrors() {
		this.backendErrorsSig.update(() => undefined);
	}

	getData(endpoint: String) {
		const url = environment.baseUrl + endpoint;
		return lastValueFrom(this.http.get(url) as Observable<Video[] | Category[]>);
	}

	getCategoryList() {
		const url = environment.baseUrl + 'api/categories/';
		return lastValueFrom(this.http.get(url) as Observable<Category[]>);
	}

	getVideoList() {
		const url = environment.baseUrl + 'api/videos/';
		return lastValueFrom(this.http.get(url) as Observable<Video[]>);
	}

	getVideo(id: String) {
		const url = environment.baseUrl + 'api/videos/' + id;
		return lastValueFrom(this.http.get(url) as Observable<Video>);
	}
}
