import { ChangeDetectionStrategy, Component, inject, OnInit, Signal } from '@angular/core';
import { SummaryComponent } from '../../uis/widgets/summary/summary.component';
import { TTask } from '../../utils/models/task.model';
import { STORE } from '../../data-access/state/state.store';
import { TaskListComponent } from '../../features/task-list/task-list.component';
import { SidenavService } from '../../core/sidenav/sidenav.service';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-priority',
  templateUrl: './priority.component.html',
  styleUrls: ['./priority.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TaskListComponent, TitleCasePipe]
})
export class PriorityComponent implements OnInit {
  private readonly _sidenavService = inject(SidenavService);
  readonly page = this._sidenavService.navigations.filter(nav => nav.page === '/priority')[0];

  TASKS!: Signal<TTask[]>;

  constructor() {
    STORE().task.filter.status.set('high-priority');
    this.TASKS = STORE().task.filter.listComputed;
    console.log('high-priority tasks:', this.TASKS);
  }

  ngOnInit() {
  }

}
