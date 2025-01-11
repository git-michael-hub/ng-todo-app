import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SummaryComponent } from '../../uis/widgets/summary/summary.component';
import { TaskListComponent } from '../../features/task-list/task-list.component';
import { STORE } from '../../data-access/state/state.store';
import { TTask } from '../../utils/models/task.model';

@Component({
  selector: 'app-recent',
  templateUrl: './recent.component.html',
  styleUrls: ['./recent.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TaskListComponent]
})
export class RecentComponent implements OnInit {
  TASKS!: TTask[];

  constructor() {
    STORE().task.sort.status.set('asc');
    this.TASKS = STORE().task.sort.listComputed();
    console.log('recent tasks:', this.TASKS);
  }

  ngOnInit() {
  }

}
