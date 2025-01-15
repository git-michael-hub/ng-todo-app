import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TTask } from '../../utils/models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskAPI {
  private apiUrl = ' http://localhost:3000/api/tasks';

  constructor(private http: HttpClient) {}

  getTasks<T extends TTask>(): Observable<T[]> {
    return this.http.get<T[]>(this.apiUrl);
  }

  getTask<T extends TTask>(id: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${id}`);
  }

  addTask<T extends TTask>(task: T): Observable<T> {
    return this.http.post<T>(this.apiUrl, task);
  }

  updateTask<T extends TTask>(id: string, task: T): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${id}`, task);
  }

  deleteTask<T extends TTask>(id: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}/${id}`);
  }
}
