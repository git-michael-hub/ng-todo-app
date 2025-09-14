import { HttpRequest, HttpEvent, HttpHandlerFn } from '@angular/common/http';
import { Observable } from 'rxjs';


export function headerInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
  const authToken = localStorage.getItem('authToken'); // Get the token from local storage

  // Clone the request and add the Authorization header
  const modifiedReq = req.clone({
    setHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken || undefined}`
    },
  });

  // Pass the modified request to the next handler
  return next(modifiedReq);
}
