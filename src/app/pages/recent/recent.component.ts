import { ChangeDetectionStrategy, Component, effect, inject, OnInit, Signal } from '@angular/core';
import { SummaryComponent } from '../../uis/widgets/summary/summary.component';
import { TaskListComponent } from '../../features/task-list/task-list.component';
import { STORE } from '../../data-access/state/state.store';
import { TTask } from '../../utils/models/task.model';
import { SidenavService } from '../../core/sidenav/sidenav.service';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-recent',
  templateUrl: './recent.component.html',
  styleUrls: ['./recent.component.scss'],
  standalone: true,
  imports: [TaskListComponent, TitleCasePipe]
})
export class RecentComponent implements OnInit {
  private readonly _sidenavService = inject(SidenavService);
  readonly page = this._sidenavService.navigations.filter(nav => nav.page === '/recent')[0];

  TASKS!: Signal<TTask[]>;

  constructor() {
    STORE().task.sort.status.set('asc');
    this.TASKS = STORE().task.sort.listComputed;
    console.log('recent tasks:', this.TASKS);
    console.log('_sidenavService:', this._sidenavService.navigations.filter(nav => nav.page === '/recent'))


  }

  ngOnInit() {
  }

}
