import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { DbService } from '../../../services/db/db.service';
import { UtilityService } from '../../../services/utility/utility.service';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';

export const passwordsMatchValidator = (password: AbstractControl): ValidatorFn => {
	return (control: AbstractControl): ValidationErrors | null => {
		return password.value != control.value ? { passwordsMatch: 'The Passwords must match.' } : null;
	};
};

@Component({
	selector: 'app-signup',
	standalone: true,
	imports: [ReactiveFormsModule, NgClass],
	templateUrl: './signup.component.html',
	styleUrl: './signup.component.scss',
})
export class SignupComponent {
	router = inject(Router);
	authService = inject(AuthService);
	dbService = inject(DbService);
	utilityService = inject(UtilityService);

	fb = inject(NonNullableFormBuilder);

	signupForm = this.fb.group({
		email: ['', [Validators.required, Validators.email]],
		password: ['', [Validators.required, Validators.minLength(8)]],
		confirmPassword: ['', [Validators.required]],
		rememberMe: [false],
	});

	constructor() {
		this.signupForm.controls.confirmPassword.addValidators(passwordsMatchValidator(this.signupForm.get('password')!));
	}

	async onSubmit(): Promise<void> {
		this.utilityService.loading = true;
		await this.signupUser();
		this.utilityService.loading = false;
	}

	async signupUser(): Promise<void> {
		let user = this.createUserObj();
		try {
			let resp = await this.authService.signup(user);
			this.signupForm.reset();
			this.router.navigateByUrl('/login');
			this.utilityService.notificateUser('activation_mail');
		} catch (error) {
			this.dbService.handleBackendErrors(error);
		}
	}

	createUserObj(): { email: string; password: string } {
		const rawData = this.signupForm.getRawValue();
		const user = {
			email: rawData.email,
			password: rawData.password,
			repeated_password: rawData.confirmPassword,
		};
		return user;
	}
}
