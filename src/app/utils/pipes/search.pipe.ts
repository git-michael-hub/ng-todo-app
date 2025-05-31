import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { TTask } from '../models/task.model';

@Pipe({
  name: 'search',
  standalone: true
})
@Injectable({ providedIn: 'root' })
export class SearchPipe implements PipeTransform {

  transform(tasks?: TTask[], query?: string): TTask[] {
    if (!tasks) return [];
    if (!query) return tasks;

    const lowerQuery = query.toLowerCase();

    return tasks.filter(task =>
      task.title.toLowerCase().includes(lowerQuery)
      || task.description.toLowerCase().includes(lowerQuery)
    );
  }

}
