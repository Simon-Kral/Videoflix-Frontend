import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { lastValueFrom, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UserInterface } from '../../interfaces/user';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	http = inject(HttpClient);
	router = inject(Router);

	currentUserSig = signal<UserInterface | null | undefined>(undefined);

	constructor() {}

	/**
	 * Sends a signup request to the server to create a new user account.
	 * @param {Object} user - An object containing user signup information.
	 * @returns {Promise<{ user: Object }>} A promise that resolves to the created user object.
	 */
	signup(user: any) {
		const url = environment.baseUrl + 'api/registration/';
		const body = user;
		return lastValueFrom(this.http.post(url, body) as Observable<{ user: Object }>);
	}

	/**
	 * Logs in a user with email and password credentials.
	 * @param {{ email: string; password: string }} loginData - An object containing the user's email and password.
	 * @returns {Promise<{ token: string; user: Object }>} A promise that resolves to an object containing the authentication token and user data.
	 */
	loginWithEmailAndPassword(loginData: { email: string; password: string }) {
		const url = environment.baseUrl + 'api/login/';
		const body = loginData;
		return lastValueFrom(this.http.post(url, body) as Observable<{ token: string; user: Object }>);
	}

	/**
	 * Logs out the current user by clearing the token from local and session storage and redirecting to the landing page.
	 */
	logout() {
		localStorage.removeItem('token');
		sessionStorage.removeItem('token');
		this.router.navigateByUrl('/landing');
	}

	forgotPassword(email: string) {
		const url = environment.baseUrl + 'api/forgot-password/';
		const body = { email: email };
		return lastValueFrom(this.http.post(url, body) as Observable<{ message: string }>);
	}

	resetPassword(data: { uidb64: string; token: string; password: string; repeated_password: string }) {
		const url = environment.baseUrl + 'api/reset-password/' + data.uidb64 + '/' + data.token;
		const body = { password: data.password, repeated_password: data.repeated_password };
		return lastValueFrom(this.http.post(url, body) as Observable<{ message: string }>);
	}

	/**
	 * Fetches the current user's data from the server.
	 * @returns {Promise<{ user: UserInterface }>} A promise that resolves to an object containing the current user data.
	 */
	getUser(): Promise<{ user: any }> {
		const url = environment.baseUrl + 'api/user/';
		return lastValueFrom(this.http.get(url) as Observable<{ user: any }>);
	}
}
