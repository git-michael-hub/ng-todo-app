import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { io } from "socket.io-client";
import { SidenavComponent } from './core/sidenav/sidenav.component';
import { MatButtonModule } from '@angular/material/button';
import {MAT_DIALOG_DEFAULT_OPTIONS, MatDialog, MatDialogConfig, MatDialogModule} from '@angular/material/dialog';
import { AddTaskFormComponent } from './uis/forms/add-task-form/add-task-form.component';
import { TaskAPI } from './data-access/apis/task.api';
import { STORE } from './data-access/state/state.store';


@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, SidenavComponent, MatButtonModule, MatDialogModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly dialog = inject(MatDialog);

  title = 'ng-todo-app';

  serverUrl = 'http://localhost:3000';

  users?: any[];

  mode: 'list' | 'board' = 'list';

  private taskAPIDI = inject(TaskAPI);

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private http: HttpClient
  ) {
    this.taskAPIDI.getTasks()
      .subscribe({
        next: (response) => {
          console.log('List of task:', response);
          // this.TASKS = response.splice(0, 100);

          STORE().task.list.set(response);
          // STORE().task.list.set(response.splice(0, 500));
        },
        error: (error) => {
          console.error('Error getting the list of task:', error);
        },
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
    const dialogRef = this.dialog.open(
      AddTaskFormComponent,
      {
        maxWidth: '50vw',
        width: '50vw',
        maxHeight: '80vh',
        height: '80vh',
        disableClose: true,
      } as MatDialogConfig
    );

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
