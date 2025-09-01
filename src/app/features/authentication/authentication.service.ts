import { inject, Injectable } from "@angular/core";
import { LoginComponent } from "./login/login.component";
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { AuthDialogComponent } from "../../uis/dialog/auth-dialog/auth-dialog.component";
import { AuthenticationAPI } from "../../data-access/apis/authentication.api";

// Third party
import * as _ from 'lodash';
import { ILogin, IRegister, TUser } from "../../utils/models/user.model";
import { MatSnackBar } from "@angular/material/snack-bar";
import { STORE_TOKEN } from "../../data-access/state/state.store";


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  // - di
  private readonly _DIALOG = inject(MatDialog);
  private readonly _AUTH_API = inject(AuthenticationAPI);
  private readonly _SNACK_BAR = inject(MatSnackBar);
  private readonly _STORE = inject(STORE_TOKEN);

  // - dialog
  private dialogRef!: MatDialogRef<AuthDialogComponent, any>;
  private DIALOG_SETTINGS: MatDialogConfig = {
    maxWidth: '60vw',
    width: '60vw',
    maxHeight: '80vh',
    height: '80vh',
    disableClose: true,
  };

  /**
   * - UI dialog
   */
  showLoginUI(): void {
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

          this._STORE().authentication.user.set(response as TUser);
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

          // this._STORE().authentication.user.set(response as TUser);
        },
        error: (error) => {
          console.error('Error register user:', error);

          this._STORE().authentication.error.set({
            ...error,
            error: {
              ...error.error,
              error: {
                message: "Registration failed!"
              }
            }
          });
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
