import { Component, inject } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { UtilityService } from '../../../services/utility/utility.service';
import { NgStyle } from '@angular/common';
import { VideoplayerComponent } from '../../post-login/videoplayer/videoplayer.component';
import { DbService } from '../../../services/db/db.service';
import { VideoService } from '../../../services/video/video.service';

@Component({
	selector: 'app-main-page',
	standalone: true,
	imports: [HeaderComponent, RouterOutlet, FooterComponent, NgStyle, VideoplayerComponent],
	templateUrl: './main-page.component.html',
	styleUrl: './main-page.component.scss',
})
export class MainPageComponent {
	playerService = inject(VideoService);
	utilityService = inject(UtilityService);
}
