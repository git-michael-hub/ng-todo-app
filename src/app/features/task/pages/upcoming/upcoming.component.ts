// Angular
import { ChangeDetectionStrategy, Component, inject, OnInit, signal, Signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';

// Local
import { TTask } from '../../../../utils/models/task.model';
import { STORE_TOKEN } from '../../../../data-access/state/state.store';
import { TaskListComponent } from '../../../../uis/list/task-list/task-list.component';
import { SidenavService } from '../../../../core/sidenav/sidenav.service';
import { SearchComponent } from '../../../../uis/input/search/search.component';
import { TaskService } from '../../task.service';



@Component({
  selector: 'app-upcoming',
  templateUrl: './upcoming.component.html',
  styleUrls: ['./upcoming.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TaskListComponent, TitleCasePipe, SearchComponent]
})
export class UpcomingComponent implements OnInit {
  private readonly _STORE = inject(STORE_TOKEN);
  readonly _TASK_SERVICE = inject(TaskService);

  private readonly _SIDE_NAV_SERVICE = inject(SidenavService);
  readonly PAGE = this._SIDE_NAV_SERVICE.navigations.filter(nav => nav.page === '/upcoming')[0];

  tasks!: Signal<TTask[]>;
  isSearch = signal(false);


  ngOnInit(): void {
    this._STORE().task.filter.status.set('upcoming');
    this.tasks = this._STORE().task.filter.listComputed;
  }

  toSearch(term: string): void {
    this.tasks = this._TASK_SERVICE.toSearch(term, 'upcoming', this._STORE().task.filter.listComputed);
  }

  closeSearch(): void {
    this.isSearch.set(false);
    this._STORE().task.search.term.set('');
    this.tasks = this._STORE().task.filter.listComputed;
  }

}
