// Angular
import {ChangeDetectionStrategy, Component, computed, inject, input, Signal} from '@angular/core';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CommonModule, TitleCasePipe } from '@angular/common';

// Third party
import * as _ from 'lodash';

// Local
import { TSORT, TStatus, TTask } from '../../../utils/models/task.model';
import { TaskService } from '../../../features/task/task.service';
import { SearchPipe } from '../../../utils/pipes/search.pipe';
import { FilterPipe } from '../../../utils/pipes/filter.pipe';
import { SortPipe } from '../../../utils/pipes/sort.pipe';
import { PriorityPipe } from '../../../utils/pipes/priority.pipe';


@Component({
  selector: 'ui-task-board',
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
    TitleCasePipe,
    PriorityPipe
  ],
})
export class TaskBoardComponent {
  // input - reactivity
  readonly TASKS = input.required<Signal<TTask[]>>();
  readonly FILTER_VALUE = input.required<Signal<string>>();
  readonly SORT_VALUE = input.required<Signal<{sort: TSORT, sortBy: string}>>();
  readonly SEARCH_TERM = input.required<Signal<string>>();

  // input - no reactivity
  readonly TASK_SERVICE = input.required<TaskService>();

  // pipe
  private readonly SEARCH_PIPE = inject(SearchPipe);
  private readonly FILTER_PIPE = inject(FilterPipe);
  private readonly SORT_PIPE = inject(SortPipe);

  // variable - reactivity
  readonly getTodos: Signal<TTask[]> = computed(() => {
    const list = this.TASKS()().filter(item => item?.status === 'todo');
    const filter = this.FILTER_VALUE()();
    const search = this.SEARCH_TERM()();
    const sort = this.SORT_VALUE()();

    let filtered = this.FILTER_PIPE.transform(list, filter);

    if (search) filtered = this.SEARCH_PIPE.transform(filtered, search);
    if (!_.isEmpty(sort)) filtered = this.SORT_PIPE.transform(filtered, sort);

    return filtered;
  });
  readonly getDone: Signal<TTask[]> = computed(() => {
    const list = this.TASKS()().filter(item => item?.status === 'done');
    const filter = this.FILTER_VALUE()();
    const search = this.SEARCH_TERM()();
    const sort = this.SORT_VALUE()();

    let filtered = this.FILTER_PIPE.transform(list, filter);

    if (search) filtered = this.SEARCH_PIPE.transform(filtered, search);
    if (!_.isEmpty(sort)) filtered = this.SORT_PIPE.transform(filtered, sort);

    return filtered;
  });
  readonly getInProgress: Signal<TTask[]> = computed(() => {
    const list = this.TASKS()().filter(item => item?.status === 'inprogress');
    const filter = this.FILTER_VALUE()();
    const search = this.SEARCH_TERM()();
    const sort = this.SORT_VALUE()();

    let filtered = this.FILTER_PIPE.transform(list, filter);

    if (search) filtered = this.SEARCH_PIPE.transform(filtered, search);
    if (!_.isEmpty(sort)) filtered = this.SORT_PIPE.transform(filtered, sort);

    return filtered;
  });


  drop(event: CdkDragDrop<TTask[]>, status: TStatus): void {
    const DATA = event?.item?.data;

    if (_.isEmpty(DATA)) return;

    if (event.previousContainer === event.container)
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    else {
      this.TASK_SERVICE().updateTask({...DATA, status}, DATA?.id || '', ()=>{});

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  viewTaskUI(task: TTask): void {
    if (!task || !task.id) return;

    this.TASK_SERVICE().viewTaskUI(task);
  }
}
