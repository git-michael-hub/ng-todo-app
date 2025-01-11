import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, retry } from 'rxjs';

export function retryInterceptor(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  return next.handle(req).pipe(
    retry(3) // Retry failed requests up to 3 times
  );
}
