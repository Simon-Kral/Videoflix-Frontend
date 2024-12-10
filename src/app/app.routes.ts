import { Routes } from '@angular/router';
import { PreLoginComponent } from './components/pre-login/pre-login.component';
import { LoginComponent } from './components/pre-login/login/login.component';
import { RegistrationComponent } from './components/pre-login/registration/registration.component';
import { LandingComponent } from './components/pre-login/landing/landing.component';
import { ResetPasswordComponent } from './components/pre-login/reset-password/reset-password.component';

export const routes: Routes = [
    { path: '', redirectTo: 'landing', pathMatch: 'full' },
	{
		path: '',
		component: PreLoginComponent,
		children: [
			{ path: 'landing', component: LandingComponent },
			{ path: 'login', component: LoginComponent },
			{ path: 'registration', component: RegistrationComponent },
			{ path: 'reset-password', component: ResetPasswordComponent },
		],
	},
];
