// Angular
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  Signal,
  signal,
  WritableSignal
} from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';

// Local
import { TSORT, TTask } from '../../../../utils/models/task.model';
import { STORE_TOKEN } from '../../../../data-access/state/state.store';
import { TaskService } from '../../task.service';
import { FilterBtnComponent } from '../../../../uis/button/filter-btn.component';
import { SortBtnComponent } from '../../../../uis/button/sort-btn.component';
import { SearchComponent } from '../../../../uis/input/search/search.component';
import { TaskListComponent } from '../../../../uis/list/task-list/task-list.component';
import { TMenu } from '../../../../core/sidenav/sidenav.model';
import { SidenavService } from '../../../../core/sidenav/sidenav.service';
import { ListService } from '../../../../utils/services/list.service';
import { TaskBoardComponent } from '../../../../uis/board/task-board/task-board.component';


@Component({
  selector: 'feature-task-page-list',
  templateUrl: 'task-page-list.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    TitleCasePipe,
    TaskListComponent,
    SearchComponent,
    SortBtnComponent,
    FilterBtnComponent,
    TaskBoardComponent
  ]
})
export class TaskBaseListComponent implements OnInit {
  // - angular DI
  private readonly _STORE = inject(STORE_TOKEN);
  private readonly _ROUTER = inject(Router);

  // - custom DI
  private readonly _SIDE_NAV_SERVICE = inject(SidenavService);
  protected readonly _LIST_SERVICE = inject(ListService);
  protected readonly _TASK_SERVICE = inject(TaskService);

  // - reactivity
  private readonly tasks: Signal<TTask[]> = this._STORE().task.list;
  getTasks: Signal<TTask[]> = this._STORE().task.getList;

  isSearch: WritableSignal<boolean>  = signal(false);
  readonly GET_IS_SEARCH: Signal<boolean> = computed(() => this.isSearch());

  searchTerm: WritableSignal<string> = signal('');
  readonly GET_SEARCH_TERM: Signal<string> = computed(() => this.searchTerm());

  sortValue: WritableSignal<{sort: TSORT, sortBy: string, name: string}> = signal({
    sort: 'desc',
    sortBy: 'createdAt',
    name: 'created'
  });
  readonly GET_SORT_VALUE: Signal<{sort: TSORT, sortBy: string, name: string}> = computed(() => this.sortValue());

  filterValue: WritableSignal<string> = signal('');
  readonly GET_FILTER_VALUE: Signal<string> = computed(() => this.filterValue());

  // - no reactivity
  readonly PAGE: TMenu = this._SIDE_NAV_SERVICE.navigations
    .filter(nav => nav.page === this._ROUTER.url)[0];
  readonly SOURCE_PAGE: string = this._ROUTER.url.split('/')[1];
  viewBoard: boolean = false;


  ngOnInit(): void {
    this.setDefaultData();
  }

  setDefaultData(): void {
    this.isSearch.set(false);
    this.searchTerm.set('');
    this.filterValue.set('none');
    this.sortValue.set({
      sort: 'desc',
      sortBy: 'createdAt',
      name: 'created'
    });

    switch(this.SOURCE_PAGE) {
      case 'recent':
        this.getTasks = computed(() => this._LIST_SERVICE.filter(this.tasks(), 'none'));
        break;
      case 'today':
        this.sortValue.set({
          sort: 'asc',
          sortBy: 'createdAt',
          name: 'created'
        });
        this.getTasks = computed(() => this._LIST_SERVICE.filter(this.tasks(), 'today'));
        break;
      case 'upcoming':
        this.sortValue.set({
          sort: 'asc',
          sortBy: 'dueDate',
          name: 'dueDate'
        });
        this.getTasks = computed(() => this._LIST_SERVICE.filter(this.tasks(), 'upcoming'));
        break;
      case 'priority':
        this.sortValue.set({
          sort: 'asc',
          sortBy: 'dueDate',
          name: 'dueDate'
        });
        this.getTasks = computed(() => this._LIST_SERVICE.filter(this.tasks(), 'high-priority'));
        break;
      case 'list':
        this.sortValue.set({
          sort: 'asc',
          sortBy: 'createdAt',
          name: 'created'
        });
        this.getTasks = computed(() => this._LIST_SERVICE.filter(this.tasks(), 'none'));
        break;
      case 'completed':
        this.sortValue.set({
          sort: 'asc',
          sortBy: 'dueDate',
          name: 'dueDate'
        });
        this.getTasks = computed(() => this._LIST_SERVICE.filter(this.tasks(), 'done'));
        break;
    }
  }

  // - search
  toSearch(term: string): void {
    this.searchTerm.set(term);
  }

  closeSearch(): void {
    this.isSearch.set(false);
    this.searchTerm.set('');
  }

  // - util
  filter(selection: string): void {
    this.sortValue.set({
      sort: 'desc',
      sortBy: 'createdAt',
      name: 'created'
    });
    this.filterValue.set(selection);
  }

  sort(selection: {sort: TSORT, sortBy: string, name: string}): void {
    this.sortValue.set(selection);
  }
}
