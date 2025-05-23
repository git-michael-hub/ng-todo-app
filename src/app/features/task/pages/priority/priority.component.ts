// Angular
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal, Signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';

// Local
import { TTask } from '../../../../utils/models/task.model';
import { STORE_TOKEN } from '../../../../data-access/state/state.store';
import { TaskListComponent } from '../../../../uis/list/task-list/task-list.component';
import { SidenavService } from '../../../../core/sidenav/sidenav.service';
import { TaskService } from '../../task.service';
import { SearchComponent } from '../../../../uis/input/search/search.component';



@Component({
  selector: 'app-priority',
  templateUrl: './priority.component.html',
  styleUrls: ['./priority.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TaskListComponent, TitleCasePipe, SearchComponent]
})
export class PriorityComponent implements OnInit {
  private readonly _STORE = inject(STORE_TOKEN);
  readonly _TASK_SERVICE = inject(TaskService);

  private readonly _SIDE_NAV_SERVICE = inject(SidenavService);
  readonly PAGE = this._SIDE_NAV_SERVICE.navigations.filter(nav => nav.page === '/priority')[0];

  tasks!: Signal<TTask[]>;
  isSearch = signal(false);


  ngOnInit(): void {
    this._STORE().task.filter.status.set('high-priority');
    this.tasks = computed(() =>
      this._STORE().task.filter.listComputed().filter(task => !task.isCompleted)
    );
  }

  toSearch(term: string): void {
    this.tasks = this._TASK_SERVICE.toSearch(
      term,
      'high-priority',
      this.tasks = computed(() =>
        this._STORE().task.filter.listComputed().filter(task => !task.isCompleted)
      )
    );
  }

  closeSearch(): void {
    this.isSearch.set(false);
    this._STORE().task.search.term.set('');

    this.tasks = computed(() =>
      this._STORE().task.filter.listComputed().filter(task => !task.isCompleted)
    );
  }

}
