// Angular
import { ChangeDetectionStrategy, Component, inject, OnInit, signal, Signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';

// Local
import { TaskListComponent } from '../../../../uis/list/task-list/task-list.component';
import { STORE } from '../../../../data-access/state/state.store';
import { TTask } from '../../../../utils/models/task.model';
import { SidenavService } from '../../../../core/sidenav/sidenav.service';
import { SearchComponent } from '../../../../uis/input/search/search.component';
import { TaskService } from '../../task.service';



@Component({
  selector: 'app-recent',
  templateUrl: './recent.component.html',
  styleUrls: ['./recent.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TaskListComponent, TitleCasePipe, SearchComponent]
})
export class RecentComponent implements OnInit {
  readonly _TASK_SERVICE = inject(TaskService);

  private readonly _SIDE_NAV_SERVICE = inject(SidenavService);
  readonly PAGE = this._SIDE_NAV_SERVICE.navigations.filter(nav => nav.page === '/recent')[0];

  tasks!: Signal<TTask[]>;
  isSearch = signal(false);


  ngOnInit(): void {
    STORE().task.sort.status.set('desc');
    this.tasks = STORE().task.sort.listComputed;
  }

  toSearch(term: string): void {
    this.tasks = this._TASK_SERVICE.toSearch(term, 'recent', STORE().task.sort.listComputed);
  }

  closeSearch(): void {
    this.isSearch.set(false);
    STORE().task.search.term.set('');
    this.tasks = STORE().task.sort.listComputed;
  }

}
