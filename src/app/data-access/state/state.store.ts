import { computed, InjectionToken, signal, WritableSignal } from "@angular/core";
import { IState } from "./state.model";
import { TTask } from "../../utils/models/task.model";



const IS_TODAY = (taskDate: string): boolean => {
  const today = new Date().toISOString().split('T')[0];
  // console.log('taskDate:', taskDate)
  // console.log('today:', today)
  return taskDate.split('T')[0] === today;
}

const NOT_TODAY = (taskDate: string): boolean => {
  const today = new Date().toISOString().split('T')[0];
  return taskDate.split('T')[0] !== today;
}

const SORT_FN = <K extends keyof Pick<TTask, 'createdAt' | 'updatedAt' | 'dueDate'>>(
  list: TTask[],
  status: 'asc' | 'desc' = 'asc',
  field: K = 'createdAt' as K
): TTask[] =>
  list.sort((a, b) =>
    status === 'asc'
      ? new Date(a[field]).getTime() - new Date(b[field]).getTime() // asc
      : new Date(b[field]).getTime() - new Date(a[field]).getTime() // desc
  );

// Define the STORE Injection Token
export const STORE_TOKEN = new InjectionToken<WritableSignal<IState>>('STORE');

// Create the STORE signal
export const STORE: WritableSignal<IState> = signal({
  id: 'main_store',
  task: {
    list: signal([]),
    added: signal(null),
    updated: signal(null),
    viewed: signal(null),
    deleted: signal(null),

    sort: {
      status: signal('asc'),
      listComputed: computed(() => {
        const ORDER = STORE().task.sort.status();
        const TASKS = STORE().task.list();

        return SORT_FN(TASKS, ORDER);
      })
    },
    filter: {
      status: signal('list'),
      sort: signal('asc'),
      listComputed: computed(() => {
        const FILTER = STORE().task.filter.status();
        const SORT = STORE().task.filter.sort();
        const TASKS = STORE().task.list();

        switch (FILTER) {
          case 'today': return SORT_FN(TASKS.filter(task => IS_TODAY(task.dueDate)), SORT);
          case 'upcoming': {

            // Convert the dates to Date objects
            const withDateObject = TASKS.map(task => ({
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

            return upcomingDates
              .sort((a: { dueDate: string | number | Date; }, b: { dueDate: string | number | Date; }) =>
                new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()) as unknown as TTask[]; // asc
          }
          case 'high-priority': return [...TASKS]
            .filter(task => task.priority === 'high')
            .sort((a: { dueDate: string | number | Date; }, b: { dueDate: string | number | Date; }) =>
              new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()) as unknown as TTask[]; // asc
          ;
          case 'complete': return [...TASKS]
            .filter(task => task.isCompleted)
            .sort((a: { dueDate: string | number | Date; }, b: { dueDate: string | number | Date; }) =>
              new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()) as unknown as TTask[]; // asc
          ;
          case 'archive': return [...TASKS]
            .filter(task => task.isArchive)
            .sort((a: { updatedAt: string | number | Date; }, b: { updatedAt: string | number | Date; }) =>
              new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()) as unknown as TTask[]; // asc
          ;
          default: return TASKS;
        }
      })
    },
    count: {
      allListComputed: computed(() => {
        const TASKS = STORE().task.list();
        return [...TASKS]?.length;
      }),
      completeListComputed: computed(() => {
        const TASKS = STORE().task.list();
        return [...TASKS].filter(task => task.isCompleted)?.length;
      }),
      todoListComputed: computed(() => {
        const TASKS = STORE().task.list();
        return [...TASKS].filter(task => !task.isCompleted)?.length;
      }),
      highPriorityListComputed: computed(() => {
        const TASKS = STORE().task.list();
        return [...TASKS].filter(task => task.priority === 'high')?.length;
      })
    },
    search: {
      page: signal('list'),
      term: signal(''),
      list: signal([]),

      filteredListByTitle: computed(() => {
        const TERM = STORE().task.search.term();
        const LIST = STORE().task.search.list();

        return LIST.filter(task => task.title.toLowerCase().includes(TERM.toLowerCase()));
      })
    },
    toString: () => ({
      list: STORE().task.list(),
      added: STORE().task.added(),
      updated: STORE().task.updated(),
      viewed: STORE().task.viewed(),
      deleted: STORE().task.deleted()
    }),
  },
});
