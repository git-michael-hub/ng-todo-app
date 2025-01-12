import { ChangeDetectionStrategy, Component, effect, OnInit } from '@angular/core';
import { SummaryComponent } from '../../uis/widgets/summary/summary.component';
import { TaskListComponent } from '../../features/task-list/task-list.component';
import { STORE } from '../../data-access/state/state.store';
import { TTask } from '../../utils/models/task.model';

@Component({
  selector: 'app-recent',
  templateUrl: './recent.component.html',
  styleUrls: ['./recent.component.scss'],
  standalone: true,
  imports: [TaskListComponent]
})
export class RecentComponent implements OnInit {
  // TASKS!: TTask[];
  TASKS!: any;

  constructor() {
    STORE().task.sort.status.set('asc');
    this.TASKS = STORE().task.sort.listComputed;
    console.log('recent tasks:', this.TASKS);

    // effect(() => {
    //   console.log('[STORE]:', this.TASKS);
    // });

    // STORE().task.sort.status.set('asc');
    // this.TASKS = STORE().task.sort.listComputed();
    // // console.log(`[STORE]1: ${STORE().task.sort.listComputed()}`);
    // console.log(`[STORE]2: ${this.TASKS}`);

    // // effect(() => {
    // //   console.log(`[STORE]: ${STORE().task.sort.listComputed()}`);
    // // });
  }

  ngOnInit() {
  }

}
