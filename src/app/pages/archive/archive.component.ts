import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SummaryComponent } from '../../uis/widgets/summary/summary.component';
import { TaskListComponent } from '../../features/task-list/task-list.component';
import { TTask } from '../../utils/models/task.model';
import { STORE } from '../../data-access/state/state.store';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TaskListComponent]
})
export class ArchiveComponent {
  TASKS!: TTask[];

  constructor() {
    STORE().task.filter.status.set('archive');
    this.TASKS = STORE().task.filter.listComputed();
    console.log('archive tasks:', this.TASKS);
  }
}
