import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Validators, ReactiveFormsModule, NonNullableFormBuilder } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { DbService } from '../../../services/db/db.service';
import { UtilityService } from '../../../services/utility/utility.service';
import { UserInterface } from '../../../interfaces/user';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [ReactiveFormsModule, NgClass, RouterLink],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss',
})
export class LoginComponent {
	router = inject(Router);
	authService = inject(AuthService);
	dbService = inject(DbService);
	// guestService = inject(GuestService);
	utilityService = inject(UtilityService);

	fb = inject(NonNullableFormBuilder);

	loginForm = this.fb.group({
		email: ['', [Validators.required, Validators.email]],
		password: ['', [Validators.required, Validators.minLength(8)]],
		rememberMe: [false],
	});

	async onSubmit(): Promise<void> {
		this.utilityService.loading = true;
		try {
			await this.loginUser();
		} catch (error) {
			this.dbService.handleBackendErrors(error);
		}
		this.utilityService.loading = false;
	}

	async loginUser(): Promise<void | null> {
		let loginData = this.createloginData();
		let rememberMe = this.loginForm.controls.rememberMe.value;
		let resp: { token: string; user: Object } = await this.authService.loginWithEmailAndPassword(loginData);
		rememberMe ? localStorage.setItem('token', resp.token) : sessionStorage.setItem('token', resp.token);
		this.authService.currentUserSig.set(resp.user as UserInterface);
		this.loginForm.reset();
		this.router.navigateByUrl('browse');
	}

	createloginData(): { email: string; password: string } {
		const rawData = this.loginForm.getRawValue();
		return { email: rawData.email, password: rawData.password };
	}
}
