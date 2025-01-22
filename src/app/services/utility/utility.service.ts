import { Injectable, Signal, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { distinctUntilChanged, fromEvent, map, shareReplay, startWith } from 'rxjs';
import { VgApiService } from '@videogular/ngx-videogular/core';
import Hls from 'hls.js';

@Injectable({
	providedIn: 'root',
})
export class UtilityService {
	passwordType: String = 'password';
	passwordIcon: String = 'assets/icons/lock.webp';

	loading: boolean = true;

	imageAddr = 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Bloemen_van_adderwortel_%28Persicaria_bistorta%2C_synoniem%2C_Polygonum_bistorta%29_06-06-2021._%28d.j.b%29.jpg';
	downloadSize = 7300000; //bytes

	bgImageSig = signal<String | undefined>(undefined);

	locationSig = signal<String | undefined>(undefined);
	scrollPositionSig = signal<Number>(0);

	constructor() {}

	async delay(milliseconds: number) {
		return new Promise((resolve) => {
			setTimeout(resolve, milliseconds);
		});
	}

	handlePasswordMasking(): void {
		if (this.passwordType === 'password') {
			this.passwordType = 'text';
			this.passwordIcon = 'assets/icons/visibility.webp';
		} else {
			this.passwordType = 'password';
			this.passwordIcon = 'assets/icons/visibility_off.webp';
		}
	}

	handlePasswordFieldFocus(): void {
		if (this.passwordIcon === 'assets/icons/lock.webp') {
			this.passwordIcon = 'assets/icons/visibility_off.webp';
		}
	}

	formInvalid(formControl: FormControl<string | boolean>): boolean {
		return formControl.invalid && (formControl.touched || formControl.dirty);
	}

	inPreLogin(currentUrl: String) {
		const preLoginUrls = ['/', '/landing', '/login', '/registration'];
		let isInPreLogin: Boolean = false;
		for (const url of preLoginUrls) {
			if (currentUrl === url) {
				isInPreLogin = true;
				break;
			} else {
				isInPreLogin = false;
			}
		}
		return isInPreLogin;
	}

	inPostLogin(currentUrl: String) {
		const preLoginUrls = ['/browse'];
		let isInPreLogin: Boolean = false;
		for (const url of preLoginUrls) {
			if (currentUrl === url) {
				isInPreLogin = true;
				break;
			} else {
				isInPreLogin = false;
			}
		}
		return isInPreLogin;
	}

	inLegals(url: string): boolean {
		return url === '/legal-notice' || url === '/privacy-policy';
	}

	// showProgressMessage(msg) {
	// 	if (console) {
	// 		if (typeof msg == 'string') {
	// 			console.log(msg);
	// 		} else {
	// 			for (var i = 0; i < msg.length; i++) {
	// 				console.log(msg[i]);
	// 			}
	// 		}
	// 	}

	// 	var oProgress = document.getElementById('progress');
	// 	if (oProgress) {
	// 		var actualHTML = typeof msg == 'string' ? msg : msg.join('<br />');
	// 		oProgress.innerHTML = actualHTML;
	// 	}
	// }

	// initiateSpeedDetection() {
	// 	this.showProgressMessage('Loading the image, please wait...');
	// 	window.setTimeout(this.measureConnectionSpeed, 1);
	// }

	// measureConnectionSpeeds() {
	// 	var startTime: any, endTime: any;
	// 	var download = new Image();
	// 	download.onload = function () {
	// 		endTime = new Date().getTime();
	// 		showResults();
	// 	};

	// 	download.onerror = function (err, msg) {
	// 		this.showProgressMessage('Invalid image, or error downloading');
	// 	};

	// 	startTime = new Date().getTime();
	// 	var cacheBuster = '?nnn=' + startTime;
	// 	download.src = imageAddr + cacheBuster;

	// 	function showResults() {
	// 		var duration = (endTime - startTime) / 1000;
	// 		var bitsLoaded = downloadSize * 8;
	// 		var speedBps = (bitsLoaded / duration).toFixed(2);
	// 		var speedKbps = (speedBps / 1024).toFixed(2);
	// 		var speedMbps = (speedKbps / 1024).toFixed(2);
	// 		this.showProgressMessage(['Your connection speed is:', speedBps + ' bps', speedKbps + ' kbps', speedMbps + ' Mbps']);
	// 	}
	// }

	// measureConnectionSpeed() {
	// 	const download = new Image();
	// 	const url = 'http://127.0.0.1:8000/media/sample.jpg';
	// 	const startTime = new Date().getTime();
	// 	// console.log(url);

	// 	download.onload = () => {
	// 		const endTime = new Date().getTime();
	// 		const duration = (endTime - startTime) / 1000;
	// 		const bitsLoaded = 21348301;
	// 		const speedBps = (bitsLoaded / duration).toFixed(2);
	// 		const speedKbps = (Number(speedBps) / 1024).toFixed(2);
	// 		const speedMbps = (Number(speedKbps) / 1024).toFixed(2);
	// 		// console.log(speedKbps + 'Kbps');
	// 		// console.log(speedMbps + 'Mbps');
	// 	};
	// 	download.onerror = () => {
	// 		console.log('Error loading test image.');
	// 	};
	// 	download.src = url;
	// }
}
