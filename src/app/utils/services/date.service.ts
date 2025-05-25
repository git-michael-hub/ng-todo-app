import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class DateService {
  isToday(taskDate: string): boolean {
    const today = new Date().toISOString().split('T')[0];
    return taskDate.split('T')[0] === today;
  }

  notToday(taskDate: string): boolean {
    const today = new Date().toISOString().split('T')[0];
    return taskDate.split('T')[0] !== today;
  }
}