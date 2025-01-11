import { HttpEvent, HttpEventType, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { Observable, tap } from "rxjs";

export function loggingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  console.log('[API]:',req.url);

  return next(req).pipe(tap(event => {
    if (event.type === HttpEventType.Response) {
      console.log('[API]:', req.url, 'returned a response with status', event.status);
    }
  }));
}
