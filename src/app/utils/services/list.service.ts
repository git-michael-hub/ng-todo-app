import { inject, Injectable } from "@angular/core";
import { TSORT, TTask } from "../models/task.model";
import { DateService } from "./date.service";

@Injectable({
  providedIn: 'root'
})
export class ListService {
  // - di
  private readonly _DATE_SERVICE = inject(DateService);

  private readonly PRIORITY_ORDER: Record<string, number> = {
    low: 1,
    medium: 2,
    high: 3,
  };
  private readonly STATUS_ORDER: Record<string, number> = {
    todo: 1,
    inprogress: 2,
    block: 3,
    inreview: 4,
    done: 5
  };


  sort<K extends keyof Pick<
    TTask, 'title' | 'priority' | 'createdAt' | 'updatedAt' | 'dueDate' | 'status'>
  >(
    list: TTask[],
    selection: {
      status: TSORT,
      field: K
    } = { status: 'desc', field: 'createdAt' as K}
  ): TTask[] {
    // use spread for signal input child reactivity
    let task: TTask[] = [];

    switch (selection.field) {
      case 'createdAt':
        task = [...list].sort((a, b) =>
          selection.status === 'asc'
            ? new Date(a[selection.field]).getTime() - new Date(b[selection.field]).getTime() // asc
            : new Date(b[selection.field]).getTime() - new Date(a[selection.field]).getTime() // desc
        );
        break;
      case 'updatedAt':
        task = [...list].sort((a, b) =>
          selection.status === 'asc'
            ? new Date(a[selection.field]).getTime() - new Date(b[selection.field]).getTime() // asc
            : new Date(b[selection.field]).getTime() - new Date(a[selection.field]).getTime() // desc
        );
        break;
      case 'dueDate':
        task = [...list].sort((a, b) =>
          selection.status === 'asc'
            ? new Date(a[selection.field]).getTime() - new Date(b[selection.field]).getTime() // asc
            : new Date(b[selection.field]).getTime() - new Date(a[selection.field]).getTime() // desc
        );
        break;
      case 'priority':
        task = [...list].sort((a, b) => {
          const aVal = this.PRIORITY_ORDER[a[selection.field]];
          const bVal = this.PRIORITY_ORDER[b[selection.field]];

          return selection.status === 'asc'
            ? aVal - bVal
            : bVal - aVal;
        });
        break;
      case 'status':
        task = [...list].sort((a, b) => {
          const aVal = this.STATUS_ORDER[a[selection.field]];
          const bVal = this.STATUS_ORDER[b[selection.field]];

          return selection.status === 'asc'
            ? aVal - bVal
            : bVal - aVal;
        });
        break;
      default:
          task =  [...list].sort((a, b) =>
            selection.status === 'asc'
              ? a[selection.field].localeCompare(b[selection.field]) // asc
              : b[selection.field].localeCompare(a[selection.field]) // desc
          );
    }

    return task;
  }

  filter(list: TTask[], filter: string, sort: TSORT = 'desc'): TTask[] {
    switch (filter) {
      case 'today': return this.sort(
        list.filter(task => this._DATE_SERVICE.isToday(task.dueDate)),
        {
          status: sort,
          field: 'createdAt'
        }
      );
      case 'upcoming': {

        // Convert the dates to Date objects
        const withDateObject = list
        .filter(task => this._DATE_SERVICE.isUpcoming(task.dueDate))
        .map(task => ({
          ...task,
          dueDate: new Date(task.dueDate)
        }));

        // Get the current date
        const today = new Date();

        // Filter upcoming dates
        let upcomingDates: any = withDateObject.filter(task => task.dueDate >= today);
        upcomingDates = upcomingDates.map((task: { dueDate: { toDateString: () => any; }; }) => ({
          ...task,
          dueDate: task.dueDate?.toDateString()
        }));

        return this.sort(
          upcomingDates,
          {
            status: 'asc',
            field: 'dueDate'
          }
        );
      }
      case 'low-priority': return this.sort(
        list.filter(task => task.priority === 'low'),
        {
          status: sort,
          field: 'dueDate'
        }
      );
      case 'medium-priority': return this.sort(
        list.filter(task => task.priority === 'medium'),
        {
          status: sort,
          field: 'dueDate'
        }
      );
      case 'high-priority': return this.sort(
        list.filter(task => task.priority === 'high'),
        {
          status: sort,
          field: 'dueDate'
        }
      );
      case 'todo': return this.sort(
        list.filter(task => task?.status === 'todo'),
        {
          status: sort,
          field: 'dueDate'
        }
      );
      case 'in-progress': return this.sort(
        list.filter(task => task?.status === 'inprogress'),
        {
          status: sort,
          field: 'dueDate'
        }
      );
      case 'done': return this.sort(
        list.filter(task => task?.status === 'done'),
        {
          status: sort,
          field: 'createdAt'
        }
      );
      case 'in-review': return this.sort(
        list.filter(task => task?.status === 'inreview'),
        {
          status: sort,
          field: 'dueDate'
        }
      );
      case 'block': return this.sort(
        list.filter(task => task?.status === 'block'),
        {
          status: sort,
          field: 'dueDate'
        }
      );
      case 'archive': return this.sort(
        list.filter(task => task.isArchive),
        {
          status: sort,
          field: 'updatedAt'
        }
      );
      case 'none': return this.sort(
        list,
        {
          status: sort,
          field: 'createdAt'
        }
      );
      default: return list;
    }
  }
}