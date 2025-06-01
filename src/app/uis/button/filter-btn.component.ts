import { CommonModule, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import * as _ from 'lodash';


@Component({
  selector: 'ui-filter-btn',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    TitleCasePipe,
    MatMenuModule,
    MatButtonModule
  ],
  template: `
    @let NONE = 'none';
    @let LOW = 'low-priority';
    @let MEDIUM = 'medium-priority';
    @let HIGH = 'high-priority';
    @let TODO = 'todo';
    @let IN_PROGRESS = 'in-progress';
    @let DONE = 'done';

    <button
      #menuTrigger="matMenuTrigger"
      mat-button
      [matMenuTriggerFor]="filterMenu"
      class="tw-w-[7rem] tw-mx-[4px] tw-mb-[4px] !tw-px-2 tw-h-[46px]"
      [ngClass]="{
        '!tw-w-[8rem]': value() && value()() === 'complete',
        '!tw-w-[10rem]': value() && value()().includes('priority') || value()().includes('progress')
      }"
    >
      Filter:
      <span class="!tw-text-black">
       {{
          value()
            ? (value()() | titlecase)
            : ''
        }}
      </span>
    </button>

    <mat-menu #filterMenu="matMenu">
      <button mat-menu-item (click)="filter.emit(NONE)">None</button>

      @if (source() !== 'priority') {
        <button mat-menu-item [matMenuTriggerFor]="priorityMenu">Priority</button>
      }

      <button mat-menu-item [matMenuTriggerFor]="statusMenu">Status</button>
    </mat-menu>

    <mat-menu #priorityMenu="matMenu">
      <button mat-menu-item (click)="filter.emit(LOW)">Low</button>
      <button mat-menu-item (click)="filter.emit(MEDIUM)">Medium</button>
      <button mat-menu-item (click)="filter.emit(HIGH)">High</button>
    </mat-menu>

    <mat-menu #statusMenu="matMenu">
      <button mat-menu-item (click)="filter.emit(TODO)">Todo</button>
      <button mat-menu-item (click)="filter.emit(IN_PROGRESS)">In Progress</button>
      <button mat-menu-item (click)="filter.emit(DONE)">Done</button>
      <!-- <button mat-menu-item (click)="filter.emit(BLOCK)">Block</button>
      <button mat-menu-item (click)="filter.emit(IN_REVIEW)">In Review</button> -->
    </mat-menu>
  `
})
export class FilterBtnComponent {
  // - reactivity
  value = input.required<Signal<string>>();

  // - no reactivity
  source = input.required<string>();
  view = input.required<'list' | 'board'>();

  filter = output<string>();
}
