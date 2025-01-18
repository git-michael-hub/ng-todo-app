import { ChangeDetectionStrategy, Component, inject, OnInit, Signal } from '@angular/core';
import { SummaryComponent } from '../../uis/widgets/summary/summary.component';
import { TaskListComponent } from '../../features/task-list/task-list.component';
import { TTask } from '../../utils/models/task.model';
import { STORE } from '../../data-access/state/state.store';
import { TitleCasePipe } from '@angular/common';
import { SidenavService } from '../../core/sidenav/sidenav.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [TaskListComponent, TitleCasePipe]
})
export class ListComponent implements OnInit {
  private readonly _sidenavService = inject(SidenavService);
  readonly page = this._sidenavService.navigations.filter(nav => nav.page === '/list')[0];

  TASKS!: Signal<TTask[]>;

  constructor() {
    STORE().task.sort.status.set('asc');
    this.TASKS = STORE().task.sort.listComputed;
    console.log('all list:', this.TASKS);
  }

  ngOnInit() {
  }

}
