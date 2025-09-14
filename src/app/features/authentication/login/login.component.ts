import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, Signal, signal } from '@angular/core';

import {FormControl, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { LoginFormComponent } from '../../../uis/forms/login-form/login-form.component';
import { AuthenticationService } from '../authentication.service';
import { ILogin, TUser } from '../../../utils/models/user.model';
import { STORE_TOKEN } from '../../../data-access/state/state.store';
import { ShowHideDirective } from '../../../utils/directives/show-hide.directive';


@Component({
  selector: 'feature-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    LoginFormComponent,
    ShowHideDirective
  ]
})
export class LoginComponent implements OnInit {
  private readonly _AUTH_SERVICE = inject(AuthenticationService);
  private readonly _STORE = inject(STORE_TOKEN);

  loginError?: Signal<null>;
  // loginSuccess?: Signal<null|undefined|TUser>;

  constructor() {
    effect(() => {
      console.log('error', this._STORE().authentication.error())

      this.loginError = computed(() =>
        this._STORE().authentication.error()
      );

      // this.loginSuccess = computed(() =>
      //   this._STORE().authentication.user()
      // );

      console.log('LOLGIN:', this._STORE().authentication?.getToken());
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.clearError();
  }

  login(user: ILogin): void {
    this._AUTH_SERVICE.login(user);
  }

  clearError(): void {
    this._STORE().authentication.error.set(undefined);
  }

}
