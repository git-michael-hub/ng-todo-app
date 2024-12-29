import { computed, signal, WritableSignal } from "@angular/core";
import { IState } from "./state.model";



export const STORE: WritableSignal<IState> = signal({
  id: 'main_store',
  task: {
    list: signal([]),
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
    }
  }
});
