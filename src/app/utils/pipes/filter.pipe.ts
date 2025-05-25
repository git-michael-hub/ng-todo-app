import { inject, Pipe, PipeTransform } from '@angular/core';
import { TTask } from '../models/task.model';
import { ListService } from '../services/list.service';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {
  private readonly _LIST_SERVICE = inject(ListService);

  transform(list: TTask[], filter: string): TTask[] {
    return this._LIST_SERVICE.filter(list, filter);
  }
}
