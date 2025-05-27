// Angular
import { effect, inject, Injectable, Signal } from "@angular/core";

// Material
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";

// Third party
import * as _ from 'lodash';

// Local
import { STORE_TOKEN } from "../../data-access/state/state.store";
import { TaskFormDialogComponent } from "../../uis/forms/task-form-dialog/task-form-dialog.component";
import { TTask } from "../../utils/models/task.model";
import { TaskAPI } from "../../data-access/apis/task.api";
import { LoggingService } from "../../utils/services/logging.service";



@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly _TASK_API = inject(TaskAPI);
  private readonly _DIALOG = inject(MatDialog);
  private readonly _SNACK_BAR = inject(MatSnackBar);
  private readonly _LOG = inject(LoggingService);
  private readonly _STORE = inject(STORE_TOKEN);

  private dialogRef!: MatDialogRef<TaskFormDialogComponent, any>;
  private DIALOG_SETTINGS: MatDialogConfig = {
    maxWidth: '60vw',
    width: '60vw',
    maxHeight: '80vh',
    height: '80vh',
    disableClose: true,
  };

  private filterValue = 'none';
  private sortValue: 'asc' | 'desc' = 'desc';

  constructor() {
    this.initProcess();
  }

  initProcess(): void {
    this.getTasks();

    effect(() => {
      // console.log("TASK SERVICE: ", STORE().task.toString());

      // this.checkAdded();
      // this.checkUpdated();
      // this.checkDeleted();
    });
  }

  /**
   * Task
   */

  getTasks(): void {
    this._TASK_API.getTasks()
      .subscribe({
        next: (response) => {
          console.log('List of task:', response);
          this._STORE().task.list.set(response);
          this._LOG.recordData('getTask');
        },
        error: (error) => {
          console.error('Error fetching tasks:', error);
          this._STORE().task.list.set([]);
        }
      });
  }

  addTask(task: TTask): void {
    if (_.isEmpty(task)) return;

    this._TASK_API.addTask(JSON.stringify(task) as unknown as TTask)
      .subscribe({
        next: (response) => {
          console.log('Task created successfully:', response);
          this._STORE().task.list.update(tasks => [...tasks, response]);
          this._STORE().task.added.set(response || null);
          this._LOG.recordData('addTask');

          this.notify(
            `
              Added:
              ${task?.title.slice(0, 20)}
              ${
                (() => (
                  (task?.title.slice(0, 20) as any).length >= 20 ? '...': ''
                ))()
              }
            `
          );
        },
        error: (error) => {
          console.error('Error creating task:', error);
          this._STORE().task.added.set(null);

          this.notify(
            `
              Error adding: ${task?.title.slice(0, 20)}
            `
          );
        }
      });
  }

  updateTask(task: TTask, update_task_id: string, callback: () => void, isDone: boolean = false): void {
    if (_.isEmpty(task) || !update_task_id) return;

    this._TASK_API.updateTask(update_task_id, JSON.stringify(task) as unknown as TTask)
      .subscribe({
        next: (response) => {
          console.log('Task updated successfully:', response);
          this._STORE().task.list.update(
            tasks => [
              ...tasks.filter(t => t.id !== update_task_id),
              response
            ]
          );
          this._STORE().task.updated.set(response || null);
          callback();
          this._LOG.recordData('updateTask');

          this.notify(
            `
              ${isDone ? 'Done Task' : 'Updated'}:
              ${task?.title.slice(0, 20)}
              ${
                (() => (
                  (task?.title.slice(0, 20) as any).length >= 20 ? '...': ''
                ))()
              }
            `
          );
        },
        error: (error) => {
          console.error('Error updating task:', error);
          this._STORE().task.updated.set(null);

          this.notify(
            `
              Error updating: ${task?.title.slice(0, 20)}
            `
          );
        }
      });
  }

  markAsComplete(task: TTask): void {
    this.updateTask(task, task.id || '', () => {}, true);
  }

  deleteTask(task: TTask, id?: string): void {
    if (!id) return;

    this._TASK_API.deleteTask(id)
      .subscribe({
        next: (response) => {
          console.log('Task deleted successfully:', response);
          this._STORE().task.list.update(
            tasks => tasks.filter(task => task.id !== id)
          );
          this._STORE().task.deleted.set(response || null);
          this._LOG.recordData('deleteTask');

          this.notify(
            `
              Deleted:
              ${task?.title.slice(0, 20)}
              ${
                (() => (
                  (task?.title.slice(0, 20) as any).length >= 20 ? '...': ''
                ))()
              }
            `
          );
        },
        error: (error) => {
          console.error('Error deleting task:', error);
          this._STORE().task.deleted.set(null);

          this.notify(
            `
              Error deleting: ${task?.title.slice(0, 20)}
            `
          );
        }
      });
  }


  /**
   * Dialog
   */

  addTaskUI(): void {
    this.dialogRef?.close();

    this.dialogRef = this._DIALOG.open(
      TaskFormDialogComponent,
      this.DIALOG_SETTINGS
    );

    this.dialogRef.afterClosed().subscribe({
      next: (result) => {
        console.log(`Dialog result: ${result}`);
      },
      error: (error) => {
        console.error('Error in dialog:', error);
      }
    });
  }

  viewTaskUI(task: TTask): void {
    if (!task) return;

    this.dialogRef?.close();

    this.dialogRef = this._DIALOG.open(
      TaskFormDialogComponent,
      {
        ...this.DIALOG_SETTINGS,
        data: task
      }
    );

    this.dialogRef.afterClosed().subscribe({
      next: (result) => {
        console.log(`Dialog result: ${result}`);
      },
      error: (error) => {
        console.error('Error in dialog:', error);
      }
    });
  }


  /**
   * Notification
   */

  notify(title: string, ): void {
    this.dialogRef?.close();

    this._SNACK_BAR.open(
      title,
      'close',
      {
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
        duration: 5000
      }
    );
  }

  checkAdded(): void {
    if (this._STORE().task.toString().added?.id) {
      console.log('Successfully added new task!', this._STORE().task.added()?.title);

      this.dialogRef?.close();

      this._SNACK_BAR.open(
        `Added:
        ${this._STORE().task.added()?.title.slice(0, 20)}
        ${
          (() => ((this._STORE().task.added()?.title.slice(0, 20) as any).length >= 20 ? '...': ''))()
        }`,
        'close',
        {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        }
      );

      this._STORE().task.added.set(null);
    }
  }

  checkUpdated(): void {
    if (this._STORE().task.toString().updated?.id) {
      console.log('Successfully updated task!', this._STORE().task.updated()?.title);

      this.dialogRef?.close();

      this._SNACK_BAR.open(
        `Updated:
        ${this._STORE().task.updated()?.title.slice(0, 20)}
        ${
          (() => ((this._STORE().task.updated()?.title.slice(0, 20) as any).length >= 20 ? '...': ''))()
        }`,
        'close',
        {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        }
      );

      this._STORE().task.updated.set(null);
    }
  }

  checkDeleted(): void {
    if (this._STORE().task.toString().deleted?.id) {
      console.log('Successfully deleted task!', this._STORE().task.deleted()?.title);

      this.dialogRef?.close();

      this._SNACK_BAR.open(
        `Deleted:
        ${this._STORE().task.deleted()?.title.slice(0, 20)}
        ${
          (() => ((this._STORE().task.deleted()?.title.slice(0, 20) as any).length >= 20 ? '...': ''))()
        }`,
        'close',
        {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 5000
        }
      );
      // this.recordData('[STORE: DELETED]');
      this._STORE().task.deleted.set(null);
    }
  }
}
