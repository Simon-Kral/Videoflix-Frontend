import { AfterViewInit, Component, ElementRef, ViewChild, Input, inject, ChangeDetectorRef } from '@angular/core';
import { BitrateOptions, VgApiService, VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { VgStreamingModule } from '@videogular/ngx-videogular/streaming';
import { VideoService } from '../../../services/video/video.service';
import { NgClass } from '@angular/common';

@Component({
	selector: 'app-videoplayer',
	standalone: true,
	imports: [VgCoreModule, VgControlsModule, VgOverlayPlayModule, VgBufferingModule, VgStreamingModule, NgClass],
	templateUrl: './videoplayer.component.html',
	styleUrl: './videoplayer.component.scss',
})
export class VideoplayerComponent {
	@ViewChild('media', { static: true }) media!: ElementRef<HTMLVideoElement>;
	@Input() bgVideo: boolean = false;

	playerService = inject(VideoService);

	videoBitrates?: BitrateOptions[];

	constructor(private cdr: ChangeDetectorRef) {}

	onPlayerReady(source: VgApiService) {
		this.playerService.videoElement = this.media.nativeElement;
		this.playerService.vgApi = source;
		if (!this.bgVideo) this.handleFsVideo();
	}

	ngAfterViewInit(): void {
		this.cdr.detectChanges();
	}

	addBitrates(bitrates: BitrateOptions[]) {
		bitrates.forEach((bitrate) => (bitrate.label = this.getBitrateLabel(bitrate.height)));
		this.videoBitrates = bitrates;
	}

	getBitrateLabel(height: number): string {
		switch (height) {
			case 0:
				return 'auto';
			default:
				return height + 'p';
		}
	}

	handleFsVideo() {
		this.playerService.vgApi.fsAPI.toggleFullscreen();
		this.playerService.vgApi.fsAPI.onChangeFullscreen.subscribe((fullscreen) => {
			this.onToggleFullscreen(fullscreen);
		});
	}

	onToggleFullscreen(fullscreen: any) {
		if (!fullscreen) {
			this.playerService.fsVideoUrlSig.update(() => undefined);
			this.playerService.playVideo('background');
		}
	}
}
