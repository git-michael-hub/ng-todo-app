import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, input, OnInit, Output, Signal, EventEmitter, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthenticationService } from '../../../features/authentication/authentication.service';
import { ILogin } from '../../../utils/models/user.model';
import { TError } from '../../../utils/models/common.model';
import { MatIconModule } from '@angular/material/icon';
import { ShowHideDirective } from '../../../utils/directives/show-hide.directive';


@Component({
  selector: 'ui-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { hideRequiredMarker: true } }
  ],
  imports: [
    CommonModule,
    FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
  ]
})
export class LoginFormComponent implements OnInit {
  @Input() error!: TError;
  // error = input<TError>>();
  @Output() loginUser = new EventEmitter<ILogin>();
  @Output() clearError = new EventEmitter<void>();

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  });

  get formControl() { return this.form.controls; }
  get emailFormControl() { return this.form.controls['email']; }
  get passwordFormControl() { return this.form.controls['password']; }

  isLogging = signal(false);

  psVisibility = signal(false);

  constructor() {
    this.form.valueChanges.subscribe((value) => {
      console.log('form:value:', value);
      if (this.error) {
        this.clearError.emit();
        this.isLogging.set(false);
      }
    });
  }

  // ngOnChanges(): void {
  //   console.log('eRROR', this.error);
  // }

  clearEmail(event: Event): void {
    // Prevent the button click from triggering form validation
    event.preventDefault();
    event.stopPropagation();

    // Clear email without triggering validation
    this.emailFormControl.setValue('', { emitEvent: false });
  }

  togglePasswordVisibility(passwordInput: HTMLInputElement, event: Event): void {
    // Prevent the button click from triggering form validation
    event.preventDefault();
    event.stopPropagation();

    const newVisibility = !this.psVisibility();
    this.psVisibility.set(newVisibility);
    passwordInput.type = newVisibility ? 'text' : 'password';

    // Prevent form validation by temporarily disabling it
    const wasValid = this.form.valid;
    this.form.updateValueAndValidity({ onlySelf: true, emitEvent: false });

    // Restore the previous validation state
    if (wasValid !== this.form.valid) {
      this.form.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    }
  }


  ngOnInit() {
    console.log('error:', this.error);
  }

  login(): void {
    if (this.form.invalid) return;

    console.log(this.form.value);

    this.isLogging.set(true);
    this.loginUser.emit(this.form.value as ILogin);

  //   this._AUTH_SERVICE.login(this.form.value as TLogin);
  }

}
