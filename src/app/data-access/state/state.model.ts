import { Signal, WritableSignal } from "@angular/core";
import { TError } from "../../utils/models/common.model"
import { TTask } from "../../utils/models/task.model"

type TAPI = {
  isRequestingAPI?: boolean, // checking for API request
  response?: boolean, // response data from the request
  hasError?: TError // error from the request
};

export interface IState {
  id: string,
  authentication?: TAPI & {
    status: 'login' | 'logout'
  },
  task: TAPI & {
    list: WritableSignal<TTask[]>, // the data content of the list
    sort: {
      status: WritableSignal<'asc' | 'desc'>,
      listComputed: Signal<TTask[]>
    },
    filter: {
      status: WritableSignal<'today' | 'upcoming' | 'high-priority' | 'complete' | 'archive' >,
      listComputed: Signal<TTask[]>
    },
    count: {
      status: WritableSignal<'all' | 'complete' | 'todo' | 'high-priority'>,
      listComputed: Signal<number>
    }
  },
  error?: TError // a global error data
}
