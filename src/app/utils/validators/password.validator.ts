import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.value) {
    return null; // Let required validator handle empty values
  }

  const password = control.value.toString();

  // Check minimum length
  if (password.length < 8) {
    return { minLength: { requiredLength: 8, actualLength: password.length } };
  }

  // Check password complexity using regex
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

  if (!passwordRegex.test(password)) {
    return {
      passwordComplexity: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    };
  }

  return null;
};
