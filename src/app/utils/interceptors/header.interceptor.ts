import { HttpRequest, HttpEvent, HttpHandlerFn } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from '../../data-access/services/cookie-service';
import { inject } from '@angular/core';


export function headerInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {

  const authToken = inject(CookieService)?.readAuthToken(); // Get the token from local storage

  console.log('Interceptor:authToken:', authToken)

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
