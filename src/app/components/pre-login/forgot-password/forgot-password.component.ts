import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UtilityService } from '../../../services/utility/utility.service';
import { DbService } from '../../../services/db/db.service';
import { NgClass } from '@angular/common';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-forgot-password',
	standalone: true,
	imports: [ReactiveFormsModule, NgClass],
	templateUrl: './forgot-password.component.html',
	styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
	router = inject(Router);
	authService = inject(AuthService);
	dbService = inject(DbService);
	utilityService = inject(UtilityService);

	fb = inject(NonNullableFormBuilder);

	forgotPasswordForm = this.fb.group({
		email: ['', [Validators.required, Validators.email]],
	});

	async onSubmit(): Promise<void> {
		this.utilityService.loading = true;
		await this.sendResetEmail();
		this.utilityService.loading = false;
	}

	async sendResetEmail(): Promise<void> {
		try {
			const rawData = this.forgotPasswordForm.getRawValue();
			const resp = await this.authService.forgotPassword(rawData.email);
			if (resp.message == 'success') {
				this.forgotPasswordForm.reset();
				this.router.navigateByUrl('/');
				this.utilityService.notificateUser('forgot_password');
			}
		} catch (error) {
			this.dbService.handleBackendErrors(error);
		}
	}
}
