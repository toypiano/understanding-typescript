/* Validation */
export interface Validatable {
  value: string | number;
  // validators are optional
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(input: Validatable) {
  let isValid = true;
  if (input.required) {
    // only string has trim and length
    isValid = isValid && input.value.toString().trim().length !== 0;
  }
  // validator check + type-guarding!
  // if minLength === 0, it becomes falsy even though it means the constraint of zero min-length.
  //
  if (input.minLength != null && typeof input.value === 'string') {
    isValid = isValid && input.value.length >= input.minLength;
  }
  if (input.maxLength != null && typeof input.value === 'string') {
    isValid = isValid && input.value.length <= input.maxLength;
  }
  if (input.min != null && typeof input.value === 'number') {
    isValid = isValid && input.value >= input.min;
  }
  if (input.max != null && typeof input.value === 'number') {
    isValid = isValid && input.value <= input.max;
  }
  return isValid;
}

export function validateAll(...inputs: Validatable[]) {
  return inputs.every((v) => validate(v));
}
