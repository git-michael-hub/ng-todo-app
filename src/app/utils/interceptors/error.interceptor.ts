import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptorFn, HttpErrorResponse, HttpHandlerFn } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export function errorInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('HTTP Error:', error);

      // Custom error handling logic
      if (error.status === 401) {
        alert('Unauthorized! Please log in again.');
      } else if (error.status === 500) {
        alert('Internal server error occurred. Please try again later.');
      }

      return throwError(() => new Error(error.message || 'Something went wrong'));
    })
  );
}
