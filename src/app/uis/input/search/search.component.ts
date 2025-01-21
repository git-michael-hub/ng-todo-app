import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ui-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule
  ]
})
export class SearchComponent implements OnInit {

  @Input() isDisabled: boolean = false;
  @Output() searchTermFn = new EventEmitter();

  @Input() searchTerm: string = '';
  // get searchTerm(): string {
  //   return this.searchTerm;
  // };
  // set searchTerm(term: string) {
  //   this.searchTerm_ = term;
  //   this.searchTermFn.emit(term);
  // search
  // }

  search(term: string) {
    this.searchTermFn.emit(term);
    console.log('SEARCH:', term);
  }

  constructor() { }

  ngOnInit() {
  }

}
