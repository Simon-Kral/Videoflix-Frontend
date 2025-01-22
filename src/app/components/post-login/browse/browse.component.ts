import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { VideoplayerComponent } from '../videoplayer/videoplayer.component';
import { DbService } from '../../../services/db/db.service';
import { UtilityService } from '../../../services/utility/utility.service';
import { Video } from '../../../interfaces/video';
import { environment } from '../../../../environments/environment';
import { DomChangeDirective } from '../../../directives/dom-change.directive';
import { Category } from '../../../interfaces/category';
import { VideoService } from '../../../services/video/video.service';

@Component({
	selector: 'app-browse',
	standalone: true,
	imports: [VideoplayerComponent, DomChangeDirective],
	templateUrl: './browse.component.html',
	styleUrl: './browse.component.scss',
})
export class BrowseComponent implements OnInit {
	dbService = inject(DbService);
	utilityService = inject(UtilityService);
	videoService = inject(VideoService);

	videosByCategorySig = signal<{ title: string; videos: Video[] }[]>([]);

	categories: Category[] = [];
	scrolling: Boolean = false;
	categoryUrl = 'api/categories/';
	videoUrl = 'api/videos/';

	constructor(private cdr: ChangeDetectorRef) {}

	async ngOnInit(): Promise<void> {
		// this.utilityService.measureConnectionSpeed();
		this.utilityService.loading = true;
		await this.openRandomVideo();
		await this.getVideosByCategory();
		this.utilityService.loading = false;
	}

	async openRandomVideo() {
		try {
			const randomVideo = await this.getRandomVideo();
			this.videoService.mainVideoSig.update(() => randomVideo);
			this.videoService.playVideo('background');
		} catch (error) {
			this.dbService.handleBackendErrors(error);
		}
	}

	async getVideosByCategory(): Promise<void> {
		try {
			const categories = await this.getCategories();
			categories?.forEach((category) => this.addVideosToCategory(category));
		} catch (error) {
			this.dbService.handleBackendErrors(error);
		}
	}

	getVideoFilters(params: { ordering?: string; category?: number }) {
		return `?ordering=${params.ordering ?? ''}&category=${params.category ?? ''}`;
	}

	async getRandomVideo() {
		const filterParams = {};
		const videosResp = (await this.dbService.getData(this.videoUrl + this.getVideoFilters(filterParams))) as Video[];
		const randomVideoIndex = Math.floor(Math.random() * videosResp.length);
		return videosResp[randomVideoIndex];
	}

	async getCategories(): Promise<Category[] | null> {
		try {
			const categories = (await this.dbService.getData(this.categoryUrl)) as Category[];
			return categories;
		} catch (error) {
			this.dbService.handleBackendErrors(error);
			return null;
		}
	}

	async addVideosToCategory(category: Category) {
		const filterParams = { category: category.id };
		const videosResp = (await this.dbService.getData(this.videoUrl + this.getVideoFilters(filterParams))) as Video[];
		if (videosResp.length > 0) {
			this.videosByCategorySig.update((categories) => [...categories, { title: category.title, videos: videosResp }]);
		}
	}

	onScrollVert(event: Event) {
		const target = event.target as HTMLElement;
		this.utilityService.scrollPositionSig.update(() => target.scrollTop);
	}

	async handleScroll(videoList: HTMLElement, direction: string) {
		if (!this.scrolling) {
			this.scrolling = true;
			this.scrollInDirection(videoList, direction);
			await this.utilityService.delay(300);
			this.scrolling = false;
		} else {
			await this.utilityService.delay(50);
			await this.handleScroll(videoList, direction);
		}
	}

	scrollInDirection(videoList: HTMLElement, direction: string) {
		const currentPosition = this.getCurrentPosition(videoList);
		switch (direction) {
			case 'right':
				this.scrollRight(videoList, direction, currentPosition);
				break;
			case 'left':
				this.scrollLeft(videoList, direction, currentPosition);
				break;
		}
	}

	scrollRight(videoList: HTMLElement, direction: string, currentData: { currentMargin: number; currentVideoListWidth: number }) {
		const newMarginLeft = this.calculateNewMargin(videoList, direction);
		if (!(-newMarginLeft > currentData.currentVideoListWidth)) {
			videoList.style.marginLeft = `${newMarginLeft}px`;
		}
	}

	scrollLeft(videoList: HTMLElement, direction: string, currentData: { currentMargin: number; currentVideoListWidth: number }) {
		const newMarginLeft = this.calculateNewMargin(videoList, direction);
		if (!(newMarginLeft >= 0)) {
			videoList.style.marginLeft = `${newMarginLeft}px`;
		} else {
			videoList.style.marginLeft = `0px`;
		}
	}

	getCurrentPosition(videoList: HTMLElement) {
		const currentMargin = this.getCurrentMargin(videoList);
		const currentVideoListWidth = this.getCurrentWidth(videoList);
		return { currentMargin: currentMargin, currentVideoListWidth: currentVideoListWidth };
	}

	atMinScrollPosition(videoList: HTMLElement) {
		const currentPosition = this.getCurrentPosition(videoList);
		return -currentPosition.currentMargin <= 0;
	}

	atMaxScrollPosition(videoList: HTMLElement) {
		const currentPosition = this.getCurrentPosition(videoList);
		const newMarginLeft = this.calculateNewMargin(videoList, 'right');
		return -newMarginLeft > currentPosition.currentVideoListWidth;
	}

	getCurrentWidth(videoList: HTMLElement) {
		const width = getComputedStyle(videoList).width;
		const widthToNumber = parseInt(width);
		return widthToNumber;
	}

	getCurrentMargin(videoList: HTMLElement) {
		const marginLeft = getComputedStyle(videoList).marginLeft;
		const marginLeftToNumber = parseInt(marginLeft) === 0 ? 0 : parseInt(marginLeft);
		return marginLeftToNumber === 0 ? 0 : marginLeftToNumber;
	}

	calculateNewMargin(videoList: HTMLElement, direction: string) {
		const currentMargin = this.getCurrentMargin(videoList);
		switch (direction) {
			case 'right':
				return currentMargin - 292.4 * 2;
			case 'left':
				return currentMargin + 292.4 * 2;
		}
		return 0;
	}

	toggleBgGradients(index: number, action: string) {
		let elements = document.querySelectorAll(`.idx${index}`);
		elements.forEach((element) => {
			switch (action) {
				case 'hide':
					element.classList.add('disabled');
					break;
				case 'show':
					element.classList.remove('disabled');
					break;
			}
		});
	}

	async onDomChange(event: Event) {
		for (let i = 0; i < 5; i++) {
			await this.utilityService.delay(200);
			this.cdr.detectChanges();
		}
	}
}
