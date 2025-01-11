import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SummaryComponent } from '../../uis/widgets/summary/summary.component';
import { TTask } from '../../utils/models/task.model';
import { STORE } from '../../data-access/state/state.store';
import { TaskListComponent } from '../../features/task-list/task-list.component';

@Component({
  selector: 'app-priority',
  templateUrl: './priority.component.html',
  styleUrls: ['./priority.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TaskListComponent]
})
export class PriorityComponent implements OnInit {
  TASKS!: TTask[];

  constructor() {
    STORE().task.filter.status.set('high-priority');
    this.TASKS = STORE().task.filter.listComputed();
    console.log('high-priority tasks:', this.TASKS);
  }

  ngOnInit() {
  }

}
