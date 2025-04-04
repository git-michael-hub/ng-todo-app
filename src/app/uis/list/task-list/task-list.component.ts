// Angular
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DatePipe, SlicePipe, TitleCasePipe } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule } from '@angular/forms';

// Material
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

// Local
import { TTask } from '../../../utils/models/task.model';
import { PriorityPipe } from '../../../utils/pipes/priority.pipe';
import { TaskService } from '../../../features/task/task.service';
import { TRACK_BY } from '../../../utils/services/template.service';



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
    FormsModule
  ],
})
export class TaskListComponent {
  @Input()
  tasks!: TTask[];

  @Input()
  SERVICE!: TaskService;

  readonly TRACK_BY = TRACK_BY;

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

    this.SERVICE.markAsComplete(task);
  }

  deleteTask(id: string): void {
    if (!id) return;

    this.SERVICE.deleteTask(id);
  }
}
