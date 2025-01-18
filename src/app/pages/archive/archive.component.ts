import { ChangeDetectionStrategy, Component, inject, OnInit, Signal } from '@angular/core';
import { SummaryComponent } from '../../uis/widgets/summary/summary.component';
import { TaskListComponent } from '../../features/task-list/task-list.component';
import { TTask } from '../../utils/models/task.model';
import { STORE } from '../../data-access/state/state.store';
import { TitleCasePipe } from '@angular/common';
import { SidenavService } from '../../core/sidenav/sidenav.service';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TaskListComponent, TitleCasePipe]
})
export class ArchiveComponent {
  private readonly _sidenavService = inject(SidenavService);
  readonly page = this._sidenavService.navigations.filter(nav => nav.page === '/archive')[0];

  TASKS!: Signal<TTask[]>;

  constructor() {
    STORE().task.filter.status.set('archive');
    this.TASKS = STORE().task.filter.listComputed;
    console.log('archive tasks:', this.TASKS);
  }
}
