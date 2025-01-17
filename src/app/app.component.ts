import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, effect, inject, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { io } from "socket.io-client";
import { SidenavComponent } from './core/sidenav/sidenav.component';
import { MatButtonModule } from '@angular/material/button';
import {MAT_DIALOG_DEFAULT_OPTIONS, MatDialog, MatDialogConfig, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { AddTaskFormComponent } from './uis/forms/add-task-form/add-task-form.component';
import { TaskAPI } from './data-access/apis/task.api';
import { STORE } from './data-access/state/state.store';
import { TASKS } from './utils/values/dataTask.value';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, SidenavComponent, MatButtonModule, MatDialogModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly _dialog = inject(MatDialog);
  private readonly _taskAPI = inject(TaskAPI);
  private readonly _snackBar = inject(MatSnackBar);

  TASKS = TASKS;

  title = 'ng-todo-app';

  serverUrl = 'http://localhost:3000';

  users?: any[];

  mode: 'list' | 'board' = 'list';



  dialogRef!: MatDialogRef<AddTaskFormComponent, any>;

  private __DATA__: any[]  = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private http: HttpClient
  ) {
    this._taskAPI.getTasks()
      .subscribe({
        next: (response) => {
          console.log('List of task:', response);
          // this.TASKS = response.splice(0, 100);

          // STORE().task.list.set(this.TASKS);
          STORE().task.list.set(response);
          // STORE().task.list.set(response.splice(0, 500));
        },
        error: (error) => {
          console.error('Error getting the list of task:', error);
        },
      });

    //   STORE().task.sort.status.set('asc');
    //   const TASKS = STORE().task.sort.listComputed();
    //   console.log(`[STORE]1: ${STORE().task.sort.listComputed()}`);
    //   console.log(`[STORE]2: ${TASKS}`);

    effect(() => {



      // STORE().task.sort.status.set('asc');
      console.log('[STORE]', STORE().task.toString());

      // if (STORE().task.added()) console.log('[STORE: ADDED]',  STORE().task.added());
      // if (STORE().task.updated()) console.log('[STORE: UPDATED]',  STORE().task.updated());

      if (STORE().task.added()?.id) {
        console.log('Successfully added new task!', STORE().task.added()?.title);
        this.dialogRef?.close();

        this._snackBar.open(
          `Successfully added new task: ${ STORE().task.added()?.title.slice(0, 20)}`,
          'close',
          {
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
            duration: 5000
          }
        );

        this.recordData('[STORE: ADDED]');
        STORE().task.added.set(null);
      }

      if (STORE().task.updated()?.id) {
        console.log('Successfully upadted the task!', STORE().task.updated()?.title);
        this.dialogRef?.close();

        this._snackBar.open(
          `Successfully upadted the task: ${STORE().task.updated()?.title.slice(0, 20)}`,
          'close',
          {
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
            duration: 5000
          }
        );

        this.recordData('[STORE: UPDATED]');
        STORE().task.updated.set(null);
      }

      if (STORE().task.deleted()?.id) {
        console.log('Successfully deleted the task!', STORE().task.deleted()?.title);

        this._snackBar.open(
          `Successfully deleted the task: ${STORE().task.deleted()?.title.slice(0, 20)}`,
          'close',
          {
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
            duration: 5000
          }
        );
        this.recordData('[STORE: DELETED]');
        STORE().task.deleted.set(null);
      }
    });
  }

  ngOnInit(): void {
    // if (isPlatformBrowser(this.platformId)) {
    //   console.log('Running in the browser');

    //   const socket = io(this.serverUrl);

    //   socket.on('connect', () => {
    //     console.log('connected to socket.io');

    //     // notify the other users
    //     socket.emit("connect-app", new Date());
    //   });

    //   this.fetchUsers();
    // }

    // if (isPlatformServer(this.platformId)) {
    //   console.log('Running on the server');
    // }
  }

  fetchUsers() {
    this.http.get('http://localhost:3000/api/users').subscribe((data: any) => {
      console.log('get:', data);
      this.users = data;
    });
  }

  addUser(d: any) {
    console.log(d.value)
    this.http.post('http://localhost:3000/api/users', {
      name: d.value,
      email: d.value
    }).subscribe(data => {
      console.log(data);
      this.fetchUsers();
    });
  }

  editUser(id: any, d: any) {
    console.log(d.value)
    this.http.put(`http://localhost:3000/api/users/${id}`, {
      name: d.value,
      email: d.value
    }).subscribe({
      next: (data) => {
        console.log('EDIT SUCCESS:', data);
        this.fetchUsers(); // Refresh the user list
      },
      error: (error) => {
        console.error('EDIT ERROR:', error);
      }
    });
  }

  deleteUser(id: any) {
    this.http.delete(`http://localhost:3000/api/users/${id}`).subscribe({
      next: (data) => {
        console.log('DELETE SUCCESS:', data);
        this.fetchUsers(); // Refresh the user list
      },
      error: (error) => {
        console.error('dELETE ERROR:', error);
      }
    });
  }

  addTask(): void {
    this.dialogRef = this._dialog.open(
      AddTaskFormComponent,
      {
        maxWidth: '50vw',
        width: '50vw',
        maxHeight: '80vh',
        height: '80vh',
        disableClose: true,
      } as MatDialogConfig
    );

    // dialogRef.close();

    this.dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });


  }


  recordData(action: string): void {
    // TODO: duplication of action


    this.__DATA__ = [
      ...this.__DATA__,
      {
        action,
        state: STORE().task.toString()
      }
    ];

    console.log('[RECORD_DATA]:', this.__DATA__);
  }

}
