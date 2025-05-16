import { NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { DbService } from '../../../services/db/db.service';
import { UtilityService } from '../../../services/utility/utility.service';

export const passwordsMatchValidator = (password: AbstractControl): ValidatorFn => {
	return (control: AbstractControl): ValidationErrors | null => {
		return password.value != control.value ? { passwordsMatch: 'The Passwords must match.' } : null;
	};
};
@Component({
	selector: 'app-reset-password',
	standalone: true,
	imports: [ReactiveFormsModule, NgClass],
	templateUrl: './reset-password.component.html',
	styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
	router = inject(Router);
	authService = inject(AuthService);
	dbService = inject(DbService);
	utilityService = inject(UtilityService);

	fb = inject(NonNullableFormBuilder);

	uidb64: string | null;
	token: string | null;

	resetPasswordForm = this.fb.group({
		password: ['', [Validators.required, Validators.minLength(8)]],
		confirmPassword: ['', [Validators.required]],
	});

	constructor(private route: ActivatedRoute) {
		this.resetPasswordForm.controls.confirmPassword.addValidators(passwordsMatchValidator(this.resetPasswordForm.get('password')!));
		this.uidb64 = this.route.snapshot.queryParamMap.get('uidb64');
		this.token = this.route.snapshot.queryParamMap.get('token');
	}

	async onSubmit(): Promise<void> {
		this.utilityService.loading = true;
		await this.resetPassword();
		this.utilityService.loading = false;
	}

	async resetPassword(): Promise<void> {
		try {
			if (this.uidb64 && this.token) {
				const rawData = this.resetPasswordForm.getRawValue();
				const resetData = { uidb64: this.uidb64, token: this.token, password: rawData.password, repeated_password: rawData.confirmPassword };
				const resp = await this.authService.resetPassword(resetData);
				this.resetPasswordForm.reset();
				this.utilityService.notificateUser(resp.message);
			} else {
				this.utilityService.notificateUser('invalid');
			}
			this.router.navigateByUrl('/login');
		} catch (error) {
			this.dbService.handleBackendErrors(error);
		}
	}
}
