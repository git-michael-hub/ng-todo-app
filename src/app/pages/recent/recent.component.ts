import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal, Signal } from '@angular/core';
import { SummaryComponent } from '../../uis/widgets/summary/summary.component';
import { TaskListComponent } from '../../features/task-list/task-list.component';
import { STORE } from '../../data-access/state/state.store';
import { TTask } from '../../utils/models/task.model';
import { SidenavService } from '../../core/sidenav/sidenav.service';
import { TitleCasePipe } from '@angular/common';
import { SearchComponent } from '../../uis/input/search/search.component';

@Component({
  selector: 'app-recent',
  templateUrl: './recent.component.html',
  styleUrls: ['./recent.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TaskListComponent, TitleCasePipe, SearchComponent]
})
export class RecentComponent implements OnInit {
  private readonly _sidenavService = inject(SidenavService);
  readonly page = this._sidenavService.navigations.filter(nav => nav.page === '/recent')[0];

  TASKS!: Signal<TTask[]>;

  isSearch = signal(false);

  // searchTerm: string = '';


  constructor() {
    STORE().task.sort.status.set('desc');

    this.TASKS = STORE().task.sort.listComputed;
    // this.TASKS = this.searchTerm.length > 3
    //   ? STORE().task.search.filteredListByTitle
    //   : STORE().task.sort.listComputed;
    console.log('recent tasks:', this.TASKS);
    console.log('_sidenavService:', this._sidenavService.navigations.filter(nav => nav.page === '/recent'))


  }

  ngOnInit() {
  }

  toSearch(term: string): void {
    // this.searchTerm = term;
    if (!term) {
      this.TASKS = STORE().task.sort.listComputed;
      return;
    }

    STORE().task.search.term.set(term);
    this.TASKS = STORE().task.search.filteredListByTitle;

    //   ? STORE().task.search.filteredListByTitle
  }

  closeSearch(): void {
    this.isSearch.set(false);
    STORE().task.search.term.set('');
    this.TASKS = STORE().task.sort.listComputed;

  }

}
