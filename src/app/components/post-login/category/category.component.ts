import { ChangeDetectorRef, Component, inject, Input } from "@angular/core";
import { Video } from "../../../interfaces/video";
import { Category } from "../../../interfaces/category";
import { DomChangeDirective } from "../../../directives/dom-change.directive";
import { UtilityService } from "../../../services/utility/utility.service";
import { VideoService } from "../../../services/video/video.service";
import { DbService } from "../../../services/db/db.service";
import { VideoResponse } from "../../../interfaces/video-response";

@Component({
	selector: "app-category",
	standalone: true,
	imports: [DomChangeDirective],
	templateUrl: "./category.component.html",
	styleUrl: "./category.component.scss",
})
export class CategoryComponent {
	@Input() videoCategory: { count: number; next?: string | undefined; scrollable: boolean; category: Category; videos: Video[] } | undefined;
	@Input() index: number | undefined;
	@Input() main: HTMLElement | undefined;

	dbService = inject(DbService);
	utilityService = inject(UtilityService);
	videoService = inject(VideoService);

	videoWidth: number = 292;
	videosToScroll: number = 1;
	scrolling: Boolean = false;

	constructor(private cdr: ChangeDetectorRef) {}

	async onDomChange(event: Event) {
		for (let i = 0; i < 5; i++) {
			await this.utilityService.delay(200);
			this.cdr.detectChanges();
		}
	}

	scrollLeft(videoList: HTMLElement, direction: string) {
		const newMarginLeft = this.calculateNewMargin(videoList, direction);
		if (!(newMarginLeft >= 0)) {
			videoList.style.marginLeft = `${newMarginLeft}px`;
		} else {
			videoList.style.marginLeft = "0px";
		}
	}

	async loadNext(index: number): Promise<void> {
		try {
			const url = this.videoCategory!.next;
			const endpoint = url?.replace("http://127.0.0.1:8000/", "");
			if (endpoint) {
				const videosResp = (await this.dbService.getData(endpoint)) as VideoResponse;
				this.addNextVideos(videosResp, index);
			}
		} catch (error) {
			this.dbService.handleBackendErrors(error);
		}
	}

	addNextVideos(videosResp: VideoResponse, index: number) {
		if (videosResp.results.length > 0) {
			this.videoService.videosByCategorySig.update((categories) => {
				categories[index].videos = categories[index].videos.concat(videosResp.results);
				categories[index].next = videosResp.next!;
				return categories;
			});
		}
	}

	calculateNewMargin(videoList: HTMLElement, direction: string) {
		const currentMargin = this.getCurrentMargin(videoList);
		switch (direction) {
			case "right":
				return currentMargin - this.videoWidth * this.videosToScroll;
			case "left":
				return currentMargin + this.videoWidth * this.videosToScroll;
		}
		return 0;
	}

	async scrollRight(videoList: HTMLElement, direction: string, currentData: { currentMargin: number; currentVideoListWidth: number }, index: number) {
		const newMarginLeft = this.calculateNewMargin(videoList, direction);
		if (!(-newMarginLeft - this.videoWidth > currentData.currentVideoListWidth)) {
			videoList.style.marginLeft = `${newMarginLeft}px`;
		}
		await this.loadNext(index);
	}

	getCurrentWidth(videoList: HTMLElement) {
		const width = getComputedStyle(videoList).width;
		const widthToNumber = parseInt(width);
		return widthToNumber;
	}

	getCurrentPosition(videoList: HTMLElement) {
		const currentMargin = this.getCurrentMargin(videoList);
		const currentVideoListWidth = this.getCurrentWidth(videoList);
		return { currentMargin: currentMargin, currentVideoListWidth: currentVideoListWidth };
	}

	scrollInDirection(videoList: HTMLElement, direction: string, index: number) {
		const currentPosition = this.getCurrentPosition(videoList);
		switch (direction) {
			case "right":
				this.scrollRight(videoList, direction, currentPosition, index);
				break;
			case "left":
				this.scrollLeft(videoList, direction);
				break;
		}
	}

	getCurrentMargin(videoList: HTMLElement) {
		const marginLeft = getComputedStyle(videoList).marginLeft;
		const marginLeftToNumber = parseInt(marginLeft) === 0 ? 0 : parseInt(marginLeft);
		return marginLeftToNumber;
	}

	// atMaxScrollPosition(vl: HTMLElement, count: number) {
	atMaxScrollPosition(vl: HTMLElement, count: number, i: number) {
		const vlMar = this.getCurrentMargin(vl);
		const currPos = -vlMar + this.videoWidth * this.videosToScroll;
		const totWidth = this.videoWidth * count;
		// if (i == 1) {
		// 	if (this.t) {
		// 		this.t = false;
		// 		console.log('currPos:', currPos, 'totWidth:', totWidth);
		// 		this.utilityService.delay(2000).then(() => {
		// 			this.t = true;
		// 		});
		// 	}
		// }
		return currPos >= totWidth;
	}

	async handleScroll(videoList: HTMLElement, direction: string, index: number) {
		if (!this.scrolling) {
			this.scrolling = true;
			this.scrollInDirection(videoList, direction, index);
			await this.utilityService.delay(300);
			this.scrolling = false;
		} else {
			await this.utilityService.delay(50);
			await this.handleScroll(videoList, direction, index);
		}
	}

	atMinScrollPosition(videoList: HTMLElement) {
		const currentPosition = this.getCurrentPosition(videoList);
		return -currentPosition.currentMargin <= 0;
	}

	toggleBgGradients(index: number, action: string) {
		let elements = document.querySelectorAll(`.idx${index}`);
		elements.forEach((element) => {
			switch (action) {
				case "hide":
					element.classList.add("disabled");
					break;
				case "show":
					element.classList.remove("disabled");
					break;
			}
		});
	}

	scrollToTop(main: HTMLElement) {
		main.scroll({
			top: 0,
			behavior: "smooth",
		});
	}
}
