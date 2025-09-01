import { HttpErrorResponse } from "@angular/common/http";

export type TError = unknown | string | undefined | Partial<HttpErrorResponse> | null | any;
export type TErrorMessage = {
  message: string
}

export type TMethodHTTP = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type TAPI = {
  isRequesting?: boolean, // if API is requesting or not
  isFetched: boolean, // if API successfully received the response data
  reponse?: unknown, // the response data from request
  error?: TError // error from request
}
