// Angular
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Signal,
  signal,
  WritableSignal
} from '@angular/core';
import { CommonModule } from '@angular/common';

// Third party
import {
  CalendarEvent,
  CalendarModule,
  CalendarUtils,
  CalendarView
} from 'angular-calendar';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import * as _ from 'lodash';

// Local
import { FilterBtnComponent } from '../../../../uis/button/filter-btn.component';
import { SortBtnComponent } from '../../../../uis/button/sort-btn.component';
import { TSORT, TTask } from '../../../../utils/models/task.model';
import { ListService } from '../../../../utils/services/list.service';
import { TaskService } from '../../task.service';
import { STORE_TOKEN } from '../../../../data-access/state/state.store';
import { SortPipe } from '../../../../utils/pipes/sort.pipe';
import { FilterPipe } from '../../../../utils/pipes/filter.pipe';


@Component({
  selector: 'feature-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  providers: [
    CalendarUtils,
  ],
  imports: [
    CommonModule,
    CalendarModule,
    SortBtnComponent,
    FilterBtnComponent,
    MatIcon,
    MatTooltipModule
  ],
})
export class CalendarComponent {
  // pipe
  private readonly SORT_PIPE = inject(SortPipe);
  private readonly FILTER_PIPE = inject(FilterPipe);

  // - angular DI
  private readonly _STORE = inject(STORE_TOKEN);

  // - custom DI
  protected readonly _LIST_SERVICE = inject(ListService);
  protected readonly _TASK_SERVICE = inject(TaskService);

  // - reactivity
  private readonly TASKS: Signal<TTask[]> = this._STORE().task.list;
  private getTasks: Signal<TTask[]> = this._STORE().task.getList;

  getEvents: Signal<CalendarEvent[]> = computed(() => {
    const list = this.getTasks();
    const filter = this.GET_FILTER_VALUE();
    const sort = this.GET_SORT_VALUE();

    let filtered = this.FILTER_PIPE.transform(list, filter);

    if (!_.isEmpty(sort)) filtered = this.SORT_PIPE.transform(filtered, sort);

    return filtered.map(item => ({
      ...item,
      start: new Date(item.dueDate)
    }))
  });

  private sortValue: WritableSignal<{sort: TSORT, sortBy: string, name: string}> = signal({
    sort: 'desc',
    sortBy: 'createdAt',
    name: 'created'
  });
  readonly GET_SORT_VALUE: Signal<{sort: TSORT, sortBy: string, name: string}> = computed(() => this.sortValue());

  private filterValue: WritableSignal<string> = signal('');
  readonly GET_FILTER_VALUE: Signal<string> = computed(() => this.filterValue());

  // - no reactivity
  readonly SOURCE_PAGE: string = 'calendar';
  private readonly EVENT_LIMIT = 2;
  eventLimit = this.EVENT_LIMIT;

  readonly VIEW_CALENDAR: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();


  ngOnInit(): void {
    this.setDefaultData();
  }

  setDefaultData(): void {
    this.filterValue.set('none');
    this.sortValue.set({
      sort: 'desc',
      sortBy: 'createdAt',
      name: 'created'
    });

    this.getTasks = computed(() => this._LIST_SERVICE.filter(this.TASKS(), 'none'));
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
