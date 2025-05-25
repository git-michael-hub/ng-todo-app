import { CommonModule, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output, Signal, signal, ViewChild, WritableSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import * as _ from 'lodash';
import { TSORT } from '../../../utils/models/task.model';

@Component({
  selector: 'filter-btn',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    TitleCasePipe,
    MatMenuModule,
    MatButtonModule
  ],
  template: `
    @let NONE = 'none';
    @let COMPLETE = 'complete';
    @let LOW = 'low-priority';
    @let MEDIUM = 'medium-priority';
    @let HIGH = 'high-priority';

    <button
      #menuTrigger="matMenuTrigger"
      mat-button
      [matMenuTriggerFor]="filterMenu"
      class="tw-w-[7rem] tw-mx-[4px] tw-mb-[4px] !tw-px-2 tw-h-[46px]"
      [ngClass]="{
        '!tw-w-[8rem]': value() && value()() === 'complete',
        '!tw-w-[10rem]': value() && value()().includes('priority')
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
      <button mat-menu-item (click)="filter.emit(COMPLETE)">Completed</button>
      <button mat-menu-item [matMenuTriggerFor]="priorityMenu">Priority</button>
    </mat-menu>

    <mat-menu #priorityMenu="matMenu">
      <button mat-menu-item (click)="filter.emit(LOW)">Low</button>
      <button mat-menu-item (click)="filter.emit(MEDIUM)">Medium</button>
      <button mat-menu-item (click)="filter.emit(HIGH)">High</button>
    </mat-menu>
  `
})
export class FilterBtnComponent {
  filter = output<string>();
  value = input.required<Signal<string>>();
}
