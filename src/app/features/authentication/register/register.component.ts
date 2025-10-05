import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, Signal, signal } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { STORE_TOKEN } from '../../../data-access/state/state.store';
import { RegisterFormComponent } from '../../../uis/forms/register-form/register-form.component';
import { IRegister, TUser } from '../../../utils/models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'feature-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RegisterFormComponent
  ]
})
export class RegisterComponent implements OnInit {
  private readonly _HOST = 'RegisterComponent';

  private readonly _AUTH_SERVICE = inject(AuthenticationService);
  private readonly _STORE = inject(STORE_TOKEN);

  registerError: Signal<null>;
  registerUser?: Signal<TUser | undefined>;

  constructor() {
    effect(() => {
      this.registerUser = this._STORE().authentication.getUser;

    });

      // Use computed to derive values instead of manually setting signals
    this.registerError = computed(() =>
      this._STORE().authentication.error()
    );


  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.clearError();
  }



  register(user: IRegister): void {
    this._AUTH_SERVICE.register(user);
  }

  clearError(): void {
    this._STORE().authentication.error.set(undefined);
  }

  clearUser(): void {
    this._STORE().authentication.auth.set({ source: this._HOST + 'clearUser' });
  }

}
