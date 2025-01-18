import { ChangeDetectionStrategy, Component, inject, OnInit, Signal } from '@angular/core';
import { SummaryComponent } from '../../uis/widgets/summary/summary.component';
import { STORE } from '../../data-access/state/state.store';
import { TTask } from '../../utils/models/task.model';
import { TaskListComponent } from '../../features/task-list/task-list.component';
import { TitleCasePipe } from '@angular/common';
import { SidenavService } from '../../core/sidenav/sidenav.service';

@Component({
  selector: 'app-completed',
  templateUrl: './completed.component.html',
  styleUrls: ['./completed.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TaskListComponent, TitleCasePipe]
})
export class CompletedComponent implements OnInit {
  private readonly _sidenavService = inject(SidenavService);
  readonly page = this._sidenavService.navigations.filter(nav => nav.page === '/completed')[0];

  TASKS!: Signal<TTask[]>;

  constructor() {
    STORE().task.filter.status.set('complete');
    this.TASKS = STORE().task.filter.listComputed;
    console.log('completed tasks:', this.TASKS);
  }

  ngOnInit() {
  }

}
