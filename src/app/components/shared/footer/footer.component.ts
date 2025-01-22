import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UtilityService } from '../../../services/utility/utility.service';
import { NgClass } from '@angular/common';

@Component({
	selector: 'app-footer',
	standalone: true,
	imports: [RouterLink, NgClass],
	templateUrl: './footer.component.html',
	styleUrl: './footer.component.scss',
})
export class FooterComponent {
	utilityService = inject(UtilityService);
}
