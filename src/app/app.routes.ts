import { Routes } from '@angular/router';
import { LoginComponent } from './components/pre-login/login/login.component';
import { SignupComponent } from './components/pre-login/signup/signup.component';
import { LandingComponent } from './components/pre-login/landing/landing.component';
import { ResetPasswordComponent } from './components/pre-login/reset-password/reset-password.component';
import { BrowseComponent } from './components/post-login/browse/browse.component';
import { PrivacyComponent } from './components/shared/privacy/privacy.component';
import { LegalComponent } from './components/shared/legal/legal.component';
import { MainPageComponent } from './components/shared/main-page/main-page.component';
import { ForgotPasswordComponent } from './components/pre-login/forgot-password/forgot-password.component';

export const routes: Routes = [
	{ path: '', redirectTo: 'landing', pathMatch: 'full' },
	{
		path: '',
		component: MainPageComponent,
		children: [
			{ path: 'landing', component: LandingComponent },
			{ path: 'login', component: LoginComponent },
			{ path: 'signup', component: SignupComponent },
			{ path: 'forgot-password', component: ForgotPasswordComponent },
			{ path: 'reset-password', component: ResetPasswordComponent },
			{ path: 'browse', component: BrowseComponent },
			{ path: 'privacy-policy', component: PrivacyComponent },
			{ path: 'legal-notice', component: LegalComponent },
		],
	},
];
