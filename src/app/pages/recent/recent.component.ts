import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SummaryComponent } from '../../uis/widgets/summary/summary.component';
import { TaskComponent } from '../../features/task/task.component';

@Component({
  selector: 'app-recent',
  templateUrl: './recent.component.html',
  styleUrls: ['./recent.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [SummaryComponent, TaskComponent]
})
export class RecentComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
