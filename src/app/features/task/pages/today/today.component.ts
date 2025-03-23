// Angular
import { ChangeDetectionStrategy, Component, inject, OnInit, signal, Signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';

// Local
import { TTask } from '../../../../utils/models/task.model';
import { STORE } from '../../../../data-access/state/state.store';
import { TaskListComponent } from '../../../../uis/list/task-list/task-list.component';
import { SidenavService } from '../../../../core/sidenav/sidenav.service';
import { SearchComponent } from '../../../../uis/input/search/search.component';
import { TaskService } from '../../task.service';



@Component({
  selector: 'app-today',
  templateUrl: './today.component.html',
  styleUrls: ['./today.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TaskListComponent, TitleCasePipe, SearchComponent]
})
export class TodayComponent implements OnInit {
  readonly _TASK_SERVICE = inject(TaskService);

  private readonly _SIDE_NAV_SERVICE = inject(SidenavService);
  readonly PAGE = this._SIDE_NAV_SERVICE.navigations.filter(nav => nav.page === '/today')[0];

  tasks!: Signal<TTask[]>;
  isSearch = signal(false);


  ngOnInit(): void {
    STORE().task.filter.status.set('today');
    this.tasks = STORE().task.filter.listComputed;
  }

  toSearch(term: string): void {
    this.tasks = this._TASK_SERVICE.toSearch(term, 'today', STORE().task.filter.listComputed);
  }

  closeSearch(): void {
    this.isSearch.set(false);
    STORE().task.search.term.set('');
    this.tasks = STORE().task.filter.listComputed;
  }

}
