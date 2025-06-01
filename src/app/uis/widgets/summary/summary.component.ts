import {
  Component, ChangeDetectionStrategy, effect, ChangeDetectorRef, inject
} from '@angular/core';
import { STORE_TOKEN } from '../../../data-access/state/state.store';


@Component({
  selector: 'ui-widget-summary',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  template: `
    <div class="tw-pl-[18px]">
      <span class="tw-pr-[3rem]">{{ totalHighPriority }} High Priority</span>
      <span class="tw-pr-[3rem]">{{ totalCompleted }} Completed</span>
      <span class="tw-pr-[3rem]">{{ totalTodo }} Todo List</span>
      <span class="tw-pr-[3rem]">{{ totalAll }} All List</span>
    </div>
  `
})
export class SummaryComponent {
  // - di
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
