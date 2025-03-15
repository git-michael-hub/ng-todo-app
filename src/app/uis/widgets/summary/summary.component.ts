import {
  Component, ChangeDetectionStrategy, effect, ChangeDetectorRef, inject
} from '@angular/core';
import { STORE } from '../../../data-access/state/state.store';



@Component({
  selector: 'app-ui-widget-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class SummaryComponent {
  private readonly _CD = inject(ChangeDetectorRef);

  totalHighPriority!: number;
  totalCompleted!: number;
  totalTodo!: number;
  totalAll!: number;

  constructor() {
    effect(() => {
      this.totalHighPriority = STORE().task.count.highPriorityListComputed();
      this.totalCompleted = STORE().task.count.completeListComputed();
      this.totalTodo = STORE().task.count.todoListComputed();
      this.totalAll = STORE().task.count.allListComputed();

      this._CD.markForCheck();
    });
  }
}
