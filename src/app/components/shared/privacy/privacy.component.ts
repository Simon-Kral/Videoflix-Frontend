import { Component, inject } from '@angular/core';
import { UtilityService } from '../../../services/utility/utility.service';

@Component({
	selector: 'app-privacy',
	standalone: true,
	imports: [],
	templateUrl: './privacy.component.html',
	styleUrl: './privacy.component.scss',
})
export class PrivacyComponent {
	utilityService = inject(UtilityService);

	onScrollVert(event: Event) {
		const target = event.target as HTMLElement;
		this.utilityService.scrollPositionSig.update(() => target.scrollTop);
	}
}
