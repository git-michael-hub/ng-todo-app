import { ChangeDetectionStrategy, Component, inject, OnInit, Signal } from '@angular/core';
import { SummaryComponent } from '../../uis/widgets/summary/summary.component';
import { TTask } from '../../utils/models/task.model';
import { STORE } from '../../data-access/state/state.store';
import { TaskListComponent } from '../../features/task-list/task-list.component';
import { TitleCasePipe } from '@angular/common';
import { SidenavService } from '../../core/sidenav/sidenav.service';

@Component({
  selector: 'app-upcoming',
  templateUrl: './upcoming.component.html',
  styleUrls: ['./upcoming.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TaskListComponent, TitleCasePipe]
})
export class UpcomingComponent implements OnInit {
  private readonly _sidenavService = inject(SidenavService);
  readonly page = this._sidenavService.navigations.filter(nav => nav.page === '/upcoming')[0];

  TASKS!: Signal<TTask[]>;

  constructor() {
    STORE().task.filter.status.set('upcoming');
    this.TASKS = STORE().task.filter.listComputed;
    console.log('upcoming:', this.TASKS);
  }

  ngOnInit() {
  }

}
