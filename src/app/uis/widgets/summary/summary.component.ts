import { Component, OnInit, ChangeDetectionStrategy, effect, ChangeDetectorRef, inject } from '@angular/core';
import { MatCard, MatCardFooter, MatCardContent } from '@angular/material/card';
import { STORE } from '../../../data-access/state/state.store';

@Component({
  selector: 'app-ui-widget-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatCard, MatCardFooter, MatCardContent]
})
export class SummaryComponent implements OnInit {
  private readonly _cd = inject(ChangeDetectorRef);

  totalHighPriority!: number;
  totalCompleted!: number;
  totalTodo!: number;
  totalAll!: number;

  constructor() {

    // STORE().task.count.status.set('high-priority');
    // this.totalHighPriority = STORE().task.count.listComputed();

    // STORE().task.count.status.set('complete');
    // this.totalCompleted = STORE().task.count.listComputed();

    // STORE().task.count.status.set('todo');
    // this.totalTodo = STORE().task.count.listComputed();

    // STORE().task.count.status.set('all');
    // this.totalAll = STORE().task.count.listComputed();

    effect(() => {

      console.log('SUMMAR EFFECT');

      console.log(this.totalHighPriority)

      this.totalHighPriority = STORE().task.count.highPriorityListComputed();
      this.totalCompleted = STORE().task.count.completeListComputed();
      this.totalTodo = STORE().task.count.todoListComputed();
      this.totalAll = STORE().task.count.allListComputed();

      this._cd.markForCheck();

    });
  }

  ngOnInit() {
  }

}
