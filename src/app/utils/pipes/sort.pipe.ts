import { inject, Injectable, Pipe, PipeTransform } from '@angular/core';
import { TSORT, TTask } from '../models/task.model';
import { ListService } from '../services/list.service';

@Pipe({
  name: 'sort',
  standalone: true
})
@Injectable({ providedIn: 'root' })
export class SortPipe implements PipeTransform {
  private readonly _LIST_SERVICE = inject(ListService);

  transform(list: TTask[], selection: {sort: TSORT, sortBy: string}): any {
    return this._LIST_SERVICE.sort(list, { status: selection.sort, field: selection.sortBy} as any);
  }
}
