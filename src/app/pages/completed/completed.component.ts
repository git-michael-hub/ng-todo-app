import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SummaryComponent } from '../../uis/widgets/summary/summary.component';
import { STORE } from '../../data-access/state/state.store';
import { TTask } from '../../utils/models/task.model';
import { TaskListComponent } from '../../features/task-list/task-list.component';

@Component({
  selector: 'app-completed',
  templateUrl: './completed.component.html',
  styleUrls: ['./completed.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TaskListComponent]
})
export class CompletedComponent implements OnInit {

  TASKS!: TTask[];

  constructor() {
    STORE().task.filter.status.set('complete');
    this.TASKS = STORE().task.filter.listComputed();
    console.log('completed tasks:', this.TASKS);
  }

  ngOnInit() {
  }

}
