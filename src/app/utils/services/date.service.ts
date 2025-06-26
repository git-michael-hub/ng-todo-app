import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class DateService {
  isToday(taskDate: string): boolean {
    const today = new Date().toISOString().split('T')[0];
    const taskDateStr = new Date(taskDate).toISOString().split('T')[0];
    return taskDateStr === today;
  }

  notToday(taskDate: string): boolean {
    const today = new Date().toISOString().split('T')[0];
    return taskDate.split('T')[0] !== today;
  }

  isUpcoming(taskDate: string): boolean {
    const today = new Date().setHours(0, 0, 0, 0);
    const input = new Date(taskDate).setHours(0, 0, 0, 0);
    return input > today; // strictly future
  }
}