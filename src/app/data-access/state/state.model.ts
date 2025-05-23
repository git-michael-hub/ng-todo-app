import { Signal, WritableSignal } from "@angular/core";
import { TError } from "../../utils/models/common.model"
import { TTask } from "../../utils/models/task.model"



type TAPI = {
  isRequestingAPI?: boolean, // checking for API request
  response?: boolean, // response data from the request
  hasError?: TError // error from the request
};

export type TPage = 'recent' | 'today' | 'upcoming' | 'high-priority' | 'list' | 'complete' | 'archive';

export interface IState {
  id: string,
  authentication?: TAPI & {
    status: 'login' | 'logout'
  },
  task: TAPI & {
    list: WritableSignal<TTask[]>, // the data content of the list

    added: WritableSignal<TTask | null>, // new added task
    updated: WritableSignal<TTask | null>, // latest updated task
    viewed: WritableSignal<TTask | null>, // current viewed task
    deleted: WritableSignal<TTask | null>, // latest deleted task


    sort: {
      status: WritableSignal<'asc' | 'desc'>,
      listComputed: Signal<TTask[]>
    },
    filter: {
      status: WritableSignal<'today' | 'upcoming' | 'high-priority' | 'complete' | 'archive' | 'list' >,
      listComputed: Signal<TTask[]>,
      sort: WritableSignal<'asc' | 'desc'>,
    },
    count: {
      // status: WritableSignal<'all' | 'complete' | 'todo' | 'high-priority'>,
      allListComputed: Signal<number>,
      completeListComputed: Signal<number>,
      todoListComputed: Signal<number>,
      highPriorityListComputed: Signal<number>
    },
    search: {
      page: WritableSignal<TPage>,
      term: WritableSignal<string>,
      filteredListByTitle: Signal<TTask[]>,
      list: WritableSignal<TTask[]>
    },

    toString: () => any
  },
  error?: TError // a global error data
}
