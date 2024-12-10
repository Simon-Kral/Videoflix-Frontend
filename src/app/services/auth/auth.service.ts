import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { lastValueFrom, Observable } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
	http = inject(HttpClient);
	router = inject(Router);

	constructor() {}

	/**
	 * Sends a signup request to the server to create a new user account.
	 * @param {Object} user - An object containing user signup information.
	 * @returns {Promise<{ user: Object }>} A promise that resolves to the created user object.
	 */
	signup(user: any) {
		const url = environment.baseUrl + '/signup/';
		const body = user;
		return lastValueFrom(this.http.post(url, body) as Observable<{ user: Object }>);
	}

	/**
	 * Logs in a user with email and password credentials.
	 * @param {{ email: string; password: string }} loginData - An object containing the user's email and password.
	 * @returns {Promise<{ token: string; user: Object }>} A promise that resolves to an object containing the authentication token and user data.
	 */
	loginWithEmailAndPassword(loginData: { email: string; password: string }) {
		const url = environment.baseUrl + '/login/';
		const body = loginData;
		return lastValueFrom(this.http.post(url, body) as Observable<{ token: string; user: Object }>);
	}

	/**
	 * Logs out the current user by clearing the token from local and session storage and redirecting to the home page.
	 */
	logout() {
		localStorage.removeItem('token');
		sessionStorage.removeItem('token');
		this.router.navigateByUrl('');
	}

  /**
	 * Fetches the current user's data from the server.
	 * @returns {Promise<{ user: UserInterface }>} A promise that resolves to an object containing the current user data.
	 */
	getUser(): Promise<{ user: any }> {
		const url = environment.baseUrl + '/user/';
		return lastValueFrom(this.http.get(url) as Observable<{ user: any }>);
	}
}
