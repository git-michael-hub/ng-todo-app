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
      <span class="tw-pr-[1rem]">
        <span class="tw-text-xl">
          {{ TOTAL_HIGH_PRIORITY() }}
        </span>
        <span class="tw-text-sm">
          High Priority
        </span>
      </span>
      <span class="tw-pr-[1rem]">
        <span class="tw-text-xl">
          {{ TOTAL_TODO() }}
        </span>
        <span class="tw-text-sm">
          Todo List
        </span>
      </span>
      <span class="tw-pr-[1rem]">
        <span class="tw-text-xl">
          {{ TOTAL_IN_PROGRESS() }}
        </span>
        <span class="tw-text-sm">
          In Progress
        </span>
      </span>
      <span class="tw-pr-[1rem]">
        <span class="tw-text-xl">
          {{ TOTAL_COMPLETED() }}
        </span>
        <span class="tw-text-sm">
          Completed
        </span>
      </span>
      <span class="tw-pr-[1rem]">
        <span class="tw-text-xl">
          {{ TOTAL_ALL_LIST() }}
        </span>
        <span class="tw-text-sm">
          All List
        </span>
      </span>
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
