import { CommonModule, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { TSORT } from '../../utils/models/task.model';


@Component({
  selector: 'ui-sort-btn',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    TitleCasePipe,
    MatMenuModule,
    MatButtonModule
  ],
  template: `
    <button
      #menuTrigger="matMenuTrigger"
      mat-button
      [matMenuTriggerFor]="sortMenu"
      class="tw-w-[10rem] tw-mx-[4px] tw-mb-[4px] !tw-px-2 tw-h-[46px]"
    >
      Sort:
      <span class="!tw-text-black">
       {{
          value()
            ? (value()().sort | titlecase) + '-' + (value()().sortBy | titlecase)
            : ''
        }}
      </span>
    </button>

    <mat-menu #sortMenu="matMenu">
      <button mat-menu-item [matMenuTriggerFor]="asc">Ascending</button>
      <button mat-menu-item [matMenuTriggerFor]="desc">Descending</button>
    </mat-menu>


    <mat-menu #asc="matMenu">
      <button mat-menu-item (click)="sort.emit({sort: 'asc', sortBy: 'title'})">
        Title
      </button>

      @if (source() !== 'today') {
        <button mat-menu-item (click)="sort.emit({sort: 'asc', sortBy: 'dueDate'})">
          Due Date
        </button>
      }

      @if (!['completed', 'priority'].includes(source())) {
        <button mat-menu-item (click)="sort.emit({sort: 'asc', sortBy: 'priority'})">
          Priority
        </button>
      }

      @if (view() === 'list' && source() !== 'completed') {
        <button mat-menu-item (click)="sort.emit({sort: 'asc', sortBy: 'status'})">
          Status
        </button>
      }

      <button mat-menu-item (click)="sort.emit({sort: 'asc', sortBy: 'createdAt'})">
        Created At
      </button>
      <button mat-menu-item (click)="sort.emit({sort: 'asc', sortBy: 'updatedAt'})">
        UpdatedAt At
      </button>
    </mat-menu>


    <mat-menu #desc="matMenu">
      <button mat-menu-item (click)="sort.emit({sort: 'desc', sortBy: 'title'})">
        Title
      </button>

      @if (source() !== 'today') {
        <button mat-menu-item (click)="sort.emit({sort: 'desc', sortBy: 'dueDate'})">
          Due Date
        </button>
      }

      @if (!['completed', 'priority'].includes(source())) {
        <button mat-menu-item (click)="sort.emit({sort: 'desc', sortBy: 'priority'})">
          Priority
        </button>
      }

      @if (view() === 'list' && source() !== 'completed') {
        <button mat-menu-item (click)="sort.emit({sort: 'desc', sortBy: 'status'})">
          Status
        </button>
      }

      <button mat-menu-item (click)="sort.emit({sort: 'desc', sortBy: 'createdAt'})">
        Created At
      </button>
      <button mat-menu-item (click)="sort.emit({sort: 'desc', sortBy: 'updatedAt'})">
        UpdatedAt At
      </button>
    </mat-menu>
  `
})
export class SortBtnComponent {
  // - reactivity
  value = input.required<Signal<{ sort: TSORT; sortBy: string; }>>();

  // - no reactivity
  source = input.required<string>();
  view = input.required<'list' | 'board'>();

  sort = output<{
    sort: TSORT,
    sortBy: string
  }>();
}
