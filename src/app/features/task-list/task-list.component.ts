import { ChangeDetectionStrategy, Component, inject, input, Input, OnInit } from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPlaceholder,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { TASKS } from '../../utils/values/dataTask.value';
import { SlicePipe } from '@angular/common';
import { STORE } from '../../data-access/state/state.store';
import { TTask } from '../../utils/models/task.model';
import { TaskAPI } from '../../data-access/apis/task.api';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@Component({
  selector: 'app-feature-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    SlicePipe,
    // BrowserModule,
    // BrowserAnimationsModule,
    ScrollingModule
  ],
})
export class TaskListComponent implements OnInit {
  // @Input() TASKS!: TTask[];
  TASKS = input<TTask[]>([] as unknown as TTask[]);

  private taskAPIDI = inject(TaskAPI);



  constructor() {
    // this.TASKS = STORE().task.list();
    // STORE().task.list.set(this.TASKS);
    // console.log('STORE:', STORE());
    // console.log('STORE:list:', STORE().task.list());

    // console.log('STORE::listComputed:asc', STORE().task.sort.listComputed());

    // STORE().task.sort.status.set('desc')
    // console.log('STORE:listComputed:desc', STORE().task.sort.listComputed());
  }

  // drop(event: CdkDragDrop<TTask[]>) {
  //   moveItemInArray(this.TASKS, event.previousIndex, event.currentIndex);
  //   console.log('THIS:', this.TASKS);
  // }

  ngOnInit(): void {
    // if (STORE().task.list()?.length === 0) {
    //   this.taskAPIDI.getTasks()
    //   .subscribe({
    //     next: (response) => {
    //       console.log('List of task:', response);
    //       STORE().task.list.set(response);
    //       // this.TASKS = response.splice(0, 100);
    //     },
    //     error: (error) => {
    //       console.error('Error getting the list of task:', error);
    //     },
    //   });
    // }
    // else {
    //   this.TASKS = STORE().task.list();
    // }
  }

  trackById(index: number, item: any): number {
    return item.id; // Use the item's unique identifier
  }

}
