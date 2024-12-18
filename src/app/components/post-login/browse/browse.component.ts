import { Component } from '@angular/core';
import { VideoplayerComponent } from '../videoplayer/videoplayer.component';

@Component({
	selector: 'app-browse',
	standalone: true,
	imports: [VideoplayerComponent],
	templateUrl: './browse.component.html',
	styleUrl: './browse.component.scss',
})
export class BrowseComponent {}
