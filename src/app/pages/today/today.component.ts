import { ChangeDetectionStrategy, Component, inject, OnInit, Signal } from '@angular/core';
import { SummaryComponent } from '../../uis/widgets/summary/summary.component';
import { TTask } from '../../utils/models/task.model';
import { STORE } from '../../data-access/state/state.store';
import { TaskListComponent } from '../../features/task-list/task-list.component';
import { TitleCasePipe } from '@angular/common';
import { SidenavService } from '../../core/sidenav/sidenav.service';

@Component({
  selector: 'app-today',
  templateUrl: './today.component.html',
  styleUrls: ['./today.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TaskListComponent, TitleCasePipe]
})
export class TodayComponent implements OnInit {
  private readonly _sidenavService = inject(SidenavService);
  readonly page = this._sidenavService.navigations.filter(nav => nav.page === '/today')[0];

  TASKS!: Signal<TTask[]>;

  constructor() {
    STORE().task.filter.status.set('today');
    this.TASKS = STORE().task.filter.listComputed;
    console.log('today:', this.TASKS);
  }

  ngOnInit() {
  }

}
