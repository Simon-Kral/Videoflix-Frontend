import { Injectable, signal } from "@angular/core";
import { FormControl } from "@angular/forms";
import { environment } from "../../../environments/environment";

@Injectable({
	providedIn: "root",
})
export class UtilityService {
	passwordType: String = "password";
	passwordIcon: String = "assets/icons/lock.webp";

	loading: boolean = true;

	downloadSize = 7300000; //bytes

	bgImageSig = signal<string | undefined>(undefined);

	scrollPositionSig = signal<Number>(0);

	observer: ResizeObserver | undefined;
	currentUrl: string = "";

	scrHeight: any;
	scrWidth: any;

	notificationMap = new Map([
		["activation_successful", "The activation of your account was successful."],
		["already_activated", "The account has already been activated."],
		["invalid", "The link is invalid, please retry."],
		["no_user", "No user with the specified email address found."],
		["passwords", "The passwords don't match."],
		["activation_mail", "Your account has been created and an activation link was sent to the specified e-mail address."],
		["forgot_password", "An email with instructions to reset your password was sent."],
		["reset_successful", "Your password was changed successfully."],
	]);
	notifications: string[] = [];

	constructor() {}

	async delay(milliseconds: number) {
		return new Promise((resolve) => {
			setTimeout(resolve, milliseconds);
		});
	}

	handlePasswordMasking(): void {
		if (this.passwordType === "password") {
			this.passwordType = "text";
			this.passwordIcon = "assets/icons/visibility.webp";
		} else {
			this.passwordType = "password";
			this.passwordIcon = "assets/icons/visibility_off.webp";
		}
	}

	handlePasswordFieldFocus(): void {
		if (this.passwordIcon === "assets/icons/lock.webp") {
			this.passwordIcon = "assets/icons/visibility_off.webp";
		}
	}

	formInvalid(formControl: FormControl<string | boolean>): boolean {
		return formControl.invalid && (formControl.touched || formControl.dirty);
	}

	inPreLogin() {
		const preLoginUrls = ["/", "/landing", "/login", "/signup", "/forgot-password", "/reset-password"];
		let isInPreLogin = preLoginUrls.indexOf(this.currentUrl) > -1;
		return isInPreLogin;
	}

	inPostLogin() {
		const postLoginUrls = ["/browse"];
		let isInPostLogin = postLoginUrls.indexOf(this.currentUrl) > -1;
		return isInPostLogin;
	}

	inLegals(): boolean {
		return this.currentUrl === "/legal-notice" || this.currentUrl === "/privacy-policy";
	}

	async notificateUser(keyword: string): Promise<void> {
		if (this.notificationMap.has(keyword)) {
			this.notifications.push(this.notificationMap.get(keyword)!);
		} else {
			this.notifications.push(keyword);
		}
	}
}
