import { computed, signal, WritableSignal } from "@angular/core";
import { IState } from "./state.model";


const IS_TODAY = (taskDate: string): boolean => {
  const today = new Date().toISOString().split('T')[0];
  return taskDate === today;
}

const NOT_TODAY = (taskDate: string): boolean => {
  const today = new Date().toISOString().split('T')[0];
  return taskDate !== today;
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

        // recently added , asc

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
          case 'upcoming': return [...TASKS].filter(task => NOT_TODAY(task.date));
          case 'high-priority': return [...TASKS].filter(task => task.priority === 'high');
          case 'complete': return [...TASKS].filter(task => task.isCompleted);
          case 'archive': return [...TASKS].filter(task => task.isArchive);
        }
      })
    },
    // today , asc
    // upcoming, asc
    // high priority, by high prio and asc date
    // complete, asc
    // archive, asc
    count: {
      status: signal('all'),
      listComputed: computed(() => {
        const STATUS = STORE().task.count.status();
        const TASKS = STORE().task.list();

        switch (STATUS) {
          case 'all': return [...TASKS]?.length;
          case 'complete': return [...TASKS].filter(task => task.isCompleted)?.length;
          case 'high-priority': return [...TASKS].filter(task => task.priority === 'high')?.length;
          case 'todo': return [...TASKS].filter(task => !task.isCompleted)?.length;
        }
      })
    },
    // all
    // iscompleted
    // left
    // high prio

    toString: () => {
      return {
        list: STORE().task.list(),
        added: STORE().task.added(),
        updated: STORE().task.updated(),
        viewed: STORE().task.viewed(),
        deleted: STORE().task.deleted()
      }
    }

  },
});
