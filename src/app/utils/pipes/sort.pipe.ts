import { inject, Pipe, PipeTransform } from '@angular/core';
import { TSORT, TTask } from '../models/task.model';
import { ListService } from '../services/list.service';

@Pipe({
  name: 'sort',
  standalone: true
})
export class SortPipe implements PipeTransform {
  private readonly _LIST_SERVICE = inject(ListService);

  transform(list: TTask[], selection: {sort: TSORT, sortBy: string}): any {
    console.log('selection pipe::', selection)
    return this._LIST_SERVICE.sort(list, { status: selection.sort, field: selection.sortBy} as any);
  }
}
