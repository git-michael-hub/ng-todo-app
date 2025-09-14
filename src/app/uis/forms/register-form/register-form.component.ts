import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, EventEmitter, input, Input, OnInit, Output, Signal, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { createPasswordMatchValidator } from '../../../utils/validators/confirm-password.validator';
import { TError } from '../../../utils/models/common.model';
import { IRegister } from '../../../utils/models/user.model';
import { nameLengthValidator } from '../../../utils/validators/name-length.validator';
import { emailValidator } from '../../../utils/validators/email.validator';
import { passwordValidator } from '../../../utils/validators/password.validator';

@Component({
  selector: 'ui-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
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
export class RegisterFormComponent implements OnInit {
  // @Input() error!: TError;
  error = input<Signal<TError>>();
  success = input<Signal<Boolean|null>>();
  @Output() registerUser = new EventEmitter<IRegister>();
  @Output() clearError = new EventEmitter<void>();
  @Output() clearUser = new EventEmitter<void>();


  form = new FormGroup({
    name: new FormControl('', [Validators.required, nameLengthValidator]),
    email: new FormControl('', [Validators.required, emailValidator]),
    password: new FormControl({ value: '', disabled: true }, [Validators.required, passwordValidator]),
    confirmPassword: new FormControl({ value: '', disabled: true }, Validators.required)
  });

  get formControl() { return this.form.controls; }
  get nameFormControl() { return this.form.controls['name']; }
  get emailFormControl() { return this.form.controls['email']; }
  get passwordFormControl() { return this.form.controls['password']; }
  get confirmPasswordFormControl() { return this.form.controls['confirmPassword']; }

  isRegistering = signal(false);
  psVisibility = signal(false);


  constructor() {
    this.form.valueChanges.subscribe((value) => {
      if (this.nameFormControl.valid && this.emailFormControl.valid) {
        // Prevent infinite loop by not emitting events
        this.passwordFormControl.enable({ emitEvent: false });
        // this.confirmPasswordFormControl.enable({ emitEvent: false });
        console.log('value1:', value);
      } else {
        // Prevent infinite loop by not emitting events
        this.passwordFormControl.setValue('', { emitEvent: false });
        this.passwordFormControl.disable({ emitEvent: false });
        // this.confirmPasswordFormControl.disable({ emitEvent: false });
        console.log('value2:', value);
      }

      if (this.passwordFormControl.valid) {
        this.confirmPasswordFormControl.enable({ emitEvent: false });
        // Add password match validation when confirmPassword is enabled
        this.confirmPasswordFormControl.setValidators([
          Validators.required,
          createPasswordMatchValidator(this.passwordFormControl.value || '')
        ]);
      } else {
        this.confirmPasswordFormControl.setValue('', { emitEvent: false });
        this.confirmPasswordFormControl.disable({ emitEvent: false });
        // Remove custom validation when disabled
        this.confirmPasswordFormControl.clearValidators();
      }

      // Update validation
      this.confirmPasswordFormControl.updateValueAndValidity({ emitEvent: false });


      // if (
      //     this.passwordFormControl.valid && this.confirmPasswordFormControl.valid
      //     && this.passwordFormControl.value !== this.confirmPasswordFormControl.value
      // ) {
      //   this.confirmPasswordFormControl.setErrors({
      //     notMatch: "Password not much."
      //   });

      // }
      // else {
      //   this.confirmPasswordFormControl.setErrors(null);
      // }

      // this.clearError.emit();
      // this.isRegistering.set(false);

      // console.log('confirmPasswordFormControl:',  this.confirmPasswordFormControl);
      // console.log('form:',  this.form);



      if (this.error()?.()) {
        this.clearError.emit();
        this.isRegistering.set(false);
      }


    });

    effect(() => {
      console.log('register:error:', this.error()?.());

      if (this.error()?.()) {
        // this.clearError.emit();
        // this.isLogging.set(false);
        this.form.enable({ emitEvent: false });
        this.passwordFormControl.disable({ emitEvent: false });
        this.confirmPasswordFormControl.disable({ emitEvent: false });
      }
    });



  }

  ngOnChanges(): void {
    console.log('   this.error();:',    this.error()?.());
    console.log('   this.success();:',    this.success()?.());
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.clearUser.emit();
    this.clearError.emit();
  }

  clearName(event: Event): void {
    // Prevent the button click from triggering form validation
    event.preventDefault();
    event.stopPropagation();

    // Clear name without triggering validation
    this.nameFormControl.setValue('', { emitEvent: false });

    this.passwordFormControl.setValue('', { emitEvent: false });
    this.passwordFormControl.disable({ emitEvent: false });

    this.confirmPasswordFormControl.setValue('', { emitEvent: false });
    this.confirmPasswordFormControl.disable({ emitEvent: false });
  }

  clearEmail(event: Event): void {
    // Prevent the button click from triggering form validation
    event.preventDefault();
    event.stopPropagation();

    // Clear email without triggering validation
    this.emailFormControl.setValue('', { emitEvent: false });

    this.passwordFormControl.setValue('', { emitEvent: false });
    this.passwordFormControl.disable({ emitEvent: false });

    this.confirmPasswordFormControl.setValue('', { emitEvent: false });
    this.confirmPasswordFormControl.disable({ emitEvent: false });
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

  register(): void {
    if (this.form.invalid) return;

    console.log(this.form.value);

    this.isRegistering.set(true);
    this.registerUser.emit(this.form.value as IRegister);

    this.form.disable();

  //   this._AUTH_SERVICE.login(this.form.value as TLogin);
  }

}
