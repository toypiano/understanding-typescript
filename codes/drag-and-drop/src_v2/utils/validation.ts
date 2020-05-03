export interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}
export function validate(...validatables: Validatable[]) {
  console.log('validate');
  return validatables.every((v) => validateOne(v));
}

function validateOne(o: Validatable) {
  if (o.required) {
    if (o.value.toString().trim().length === 0) return false;
  }
  if (o.minLength && typeof o.value === 'string') {
    if (o.value.length < o.minLength) return false;
  }
  if (o.maxLength && typeof o.value === 'string') {
    if (o.value.length > o.maxLength) return false;
  }
  if (o.min && typeof o.value === 'number') {
    if (o.value < o.min) return false;
  }
  if (o.max && typeof o.value === 'number') {
    if (o.value > o.max) return false;
  }
  return true;
}
