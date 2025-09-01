import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

// Create a validator function that checks against current password value
export const createPasswordMatchValidator = (password: string): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Let required validator handle empty values
    }

    if (password !== control.value) {
      return { passwordMismatch: true };
    }

    return null;
  };
}
