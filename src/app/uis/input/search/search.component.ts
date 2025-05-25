import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'ui-search',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
    <div class="relative flex items-center">
    <input
      #searchBox
      type="text"
      name="input-search"
      id="search"
      placeholder="Search..."
      class="
        tw-h-[38px] tw-pl-[16px]
        tw-block tw-w-full
        tw-rounded-md
        tw-border-gray-300 tw-pr-12 tw-shadow-sm tw-focus:tw-border-indigo-500
        tw-focus:tw-ring-indigo-500 tw-sm:tw-text-sm tw-disabled:tw-bg-gray-100
      "
      [(ngModel)]="searchTerm"
      [disabled]="isDisabled"
      (keyup)="search(searchBox.value)"
    >
    <div class="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
      <kbd class="inline-flex items-center rounded px-2 font-sans text-sm font-medium text-gray-400">
        <i class="fa fa-search"></i>
      </kbd>
    </div>
  </div>
  `
})
export class SearchComponent {
  @Input() isDisabled: boolean = false;
  @Input() searchTerm: string = '';

  @Output() searchTermFn = new EventEmitter();

  search(term: string) {
    this.searchTermFn.emit(term);
  }
}
