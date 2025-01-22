import { Directive, ElementRef, EventEmitter, OnDestroy, Output } from '@angular/core';

@Directive({
	selector: '[domChange]',
	standalone: true,
})
export class DomChangeDirective implements OnDestroy {
	private changes: MutationObserver;
	private config = { attributes: true, childList: false, characterData: false };

	@Output()
	public domChange = new EventEmitter();

	constructor(private elementRef: ElementRef) {
		const element = this.elementRef.nativeElement;

		this.changes = new MutationObserver((mutations: MutationRecord[]) => {
			mutations.forEach((mutation: MutationRecord) => this.domChange.emit(mutation));
		});

		this.changes.observe(element, this.config);
	}

	ngOnDestroy(): void {
		this.changes.disconnect();
	}
}
