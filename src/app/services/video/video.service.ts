import { inject, Injectable, signal } from "@angular/core";
import { environment } from "../../../environments/environment";
import { VgApiService } from "@videogular/ngx-videogular/core";
import Hls from "hls.js";
import { Video } from "../../interfaces/video";
import { UtilityService } from "../utility/utility.service";
import { DbService } from "../db/db.service";
import { Subscription } from "rxjs";
import { Category } from "../../interfaces/category";

@Injectable({
	providedIn: "root",
})
export class VideoService {
	utilityService = inject(UtilityService);
	dbService = inject(DbService);

	videoElement: HTMLVideoElement | undefined;
	vgApi: VgApiService = new VgApiService();

	mainVideoSig = signal<Video | undefined>(undefined);
	videosByCategorySig = signal<{ count: number; next?: string; scrollable: boolean; category: Category; videos: Video[] }[]>([]);

	fsVideoUrlSig = signal<string | undefined>(undefined);
	bgVideoUrlSig = signal<string | undefined>(undefined);

	currentTime: number = 0;

	fullscreenSub: Subscription | undefined;
	endedSub: Subscription | undefined;
	ended: boolean = false;

	constructor() {}

	openVideo(video: Video) {
		this.mainVideoSig.update(() => video);
		if (this.utilityService.bgImageSig()) {
			this.utilityService.bgImageSig.update(() => undefined);
		}
		this.initVideoPlayer("background");
	}

	async initVideoPlayer(option: string) {
		const filePath = this.getFilepath();
		this.utilityService.bgImageSig.update(() => undefined);
		switch (option) {
			case "fullscreen":
				this.bgVideoUrlSig.update(() => undefined);
				await this.getWatchedTime();
				this.fsVideoUrlSig.update(() => environment.baseUrl + "media/videos/" + filePath);
				break;
			case "background":
				this.fsVideoUrlSig.update(() => undefined);
				this.bgVideoUrlSig.update(() => environment.baseUrl + "media/videos/" + filePath);
				break;
		}
	}

	getFilepath() {
		const folderName = this.mainVideoSig()!.id + "_" + this.mainVideoSig()!.title.replace(/ /g, "_") + "/";
		const fileName = "playlist.m3u8";
		return folderName + fileName;
	}

	async getWatchedTime() {
		this.utilityService.loading = true;
		try {
			const url = "api/watched_time/" + this.mainVideoSig()?.id;
			const watchedTimeResp = await this.dbService.getData(url);
			this.currentTime = watchedTimeResp.watched_time;
		} catch (error) {
			this.dbService.handleBackendErrors(error);
		}
		this.utilityService.loading = false;
	}

	async sendWatchedTime(time: number) {
		try {
			const url = "api/watched_time/" + this.mainVideoSig()?.id;
			const watchedTime = { watched_time: time };
			await this.dbService.postData(url, watchedTime);
		} catch (error) {
			this.dbService.handleBackendErrors(error);
		}
	}

	async playVideo(media: HTMLVideoElement, source: VgApiService, playInBackground: boolean) {
		this.videoElement = media;
		this.vgApi = source;
		switch (playInBackground) {
			case true:
				this.setBgOptions();
				break;
			case false:
				await this.setFsOptions();
				break;
		}
	}

	setBgOptions() {
		this.videoElement!.loop = true;
	}

	async setFsOptions() {
		this.vgApi.currentTime = this.currentTime;
		await this.vgApi.fsAPI.toggleFullscreen();
		this.subscribeChanges();
	}

	subscribeChanges() {
		this.fullscreenSub = this.vgApi.fsAPI.onChangeFullscreen.subscribe((fullscreen) => {
			if (!fullscreen) {
				this.closeFullscreen();
			}
		});
		this.endedSub = this.vgApi.getDefaultMedia().subscriptions.ended.subscribe(($event) => {
			this.ended = true;
		});
	}

	async closeFullscreen() {
		const watchedTime = this.ended ? 0 : this.vgApi.currentTime;
		await this.sendWatchedTime(watchedTime);
		await this.initVideoPlayer("background");
		this.resetFsValues();
	}

	resetFsValues() {
		this.fsVideoUrlSig.update(() => undefined);
		this.ended = false;
		this.fullscreenSub?.unsubscribe();
		this.endedSub?.unsubscribe();
	}

	stopAll() {
		this.fsVideoUrlSig.update(() => undefined);
		this.bgVideoUrlSig.update(() => undefined);
		this.utilityService.bgImageSig.update(() => undefined);
	}
}
