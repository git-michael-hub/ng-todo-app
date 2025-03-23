import { computed, signal, WritableSignal } from "@angular/core";
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

        return [...TASKS].sort((a, b) =>
          ORDER === 'asc'
            ? new Date(a.date).getTime() - new Date(b.date).getTime() // asc
            : new Date(b.date).getTime() - new Date(a.date).getTime() // desc
        );
      })
    },
    filter: {
      status: signal('today'),
      listComputed: computed(() => {
        const FILTER = STORE().task.filter.status();
        const TASKS = STORE().task.list();

        switch (FILTER) {
          case 'today': return [...TASKS].filter(task => IS_TODAY(task.date));
          case 'upcoming': {

            // Convert the dates to Date objects
            const withDateObject = TASKS.map(task => ({
              ...task,
              date: new Date(task.date)
            }));

            // Get the current date
            const today = new Date();

            // Filter upcoming dates
            let upcomingDates: any = withDateObject.filter(task => task.date >= today);
            upcomingDates = upcomingDates.map((task: { date: { toDateString: () => any; }; }) => ({
              ...task,
              date: task.date?.toDateString()
            }));

            return upcomingDates
              .sort((a: { date: string | number | Date; }, b: { date: string | number | Date; }) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()) as unknown as TTask[]; // desc

          }
          case 'high-priority': return [...TASKS].filter(task => task.priority === 'high');
          case 'complete': return [...TASKS].filter(task => task.isCompleted);
          case 'archive': return [...TASKS].filter(task => task.isArchive);
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
