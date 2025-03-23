import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'ui-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule]
})
export class SearchComponent {
  @Input() isDisabled: boolean = false;
  @Input() searchTerm: string = '';

  @Output() searchTermFn = new EventEmitter();

  search(term: string) {
    this.searchTermFn.emit(term);
  }
}
