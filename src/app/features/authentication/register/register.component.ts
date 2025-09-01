import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { STORE_TOKEN } from '../../../data-access/state/state.store';
import { RegisterFormComponent } from '../../../uis/forms/register-form/register-form.component';
import { IRegister } from '../../../utils/models/user.model';
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
  private readonly _AUTH_SERVICE = inject(AuthenticationService);
  private readonly _STORE = inject(STORE_TOKEN);

  registerError = signal('');

  constructor() {
    effect(() => {
      console.log('error', this._STORE().authentication.error())

      this.registerError.set(
        this._STORE().authentication.error()
      );
    });
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

}
