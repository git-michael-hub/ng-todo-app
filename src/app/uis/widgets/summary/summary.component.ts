import {
  Component, ChangeDetectionStrategy, inject, Signal
} from '@angular/core';
import { STORE_TOKEN } from '../../../data-access/state/state.store';


@Component({
  selector: 'ui-widget-summary',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  template: `
    <div class="tw-pl-[18px] fadeShow">
      <span class="tw-pr-[3rem]">{{ TOTAL_HIGH_PRIORITY() }} High Priority</span>
      <span class="tw-pr-[3rem]">{{ TOTAL_TODO() }} Todo List</span>
      <span class="tw-pr-[3rem]">{{ TOTAL_IN_PROGRESS() }} In Progress</span>
      <span class="tw-pr-[3rem]">{{ TOTAL_COMPLETED() }} Completed</span>
      <span class="tw-pr-[3rem]">{{ TOTAL_ALL_LIST() }} All List</span>
    </div>
  `
})
export class SummaryComponent {
  // - di
  private readonly _STORE = inject(STORE_TOKEN);

  readonly TOTAL_HIGH_PRIORITY: Signal<number> = this._STORE().task.count.highPriorityListComputed;
  readonly TOTAL_TODO: Signal<number> =  this._STORE().task.count.todoListComputed;
  readonly TOTAL_COMPLETED: Signal<number> = this._STORE().task.count.completeListComputed;
  readonly TOTAL_IN_PROGRESS: Signal<number> = this._STORE().task.count.inProgressListComputed;
  readonly TOTAL_ALL_LIST: Signal<number> = this._STORE().task.count.allListComputed;
}
