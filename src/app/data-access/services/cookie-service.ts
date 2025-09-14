import { inject, Injectable } from "@angular/core";
import { CookieService as NgxCookieService} from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class CookieService {
  private readonly COOKIE = inject(NgxCookieService);

  saveAuthToken(authToken: string) {
    this.COOKIE.set('authToken', authToken, { expires: 1, path: '/' });
  }

  readAuthToken(): string {
    return this.COOKIE.get('authToken')
  }

  deleteAuthToken() {
    this.COOKIE.delete('authToken', '/');
  }


}
