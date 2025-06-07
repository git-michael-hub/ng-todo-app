import { computed, InjectionToken, signal, WritableSignal } from "@angular/core";
import { IState } from "./state.model";


// Define the STORE Injection Token
export const STORE_TOKEN = new InjectionToken<WritableSignal<IState>>('STORE');

// Create the STORE signal
export const STORE: WritableSignal<IState> = signal({
  id: 'main_store',
  currentPage: signal(''),
  task: {
    list: signal([]),
    getList: computed(() => STORE().task.list()),

    added: signal(null),
    updated: signal(null),
    viewed: signal(null),
    deleted: signal(null),

    count: {
      allListComputed: computed(() => {
        const TASKS = STORE().task.getList();
        return TASKS?.length;
      }),
      completeListComputed: computed(() => {
        const TASKS = STORE().task.getList();
        return TASKS.filter(task => task?.status === 'done')?.length;
      }),
      todoListComputed: computed(() => {
        const TASKS = STORE().task.getList();
        return TASKS.filter(task => task?.status === 'todo')?.length;
      }),
      highPriorityListComputed: computed(() => {
        const TASKS = STORE().task.getList();
        return TASKS.filter(task => task.priority === 'high' && (task?.status !== 'done'))?.length;
      }),
      inProgressListComputed: computed(() => {
        const TASKS = STORE().task.getList();
        return TASKS.filter(task => task?.status === 'inprogress')?.length;
      }),
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
