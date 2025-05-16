import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';
import { lastValueFrom, Observable } from 'rxjs';
import { VideoResponse } from '../../interfaces/video-response';
import { Category } from '../../interfaces/category';
import { UtilityService } from '../utility/utility.service';

@Injectable({
	providedIn: 'root',
})
export class DbService {
	http = inject(HttpClient);
	authService = inject(AuthService);
	utilityService = inject(UtilityService);

	constructor() {}

	handleBackendErrors(error: unknown) {
		if (error instanceof HttpErrorResponse) {
			let err;
			switch (error.status) {
				case 500:
					err = 'Internal Server Error.';
					break;
				case 0:
					err = 'Server not reachable.';
					break;
				default:
					err = Object.values(error.error)[0] as string;
					break;
			}
			this.utilityService.notificateUser(err);
		}
	}

	getData(endpoint: String) {
		const url = environment.baseUrl + endpoint;
		return lastValueFrom(this.http.get(url) as Observable<any>);
	}

	postData(endpoint: String, data: Object) {
		const url = environment.baseUrl + endpoint;
		const body = data;
		return lastValueFrom(this.http.post(url, body) as Observable<any>);
	}
}
