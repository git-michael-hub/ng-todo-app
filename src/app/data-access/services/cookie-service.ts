import { inject, Injectable } from "@angular/core";
import { CookieService as NgxCookieService} from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class CookieService {
  private readonly COOKIE = inject(NgxCookieService);

  removeAll(): void {
    this.deleteAuthToken();
    this.deleteName();
    this.deleteEmail();
  }

  /**
   * Token
   */
  saveAuthToken(authToken: string) {
    this.COOKIE.set('authToken', authToken, { expires: 1, path: '/' });
  }
  readAuthToken(): string {
    return this.COOKIE.get('authToken')
  }
  deleteAuthToken(): void {
    this.COOKIE.delete('authToken', '/');
  }

  /**
   * Name
   */
  saveName(name: string) {
    this.COOKIE.set('name', name, { expires: 1, path: '/' });
  }
  readName(): string {
    return this.COOKIE.get('name')
  }
  deleteName(): void {
    this.COOKIE.delete('name', '/');
  }

  /**
   * Email
   */
  saveEmail(email: string) {
    this.COOKIE.set('email', email, { expires: 1, path: '/' });
  }
  readEmail(): string {
    return this.COOKIE.get('email')
  }
  deleteEmail(): void {
    this.COOKIE.delete('email', '/');
  }





}
