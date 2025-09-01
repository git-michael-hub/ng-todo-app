import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ILogin, IRegister, TUser } from "../../utils/models/user.model";
import { Observable } from "rxjs";
import { TErrorMessage } from "../../utils/models/common.model";

@Injectable({
  providedIn: 'root',
})
export class AuthenticationAPI {
  private apiUrl = ' http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  loginUser<T extends TUser|TErrorMessage>(user: ILogin): Observable<T> {
    return this.http.post<T>(this.apiUrl+'/login', user);
  }

  registerUser<T extends TUser|TErrorMessage>(user: IRegister): Observable<T> {
    return this.http.post<T>(this.apiUrl+'/register', user);
  }

  addUser<T extends TUser>(user: T): Observable<T> {
    return this.http.post<T>(this.apiUrl, user);
  }
}
