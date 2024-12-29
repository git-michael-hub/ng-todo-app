import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { io } from "socket.io-client";
import { SidenavComponent } from './core/sidenav/sidenav.component';


@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, SidenavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ng-todo-app';

  serverUrl = 'http://localhost:3000';

  users?: any[];

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private http: HttpClient
  ) {}

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

}
