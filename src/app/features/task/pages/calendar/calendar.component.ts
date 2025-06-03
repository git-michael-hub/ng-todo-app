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
import { TRACK_BY } from '../../../../utils/services/template.service';


@Component({
  selector: 'app-calendar',
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
  private readonly tasks: Signal<TTask[]> = this._STORE().task.list;
  getTasks: Signal<TTask[]> = this._STORE().task.getList;

  getEvents: Signal<CalendarEvent[]> = computed(() => {
    const list = this.getTasks();
    const filter = this.getFilterValue();
    const sort = this.getSortValue();

    let filtered = this.FILTER_PIPE.transform(list, filter);

    if (!_.isEmpty(sort)) filtered = this.SORT_PIPE.transform(filtered, sort);

    return filtered.map(item => ({
      ...item,
      start: new Date(item.dueDate)
    }))
  });

  sortValue: WritableSignal<{sort: TSORT, sortBy: string}> = signal({
    sort: 'desc',
    sortBy: 'createdAt'
  });
  getSortValue: Signal<{sort: TSORT, sortBy: string}> = computed(() => this.sortValue());

  filterValue: WritableSignal<string> = signal('');
  getFilterValue: Signal<string> = computed(() => this.filterValue());

  // - no reactivity
  readonly SOURCE_PAGE: string = 'calendar';
  readonly TRACK_BY = TRACK_BY;
  readonly EVENT_LIMIT = 2;
  eventLimit = this.EVENT_LIMIT;

  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();


  ngOnInit(): void {
    this.setDefaultData();
  }

  setDefaultData(): void {
    this.filterValue.set('none');
    this.sortValue.set({
      sort: 'desc',
      sortBy: 'createdAt'
    });

    this.getTasks = computed(() => this._LIST_SERVICE.filter(this.tasks(), 'none'));
  }

  // - util
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
