import { Component, inject } from '@angular/core';
import { UtilityService } from '../../../services/utility/utility.service';

@Component({
	selector: 'app-legal',
	standalone: true,
	imports: [],
	templateUrl: './legal.component.html',
	styleUrl: './legal.component.scss',
})
export class LegalComponent {
	utilityService = inject(UtilityService);

	onScrollVert(event: Event) {
		const target = event.target as HTMLElement;
		this.utilityService.scrollPositionSig.update(() => target.scrollTop);
	}
}
