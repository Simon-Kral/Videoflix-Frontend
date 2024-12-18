import { Routes } from '@angular/router';
import { PreLoginComponent } from './components/pre-login/pre-login.component';
import { LoginComponent } from './components/pre-login/login/login.component';
import { RegistrationComponent } from './components/pre-login/registration/registration.component';
import { LandingComponent } from './components/pre-login/landing/landing.component';
import { ResetPasswordComponent } from './components/pre-login/reset-password/reset-password.component';
import { PostLoginComponent } from './components/post-login/post-login.component';
import { BrowseComponent } from './components/post-login/browse/browse.component';

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
	{ path: 'home', redirectTo: 'home/browse', pathMatch: 'full' },
	{
		path: 'home',
		component: PostLoginComponent,
		children: [
			{ path: 'browse', component: BrowseComponent },
		],
	},
];
