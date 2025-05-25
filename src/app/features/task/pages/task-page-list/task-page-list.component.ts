import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import { TSORT, TTask } from '../../../../utils/models/task.model';
import { STORE_TOKEN } from '../../../../data-access/state/state.store';
import { TaskService } from '../../task.service';
import { TitleCasePipe } from '@angular/common';
import { FilterBtnComponent } from '../../../../uis/button/filter-btn/filter-btn.component';
import { SortBtnComponent } from '../../../../uis/button/sort-btn/sort-btn.component';
import { SearchComponent } from '../../../../uis/input/search/search.component';
import { TaskListComponent } from '../../../../uis/list/task-list/task-list.component';
import { TMenu } from '../../../../core/sidenav/sidenav.model';
import { SidenavService } from '../../../../core/sidenav/sidenav.service';
import { Router } from '@angular/router';
import { ListService } from '../../../../utils/services/list.service';

@Component({
  selector: 'app-task-page-list',
  templateUrl: 'task-page-list.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TitleCasePipe,
    TaskListComponent,
    SearchComponent,
    SortBtnComponent,
    FilterBtnComponent
  ]
})
export class TaskBaseListComponent {
  private readonly _STORE = inject(STORE_TOKEN);
  private readonly _SIDE_NAV_SERVICE = inject(SidenavService);
  private readonly _ROUTER = inject(Router);
  private readonly _LIST_SERVICE = inject(ListService);

  protected readonly _TASK_SERVICE = inject(TaskService);

  readonly PAGE: TMenu = this._SIDE_NAV_SERVICE.navigations
    .filter(nav => nav.page === this._ROUTER.url)[0];

  tasks: Signal<TTask[]> = this._STORE().task.list;
  getTasks: Signal<TTask[]> = this._STORE().task.getList;

  isSearch: WritableSignal<boolean>  = signal(false);
  getIsSearch: Signal<boolean> = computed(() => this.isSearch());

  searchTerm: WritableSignal<string> = signal('');
  getSearchTerm: Signal<string> = computed(() => this.searchTerm());

  sortValue: WritableSignal<{sort: TSORT, sortBy: string}> = signal({
    sort: 'desc',
    sortBy: 'createdAt'
  });
  getSortValue: Signal<{sort: TSORT, sortBy: string}> = computed(() => this.sortValue());


  filterValue: WritableSignal<string> = signal('');
  getFilterValue: Signal<string> = computed(() => this.filterValue());


  ngOnInit(): void {
    this.setDefaultData();
  }

  setDefaultData(): void {
    console.log('setData');

    this.isSearch.set(false);
    this.searchTerm.set('');
    this.filterValue.set('none');
    this.sortValue.set({
      sort: 'desc',
      sortBy: 'createdAt'
    });

    switch(this._ROUTER.url.split('/')[1]) {
      case 'recent': {
        this.getTasks = computed(() => this._LIST_SERVICE.filter(this.tasks(), 'none'));
        break;
      };
      case 'today': {
        this.getTasks = computed(() => this._LIST_SERVICE.filter(this.tasks(), 'today'));
        break;
      };
      case 'upcoming': {
        this.getTasks = computed(() => this._LIST_SERVICE.filter(this.tasks(), 'upcoming'));
        break;
      };
      case 'priority': {
        this.getTasks = computed(() => this._LIST_SERVICE.filter(this.tasks(), 'high-priority'));
        break;
      };
      case 'list': {
        this.sortValue.set({
          sort: 'asc',
          sortBy: 'createdAt'
        });
        this.getTasks = computed(() => this._LIST_SERVICE.filter(this.tasks(), 'none'));
        break;
      };
      case 'completed': {
        this.getTasks = computed(() => this._LIST_SERVICE.filter(this.tasks(), 'complete'));
        break;
      };
    }
  }

  toSearch(term: string): void {
    this.searchTerm.set(term);
  }

  closeSearch(): void {
    this.isSearch.set(false);
    this.searchTerm.set('');
  }

  filter(selection: string): void {
    this.sortValue.set({
      sort: 'desc',
      sortBy: 'createdAt'
    });
    this.filterValue.set(selection);
  }

  sort(selection: {sort: TSORT, sortBy: string}): void {
    this.sortValue.set(selection);
  }
}
