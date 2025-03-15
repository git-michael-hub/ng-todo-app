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
}
