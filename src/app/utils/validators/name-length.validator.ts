import { AbstractControl, ValidationErrors } from "@angular/forms";

export const nameLengthValidator = (control: AbstractControl): ValidationErrors | null => {
  if (!control.value) {
    return null; // Let required validator handle empty values
  }

  const value = control.value.toString();

  if (value.length < 2) {
    return { minLength: { requiredLength: 2, actualLength: value.length } };
  }

  if (value.length > 100) {
    return { maxLength: { requiredLength: 100, actualLength: value.length } };
  }

  return null;
}
