import { Signal, WritableSignal } from "@angular/core";
import { TError } from "../../utils/models/common.model"
import { TTask } from "../../utils/models/task.model"
import { TUser } from "../../utils/models/user.model";


type TAPI = {
  isRequestingAPI?: boolean, // checking for API request
  response?: boolean, // response data from the request
  hasError?: TError // error from the request
};

export type TPage = 'recent' | 'today' | 'upcoming' | 'high-priority' | 'list' | 'complete' | 'archive';

export interface IState {
  id: string,
  currentPage: WritableSignal<string>,
  authentication: TAPI & {
    user: WritableSignal<TUser|undefined>,
    getUser: Signal<TUser|undefined>,
    error: WritableSignal<TError|undefined>,
    toString: () => any
  },
  task: TAPI & {
    list: WritableSignal<TTask[]>, // the data content of the list
    getList: Signal<TTask[]>,

    added: WritableSignal<TTask | null>, // new added task
    updated: WritableSignal<TTask | null>, // latest updated task
    viewed: WritableSignal<TTask | null>, // current viewed task
    deleted: WritableSignal<TTask | null>, // latest deleted task

    count: {
      allListComputed: Signal<number>,
      completeListComputed: Signal<number>,
      todoListComputed: Signal<number>,
      highPriorityListComputed: Signal<number>,
      inProgressListComputed: Signal<number>
    },

    toString: () => any
  },
  error?: TError // a global error data
  isServerDown: WritableSignal<boolean>
}
