// Angular
import { ChangeDetectionStrategy, Component, computed, effect, input, Input, signal, Signal } from '@angular/core';
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
  selector: 'app-feature-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  tasks = input.required<TTask[]>();
  filterValue = input.required<Signal<string>>();
  sortValue = input.required<Signal<{sort: TSORT, sortBy: string}>>();
  searchTerm = input.required<Signal<string>>();

  @Input() SERVICE!: TaskService;

  readonly TRACK_BY = TRACK_BY;

  constructor() {
    effect(() => {
      console.log('Tasks updated:', this.tasks());
    });
  }

  ngOnInit() {
  console.log('SERVICE:tasK', this.SERVICE)
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

  viewTaskUI(task: TTask): void {
    if (!task || !task.id) return;

    this.SERVICE.viewTaskUI(task);
  }

  markAsComplete(task: TTask): void {
    if (!task || !task.id) return;

    console.log('markAsComplete', task);
    if (task.status === 'done') {
      task = {...task, status: 'todo'};

      this.SERVICE.updateTask(task, task.id || '', () => {}, false);
    }
    else {
      task = {...task, status: 'done'};
      this.SERVICE.markAsComplete(task);
    }
  }

  deleteTask(task: TTask, id: string): void {
    if (!task || !id) return;

    this.SERVICE.deleteTask(task, id);
  }
}
