import { ChangeDetectionStrategy, Component, inject, OnInit, signal, Signal } from '@angular/core';
import { SummaryComponent } from '../../uis/widgets/summary/summary.component';
import { TTask } from '../../utils/models/task.model';
import { STORE } from '../../data-access/state/state.store';
import { TaskListComponent } from '../../features/task-list/task-list.component';
import { TitleCasePipe } from '@angular/common';
import { SidenavService } from '../../core/sidenav/sidenav.service';
import { SearchComponent } from '../../uis/input/search/search.component';

@Component({
  selector: 'app-today',
  templateUrl: './today.component.html',
  styleUrls: ['./today.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TaskListComponent, TitleCasePipe, SearchComponent]
})
export class TodayComponent implements OnInit {
  private readonly _sidenavService = inject(SidenavService);
  readonly page = this._sidenavService.navigations.filter(nav => nav.page === '/today')[0];

  TASKS!: Signal<TTask[]>;

  isSearch = signal(false);

  constructor() {
    STORE().task.filter.status.set('today');
    this.TASKS = STORE().task.filter.listComputed;
    console.log('today:', this.TASKS);
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
