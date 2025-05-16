import { ChangeDetectorRef, Component, HostListener, inject, OnInit, signal } from "@angular/core";
import { VideoplayerComponent } from "../videoplayer/videoplayer.component";
import { DbService } from "../../../services/db/db.service";
import { UtilityService } from "../../../services/utility/utility.service";
import { Video } from "../../../interfaces/video";
import { environment } from "../../../../environments/environment";
import { DomChangeDirective } from "../../../directives/dom-change.directive";
import { Category } from "../../../interfaces/category";
import { VideoService } from "../../../services/video/video.service";
import { VideoResponse } from "../../../interfaces/video-response";
import { NgClass } from "@angular/common";
import { CategoryComponent } from "../category/category.component";

@Component({
	selector: "app-browse",
	standalone: true,
	imports: [VideoplayerComponent, CategoryComponent, NgClass],
	templateUrl: "./browse.component.html",
	styleUrl: "./browse.component.scss",
})
export class BrowseComponent implements OnInit {
	dbService = inject(DbService);
	utilityService = inject(UtilityService);
	videoService = inject(VideoService);

	categories: Category[] = [];
	scrolling: Boolean = false;
	categoryUrl: string = "api/categories/";
	videoUrl: string = "api/videos/";
	videosToScroll: number = 1;
	videoWidth: number = 292;
	t: boolean = true;

	@HostListener("window:resize", ["$event"])
	getScreenSize(event?: any) {
		this.utilityService.scrHeight = window.innerHeight;
		this.utilityService.scrWidth = window.innerWidth;
		this.atBreakpoint(this.utilityService.scrWidth);
	}

	constructor(private cdr: ChangeDetectorRef) {
		this.getScreenSize();
	}

	atBreakpoint(scrWidth: number) {
		switch (true) {
			case scrWidth < 1366:
				this.videoWidth = 221;
				break;
			default:
				this.videoWidth = 292;
				break;
		}
	}

	async ngOnInit(): Promise<void> {
		this.utilityService.loading = true;
		this.utilityService.scrollPositionSig.update(() => 0);
		await this.initVideos();
		this.addResizeObserver();
		this.utilityService.loading = false;
	}

	async initVideos() {
		await this.openRandomVideo();
		await this.addNewOnVideoflix();
		await this.getCategories();
		await this.addVideosByCategory();
	}

	addResizeObserver() {
		const videoContainer = document.querySelector(".videos_by_category");
		if (videoContainer) {
			this.utilityService.observer = new ResizeObserver((entries) => {
				entries.forEach((entry) => {
					const displayableVideos = Math.floor(entry.contentRect.width / this.videoWidth);
					if (displayableVideos != this.videosToScroll) this.updateVideoList(displayableVideos);
				});
			});
			this.utilityService.observer.observe(videoContainer);
		}
	}

	async openRandomVideo() {
		try {
			const videosResp = (await this.dbService.getData(this.videoUrl + this.getVideoFilters({}))) as VideoResponse;
			const randomVideoIndex = Math.floor(Math.random() * videosResp.results.length);
			const randomVideo = videosResp.results[randomVideoIndex];
			if (randomVideo) {
				this.videoService.mainVideoSig.update(() => randomVideo);
				this.videoService.initVideoPlayer("background");
			}
		} catch (error) {
			this.dbService.handleBackendErrors(error);
		}
	}

	async addNewOnVideoflix(): Promise<void> {
		try {
			const categoryElement = { id: 0, title: "New on Videoflix" };
			const videosResp = (await this.dbService.getData(this.videoUrl + this.getVideoFilters({ ordering: "-created_at" }))) as VideoResponse;
			this.addToVideoSignal(videosResp, categoryElement);
		} catch (error) {
			this.dbService.handleBackendErrors(error);
		}
	}

	async getCategories(): Promise<void> {
		try {
			this.categories = (await this.dbService.getData(this.categoryUrl)) as Category[];
		} catch (error) {
			this.dbService.handleBackendErrors(error);
		}
	}

	async addVideosByCategory(): Promise<void> {
		try {
			for (let i = 0; i < this.categories.length; i++) {
				const categoryElement = this.categories[i];
				const videosResp = (await this.dbService.getData(this.videoUrl + this.getVideoFilters({ category: categoryElement.id }))) as VideoResponse;
				this.addToVideoSignal(videosResp, categoryElement);
			}
		} catch (error) {
			this.dbService.handleBackendErrors(error);
		}
	}

	addToVideoSignal(videosResp: VideoResponse, categoryElement: Category) {
		if (videosResp.results.length > 0) {
			this.videoService.videosByCategorySig.update((categories) => [
				...categories,
				{
					count: videosResp.count,
					next: videosResp.next!,
					scrollable: videosResp.next ? true : false,
					category: categoryElement,
					videos: videosResp.results,
				},
			]);
		}
	}

	updateVideoList(displayableVideos: number) {
		this.videosToScroll = displayableVideos;
		this.resetMargins();
		this.updateVideos();
	}

	resetMargins() {
		const nodes = document.querySelectorAll(".video_list") as NodeListOf<HTMLElement>;
		for (let i = 0; i < nodes.length; i++) {
			const videoList = nodes[i];
			videoList.style.marginLeft = "0px";
		}
	}

	async updateVideos(): Promise<void> {
		try {
			await this.updateNewOnVideoflix();
			await this.updateVideosByCategory();
		} catch (error) {
			this.dbService.handleBackendErrors(error);
		}
	}

	async updateNewOnVideoflix(): Promise<void> {
		try {
			const videosResp = (await this.dbService.getData(this.videoUrl + this.getVideoFilters({ ordering: "-created_at" }))) as VideoResponse;
			this.changeVideoSignal(0, videosResp);
		} catch (error) {
			this.dbService.handleBackendErrors(error);
		}
	}

	async updateVideosByCategory(): Promise<void> {
		try {
			for (let i = 0; i < this.videoService.videosByCategorySig().length; i++) {
				const videoElement = this.videoService.videosByCategorySig()[i];
				if (videoElement.category.title == "New on Videoflix") continue;
				const videosResp = (await this.dbService.getData(this.videoUrl + this.getVideoFilters({ category: videoElement.category.id }))) as VideoResponse;
				this.changeVideoSignal(i, videosResp);
			}
		} catch (error) {
			this.dbService.handleBackendErrors(error);
		}
	}

	changeVideoSignal(i: number, videosResp: VideoResponse) {
		if (videosResp.results.length > 0) {
			this.videoService.videosByCategorySig.update((categories) => {
				categories[i].videos = videosResp.results;
				categories[i].next = videosResp.next!;
				categories[i].scrollable = videosResp.next ? true : false;
				return categories;
			});
		}
	}

	getVideoFilters(params: { ordering?: string; category?: number }) {
		return `?ordering=${params.ordering ?? ""}&category=${params.category ?? ""}&page_size=${this.videosToScroll + 1}`;
	}

	onScrollVert(event: Event) {
		const target = event.target as HTMLElement;
		this.utilityService.scrollPositionSig.update(() => target.scrollTop);
	}
}
