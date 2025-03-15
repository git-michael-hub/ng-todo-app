// Angular
import { effect, inject, Injectable, Signal } from "@angular/core";

// Material
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";

// Local
import { STORE } from "../../data-access/state/state.store";
import { TaskFormDialogComponent } from "../../uis/forms/task-form-dialog/task-form-dialog.component";
import { TTask } from "../../utils/models/task.model";
import { TaskAPI } from "../../data-access/apis/task.api";
import { TPage } from "../../data-access/state/state.model";
import { LoggingService } from "../../utils/services/logging.service";



@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly _TASK_API = inject(TaskAPI);
  private readonly _DIALOG = inject(MatDialog);
  private readonly _SNACK_BAR = inject(MatSnackBar);
  private readonly _LOG = inject(LoggingService);

  private dialogRef!: MatDialogRef<TaskFormDialogComponent, any>;

  constructor() {
    this.getTask();

    effect(() => {
      console.log("TASK SERVICE: ", STORE().task.toString());

      if (STORE().task.added()?.id) {
        console.log('Successfully added new task!', STORE().task.added()?.title);
        this.dialogRef?.close();

        this._SNACK_BAR.open(
          `Added:
          ${STORE().task.added()?.title.slice(0, 20)}
          ${
            (() => ((STORE().task.added()?.title.slice(0, 20) as any).length >= 20 ? '...': ''))()
          }`,
          'close',
          {
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
            duration: 5000
          }
        );

        // this.recordData('[STORE: ADDED]');
        STORE().task.added.set(null);
      }

      if (STORE().task.updated()?.id) {
        console.log('Successfully updated task!', STORE().task.added()?.title);
        this.dialogRef?.close();

        this._SNACK_BAR.open(
          `Updated:
          ${STORE().task.updated()?.title.slice(0, 20)}
          ${
            (() => ((STORE().task.updated()?.title.slice(0, 20) as any).length >= 20 ? '...': ''))()
          }`,
          'close',
          {
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
            duration: 5000
          }
        );

        // this.recordData('[STORE: UPDATED]');
        STORE().task.updated.set(null);
      }

      if (STORE().task.deleted()?.id) {
        console.log('Successfully deleted task!', STORE().task.deleted()?.title);
        this.dialogRef?.close();

        this._SNACK_BAR.open(
          `Deleted:
          ${STORE().task.deleted()?.title.slice(0, 20)}
          ${
            (() => ((STORE().task.deleted()?.title.slice(0, 20) as any).length >= 20 ? '...': ''))()
          }`,
          'close',
          {
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
            duration: 5000
          }
        );
        // this.recordData('[STORE: DELETED]');
        STORE().task.deleted.set(null);
      }
    });
  }

  getTask(): void {
    this._TASK_API.getTasks()
      .subscribe({
        next: (response) => {
          console.log('List of task:', response);

          STORE().task.list.set(response);
          // STORE().task.list.set(response.splice(0, 500));

          this._LOG.recordData('getTask');
        },
        error: (error) => {
          console.error('Error getting the list of task:', error);
        },
      });
  }

  addTask(task: TTask) {
    if (!task) return;

    this._TASK_API.addTask(task)
      .subscribe({
        next: (response) => {
          console.log('Task created successfully:', response);
          STORE().task.list.update(tasks => [...tasks, response]);
          STORE().task.added.set(response || null);

          this._LOG.recordData('addTask');
        },
        error: (error) => {
          console.error('Error creating task:', error);
          STORE().task.added.set(null);
        },
      });
  }

  updateTask(task: TTask, update_task_id: string, callback: () => void ) {
    this._TASK_API.updateTask(update_task_id, task)
      .subscribe({
        next: (response) => {
          console.log('Task updated successfully:', response);
          STORE().task.list.update(
            tasks => [
              ...(() => tasks.filter(task => task.id !== update_task_id))(),
              response
            ]
          );
          STORE().task.updated.set(response || null);

          callback();

          this._LOG.recordData('updateTask');
        },
        error: (error) => {
          console.error('Error updating task:', error);
          STORE().task.updated.set(null);
        },
      });
  }

  markAsComplete(task: TTask): void {
    if (!task || !task.id) return;

    this._TASK_API.updateTask(task.id || '', task)
      .subscribe({
        next: (response) => {
          console.log('Task updated successfully: completed', response);
          STORE().task.updated.set(response || null);

          this._LOG.recordData('markAsComplete');
        },
        error: (error) => {
          console.error('Error updating task:', error);
          STORE().task.updated.set(null);
        },
      });
  }

  deleteTask(id?: string): void {
    if (!id) return;

    this._TASK_API.deleteTask(id)
      .subscribe({
        next: (response) => {
          console.log('Task deleted successfully:', response);
          STORE().task.list.update(
            tasks => [
              ...(() => tasks.filter(task => task.id !== id))()
            ]
          );
          STORE().task.deleted.set(response || null);

          this._LOG.recordData('deleteTask');
        },
        error: (error) => {
          console.error('Error updating task:', error);
          STORE().task.deleted.set(null);
        },
      });
  }


  addTaskUI(): void {
    this.dialogRef = this._DIALOG.open(
      TaskFormDialogComponent,
      {
        maxWidth: '60vw',
        width: '60vw',
        maxHeight: '80vh',
        height: '80vh',
        disableClose: true,
      } as MatDialogConfig
    );

    this.dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });


  }

  viewTaskUI(task: TTask): void {
    this.dialogRef = this._DIALOG.open(
      TaskFormDialogComponent,
      {
        maxWidth: '60vw',
        width: '60vw',
        maxHeight: '80vh',
        height: '80vh',
        disableClose: true,
        data: task
      } as MatDialogConfig
    );

    this.dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  toSearch(term: string, page: TPage, list: Signal<TTask[]>): Signal<TTask[]> {
    if (term) {
      STORE().task.search.list.set(list());
      STORE().task.search.term.set(term);
      STORE().task.search.page.set(page);

      return STORE().task.search.filteredListByTitle;
    }

    return list;
  }
}
