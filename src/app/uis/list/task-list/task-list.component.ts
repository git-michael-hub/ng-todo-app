// Angular
import { ChangeDetectionStrategy, Component, input, Signal } from '@angular/core';
import { DatePipe, SlicePipe, TitleCasePipe } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule } from '@angular/forms';

// Material
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

// Local
import { TSORT, TTask } from '../../../utils/models/task.model';
import { PriorityPipe } from '../../../utils/pipes/priority.pipe';
import { TaskService } from '../../../features/task/task.service';
import { TRACK_BY } from '../../../utils/services/template.service';
import { SearchPipe } from '../../../utils/pipes/search.pipe';
import { SortPipe } from '../../../utils/pipes/sort.pipe';
import { FilterPipe } from '../../../utils/pipes/filter.pipe';


@Component({
  selector: 'ui-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    SlicePipe,
    MatButtonModule,
    ScrollingModule,
    MatCheckboxModule,
    TitleCasePipe,
    PriorityPipe,
    DatePipe,
    FormsModule,
    SearchPipe,
    SortPipe,
    FilterPipe
  ],
})
export class TaskListComponent {
  // input - reactivity
  readonly TASKS = input.required<Signal<TTask[]>>();
  readonly FILTER_VALUE = input.required<Signal<string>>();
  readonly SORT_VALUE = input.required<Signal<{sort: TSORT, sortBy: string}>>();
  readonly SEARCH_TERM = input.required<Signal<string>>();

  // input - no reactivity
  readonly TASK_SERVICE = input.required<TaskService>();

  readonly TRACK_BY = TRACK_BY;


  viewTaskUI(task: TTask): void {
    if (!task || !task.id) return;

    this.TASK_SERVICE().viewTaskUI(task);
  }

  markAsComplete(task: TTask): void {
    if (!task || !task.id) return;

    console.log('markAsComplete', task);
    if (task.status === 'done') {
      task = {...task, status: 'todo'};

      this.TASK_SERVICE().updateTask(task, task.id || '', () => {}, false);
    }
    else {
      task = {...task, status: 'done'};
      this.TASK_SERVICE().markAsComplete(task);
    }
  }

  deleteTask(task: TTask, id: string): void {
    if (!task || !id) return;

    this.TASK_SERVICE().deleteTask(task, id);
  }


  // FOR CYPRESS PURPOSES
  showButtons(): void {
    document.querySelectorAll(".item-content-buttons").forEach(el => {
      if (el.classList.contains("tw-hidden"))
        el.classList.remove("tw-hidden");
      else
        el.classList.add("tw-hidden");
    });
  }
}
