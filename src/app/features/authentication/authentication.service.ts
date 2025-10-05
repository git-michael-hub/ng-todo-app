import { effect, inject, Injectable } from "@angular/core";
import { LoginComponent } from "./login/login.component";
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { AuthDialogComponent } from "../../uis/dialog/auth-dialog/auth-dialog.component";
import { AuthenticationAPI } from "../../data-access/apis/authentication.api";

// Third party
import * as _ from 'lodash';
import { ILogin, IRegister, IAuth, TUser } from "../../utils/models/user.model";
import { MatSnackBar } from "@angular/material/snack-bar";
import { STORE_TOKEN } from "../../data-access/state/state.store";
import { CookieService } from "../../data-access/services/cookie-service";
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TaskService } from "../task/task.service";
import { filter } from "rxjs";
// import { setAuthToken } from "../../data-access/services/local-storage.service";


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly _HOST = 'AuthenticationService';

  // - di
  private readonly _DIALOG = inject(MatDialog);
  private readonly _AUTH_API = inject(AuthenticationAPI);
  private readonly _SNACK_BAR = inject(MatSnackBar);
  private readonly _STORE = inject(STORE_TOKEN);
  private readonly _COOKIE = inject(CookieService)
  private readonly _TASK_SERVICE = inject(TaskService);

  // - dialog
  private dialogRef!: MatDialogRef<AuthDialogComponent, any>;
  private DIALOG_SETTINGS: MatDialogConfig = {
    maxWidth: '60vw',
    width: '60vw',
    maxHeight: '80vh',
    height: '80vh',
    disableClose: true,
  };

  private _ROUTER = inject(Router);
  // private _ROUTER_ACTIVATED = inject(ActivatedRoute);
  readonly SOURCE_PAGE: any = this._ROUTER;


  constructor() {
    this._ROUTER.events
    .pipe(filter((event) => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
      const currentUrl = event.urlAfterRedirects.split('/')[1]; // Or event.url for the raw URL
      console.log('Navigation ended, current URL:', currentUrl);

       if (currentUrl !== 'verify-email') this.checkToken();
    });

    effect(() => {
      console.log('STORE:AuthenticationService:', this._STORE().authentication.auth());

      const auth = this._STORE().authentication.auth() as IAuth;

      if (auth?.token && auth?.status === 'login') {
        this.dialogRef?.close();
      }

      if (auth?.isVerifyEmail && auth?.status === 'verify-email') {
        this._ROUTER.navigate(['/home']);
        setTimeout(() => {
          this.showLoginUI();
        }, 500);
      }
    });
  }

  /**
   * - UI dialog
   */
  showLoginUI(): void {
    this._STORE().authentication.auth.set({ source: this._HOST + 'showLoginUI'});
    this.dialogRef?.close();

    this.dialogRef = this._DIALOG.open(
      AuthDialogComponent,
      { ...this.DIALOG_SETTINGS, data: 'login' }
    );

    this.dialogRef.afterClosed().subscribe({
      next: (result) => {
        console.log(`Dialog result: ${result}`);
      },
      error: (error) => {
        console.error('Error in dialog:', error);
      }
    });
  }

  showRegisterUI(): void {
    this._STORE().authentication.auth.set({ source: this._HOST + 'showRegisterUI'});
    this.dialogRef?.close();

    this.dialogRef = this._DIALOG.open(
      AuthDialogComponent,
      { ...this.DIALOG_SETTINGS, data: 'register' }
    );

    this.dialogRef.afterClosed().subscribe({
      next: (result) => {
        console.log(`Dialog result: ${result}`);
      },
      error: (error) => {
        console.error('Error in dialog:', error);
      }
    });
  }

  login(user: ILogin): void {
    if (_.isEmpty(user)) return;

    this._AUTH_API.loginUser(user)
      .subscribe({
        next: (response) => {
          console.log('User successfully login:', response);

          const {token, user} = response as IAuth;

          this._STORE().authentication.auth.set(
            {
              user: {
                name: user?.name,
                email: user?.email
              } as TUser,
              token,
              status: 'login',
              source: this._HOST + 'login'
            }
          );

          this._COOKIE.saveAuthToken((response as IAuth)?.token as string);
          this._COOKIE.saveName((response as IAuth)?.user?.name as string);
          this._COOKIE.saveEmail((response as IAuth)?.user?.email as string);
        },
        error: (error) => {
          console.error('Error login user:', error);

          this._STORE().authentication.error.set(error);

          // this.notify(
          //   `
          //     Error login: ${user?.email.slice(0, 20)}
          //   `
          // );
        }
      });
  }

  register(user: IRegister): void {
    if (_.isEmpty(user)) return;

    this._AUTH_API.registerUser(user)
      .subscribe({
        next: (response) => {
          console.log('User successfully register:', response);

          this._STORE().authentication.auth.set(
            {
              user: response as unknown as TUser,
              status: 'register',
              source: this._HOST + 'register'
            }
          );

          this._COOKIE.saveName((response as TUser)?.name as string);
          this._COOKIE.saveEmail((response as TUser)?.email as string);

          console.log('register:',  this._STORE().authentication.auth());
        },
        error: (error) => {
          console.error('Error register user:', error);

          this._STORE().authentication.error.set({
            ...error,
            error: {
              ...error.error,
              error: {
                message: "Registration failed! Please contact support."
              }
            }
          });

        }
      });
  }

  verifyEmail(token: string): void {
    if (_.isEmpty(token)) return;

    this._AUTH_API.verifyEmail(token)
      .subscribe({
        next: (response) => {
          console.log('Token response:', response);

          this._STORE().authentication.auth.set(
            {
              user: {
                name: this._COOKIE.readName(), // TODO: what if other user has the cookie?
                email: this._COOKIE.readEmail(), // TODO: what if other user has the cookie?
              } as TUser,
              token: undefined,
              isVerifyEmail: true,
              status: 'verify-email',
              source: this._HOST + 'verifyEmail'
            }
          );
        },
        error: (error) => {
          console.error('Error register user:', error);

          this._STORE().authentication.auth.set(
            {
              user: undefined,
              token: undefined,
              isVerifyEmail: false,
              status: undefined,
              source: this._HOST + 'verifyEmail'
            }
          );

          this._STORE().authentication.error.set({
            ...error,
            error: error?.error
          });

        }
      });
  }

  checkToken(): void {
    this._AUTH_API.checkToken()
      .subscribe({
        next: (response) => {
          console.log('Check Token response:', response);

          this._STORE().authentication.auth.set(
            {
              user: {
                name: this._COOKIE.readName(),
                email: this._COOKIE.readEmail(),
              } as TUser,
              token: this._COOKIE.readAuthToken(),
              status: 'login',
              source: this._HOST + 'checkToken'
            }
          );

        },
        error: (error) => {
          console.error('Error check token:', error);

          this._STORE().authentication.auth.set(
            {
              user: {
                name: this._COOKIE.readName(),
                email: this._COOKIE.readEmail(),
              } as TUser,
              token: undefined,
              status: undefined,
              source: this._HOST + 'checkToken'
            }
          );

          this._STORE().authentication.error.set({
            ...error,
            error: error?.error
          });

          this._COOKIE.deleteAuthToken();

          setTimeout(() => {
            this._TASK_SERVICE.getTasks();
          }, 500);
        }
      });
  }

  logout(): void {
    this._AUTH_API.logoutUser()
      .subscribe({
        next: (response) => {
          console.log('User successfully logout:', response);

          this._STORE().authentication.auth.set(undefined);
          this._STORE().authentication.error.set(undefined);

          this._COOKIE.removeAll();
        },
        error: (error) => {
          console.error('Error logout user:', error);

          this._STORE().authentication.error.set(error);

          // this.notify(
          //   `
          //     Error login: ${user?.email.slice(0, 20)}
          //   `
          // );
        }
      });
  }


  // - notification
  notify(title: string, ): void {
    this.dialogRef?.close();

    this._SNACK_BAR.open(
      title,
      'close',
      {
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
        duration: 5000
      }
    );
  }

}
