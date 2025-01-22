import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { VgApiService } from '@videogular/ngx-videogular/core';
import Hls from 'hls.js';
import { Video } from '../../interfaces/video';
import { UtilityService } from '../utility/utility.service';

@Injectable({
	providedIn: 'root',
})
export class VideoService {
	utilityService = inject(UtilityService);

	videoElement: HTMLVideoElement | undefined;
	vgApi: VgApiService = new VgApiService();

	mainVideoSig = signal<Video | undefined>(undefined);

	fsVideoUrlSig = signal<string | undefined>(undefined);
	bgVideoUrlSig = signal<string | undefined>(undefined);

	constructor() {}

	openVideo(video: Video) {
		this.mainVideoSig.update(() => video);
		if (this.utilityService.bgImageSig()) {
			this.utilityService.bgImageSig.update(() => undefined);
		}
		this.playVideo('background');
	}

	playVideo(element: string) {
		const filePath = this.getFilepath();
		this.utilityService.bgImageSig.update(() => undefined);
		switch (element) {
			case 'fullscreen':
				this.bgVideoUrlSig.update(() => undefined);
				this.fsVideoUrlSig.update(() => environment.baseUrl + 'media/videos/' + filePath);
				break;
			case 'background':
				this.fsVideoUrlSig.update(() => undefined);
				this.bgVideoUrlSig.update(() => environment.baseUrl + 'media/videos/' + filePath);
				break;
		}
	}

	getFilepath() {
		const folderName = this.mainVideoSig()!.id + '_' + this.mainVideoSig()!.title.replace(/ /g, '_') + '/';
		const fileName = 'playlist.m3u8';
		return folderName + fileName;
	}
}
