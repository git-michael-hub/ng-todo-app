import {
  Component, ChangeDetectionStrategy, effect, ChangeDetectorRef, inject
} from '@angular/core';
import { STORE_TOKEN } from '../../../data-access/state/state.store';



@Component({
  selector: 'app-ui-widget-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class SummaryComponent {
  private readonly _STORE = inject(STORE_TOKEN);
  private readonly _CD = inject(ChangeDetectorRef);

  totalHighPriority!: number;
  totalCompleted!: number;
  totalTodo!: number;
  totalAll!: number;

  constructor() {
    effect(() => {
      this.totalHighPriority = this._STORE().task.count.highPriorityListComputed();
      this.totalCompleted = this._STORE().task.count.completeListComputed();
      this.totalTodo = this._STORE().task.count.todoListComputed();
      this.totalAll = this._STORE().task.count.allListComputed();

      this._CD.markForCheck();
    });
  }
}
