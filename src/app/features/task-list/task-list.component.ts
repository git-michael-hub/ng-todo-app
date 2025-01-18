import { ChangeDetectionStrategy, Component, effect, inject, input, Input, OnInit, Signal } from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPlaceholder,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { TASKS } from '../../utils/values/dataTask.value';
import { DatePipe, SlicePipe } from '@angular/common';
import { STORE } from '../../data-access/state/state.store';
import { TTask } from '../../utils/models/task.model';
import { TaskAPI } from '../../data-access/apis/task.api';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { TitleCasePipe } from '@angular/common';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { AddTaskFormComponent } from '../../uis/forms/add-task-form/add-task-form.component';
import { PriorityPipe } from '../../utils/pipes/priority.pipe';


@Component({
  selector: 'app-feature-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  standalone: true,
  imports: [
    SlicePipe,
    // BrowserModule,
    // BrowserAnimationsModule,
    MatButtonModule,
    ScrollingModule,
    MatCheckboxModule,
    TitleCasePipe,
    PriorityPipe,
    DatePipe
  ],
})
export class TaskListComponent implements OnInit {
  @Input() TASKS!: TTask[];

  private readonly _taskAPI = inject(TaskAPI);
  private readonly _dialog = inject(MatDialog);
  // TASKS = input<TTask[]>([] as unknown as TTask[]);
  // TASKS = input<Signal<TTask[]>>();

  // private taskAPIDI = inject(TaskAPI);

  dialogRef!: MatDialogRef<AddTaskFormComponent, any>;


  constructor() {
    // this.TASKS = STORE().task.list();
    // STORE().task.list.set(this.TASKS);
    // console.log('STORE:', STORE());
    // console.log('STORE:list:', STORE().task.list());

    // console.log('STORE::listComputed:asc', STORE().task.sort.listComputed());

    // STORE().task.sort.status.set('desc')
    // console.log('STORE:listComputed:desc', STORE().task.sort.listComputed());

    effect(() => {
      if (STORE().task.updated()?.id) {
        this.dialogRef?.close();
      }
    });
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

  viewTask(task: TTask): void {
    this.dialogRef = this._dialog.open(
      AddTaskFormComponent,
      {
        maxWidth: '50vw',
        width: '50vw',
        maxHeight: '80vh',
        height: '80vh',
        disableClose: true,
        data: task
      } as MatDialogConfig
    );

    // dialogRef.close();

    this.dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  deleteTask(id?: string): void {
    if (!id) return;

    this._taskAPI.deleteTask(id)
      .subscribe({
        next: (response) => {
          console.log('Task deleted successfully:', response);
          STORE().task.list.update(
            tasks => [
              ...(() => tasks.filter(task => task.id !== id))()
            ]
          );
          STORE().task.deleted.set(response || null);
        },
        error: (error) => {
          console.error('Error updating task:', error);
          STORE().task.deleted.set(null);
        },
      });
  }

}
