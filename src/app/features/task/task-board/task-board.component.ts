// NOT USED


import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPlaceholder,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
// import { TASKS } from '../../../utils/values/dataTask.value';
import { SlicePipe } from '@angular/common';

@Component({
  selector: 'app-feature-task-board',
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CdkDropList, CdkDrag, CdkDragPlaceholder, SlicePipe],
})
export class TaskBoardComponent implements OnInit {

  // TASKS: TTask[] = TASKS;

  // constructor() {
  //   STORE().task.list.set(this.TASKS);
  //   console.log('STORE:', STORE());
  //   console.log('STORE:list:', STORE().task.list());

  //   console.log('STORE::listComputed:asc', STORE().task.sort.listComputed());

  //   STORE().task.sort.status.set('desc')
  //   console.log('STORE:listComputed:desc', STORE().task.sort.listComputed());
  // }

  // drop(event: CdkDragDrop<string[]>) {
  //   moveItemInArray(this.TASKS, event.previousIndex, event.currentIndex);
  //   console.log('THIS:', this.TASKS);
  // }

  ngOnInit(): void {

  }

}
