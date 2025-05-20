// Angular
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal, Signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';

// Local
import { TaskListComponent } from '../../../../uis/list/task-list/task-list.component';
import { STORE_TOKEN } from '../../../../data-access/state/state.store';
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
  private readonly _STORE = inject(STORE_TOKEN);
  readonly _TASK_SERVICE = inject(TaskService);

  private readonly _SIDE_NAV_SERVICE = inject(SidenavService);
  readonly PAGE = this._SIDE_NAV_SERVICE.navigations.filter(nav => nav.page === '/recent')[0];

  tasks!: Signal<TTask[]>;
  isSearch = signal(false);


  ngOnInit(): void {
    this._STORE().task.sort.status.set('desc');
    this.tasks = computed(() =>
      this._STORE().task.sort.listComputed().filter(task => !task.isCompleted)
    );
  }

  toSearch(term: string): void {
    this.tasks = this._TASK_SERVICE.toSearch(
      term,
      'recent',
      computed(() =>
        this._STORE().task.sort.listComputed().filter(task => !task.isCompleted)
      )
    );
  }

  closeSearch(): void {
    this.isSearch.set(false);
    this._STORE().task.search.term.set('');

    this.tasks = computed(() =>
      this._STORE().task.sort.listComputed().filter(task => !task.isCompleted)
    );
  }

}
