# Typescript Project: Drag & Drop

## `Element.insertAdjacentElement(position, element)`

Insert element inside or outside another element. Useful & flexible.

```ts
private attach() {
    // beforebegin = before(elm)
    // afterbegin = prepend(elm)
    // beforeend = appendChild(elm)
    // afterend = after(elm)
    this.app.insertAdjacentElement('afterbegin', this.formElement);
  }
```

## Checking the existence of falsy values

In JS, 0, null, and undefined are all converted to false.
When you're checking the existence of numeric value, you need to prevent 0 from converting into `false`.

```ts
// if minLength is set to 0, it will be converted to false
if (input.minLength && typeof input.value === 'string') {
  isValid = isValid && input.value.length >= input.minLength;
}
```

You can instead check if minLength is not `null`.

```ts
// now 0 passes with other numbers
if (input.minLength != null && typeof input.value === 'string') {
  isValid = isValid && input.value.length >= input.minLength;
}
```

## Typescript null checking

### Falsy values in TS and JS

```ts
if (value) {
  /*
  this will run is value is not:
    - null
    - undefined
    - NaN
    - '' (empty string)
    - 0
    - false
  /*
}
```

### Checking for `null` with strict | non-strict equality

```ts
if (value != null) {
  // runs if value is neither null nor undefined
}

if (value !== null) {
  // will run if value is undefined
}

if (value == null) {
  // runs if value is null OR undefined
}

if (value === null) {
  // will run only if value is explicitly defined as null
  // (won't run if value is undefined)
}
```

## Implementing drag-and-drop

- Element must have `draggable` attribute set to `true` in order to be draggable.
- On the dragging element, handle the following events:

  - `dragstart`
  - `dragend`

- On the target element, handle the following events:
  - `dragover`
  - `drop`
  - `dragleave`
