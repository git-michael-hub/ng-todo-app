import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SummaryComponent } from '../../uis/widgets/summary/summary.component';
import { TTask } from '../../utils/models/task.model';
import { STORE } from '../../data-access/state/state.store';
import { TaskListComponent } from '../../features/task-list/task-list.component';

@Component({
  selector: 'app-upcoming',
  templateUrl: './upcoming.component.html',
  styleUrls: ['./upcoming.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TaskListComponent]
})
export class UpcomingComponent implements OnInit {

  TASKS!: TTask[];

  constructor() {
    STORE().task.filter.status.set('upcoming');
    this.TASKS = STORE().task.filter.listComputed();
    console.log('upcoming:', this.TASKS);
  }

  ngOnInit() {
  }

}
