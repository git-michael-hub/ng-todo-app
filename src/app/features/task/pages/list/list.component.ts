// Angular
import { ChangeDetectionStrategy, Component, inject, OnInit, signal, Signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';

// Local
import { TaskListComponent } from '../../../../uis/list/task-list/task-list.component';
import { TTask } from '../../../../utils/models/task.model';
import { STORE } from '../../../../data-access/state/state.store';
import { SidenavService } from '../../../../core/sidenav/sidenav.service';
import { TaskService } from '../../task.service';
import { SearchComponent } from '../../../../uis/input/search/search.component';



@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TaskListComponent, TitleCasePipe, SearchComponent]
})
export class ListComponent implements OnInit {
  readonly _TASK_SERVICE = inject(TaskService);

  private readonly _SIDE_NAV_SERVICE = inject(SidenavService);
  readonly PAGE = this._SIDE_NAV_SERVICE.navigations.filter(nav => nav.page === '/list')[0];

  tasks!: Signal<TTask[]>;
  isSearch = signal(false);


  ngOnInit(): void {
    STORE().task.sort.status.set('asc');
    this.tasks = STORE().task.sort.listComputed;
  }

  toSearch(term: string): void {
    this.tasks = this._TASK_SERVICE.toSearch(term, 'list', STORE().task.sort.listComputed);
  }

  closeSearch(): void {
    this.isSearch.set(false);
    STORE().task.search.term.set('');
    this.tasks = STORE().task.sort.listComputed;
  }

}
