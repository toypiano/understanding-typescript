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

[MDN: HTML Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)

[JSFiddle Demo](http://jsfiddle.net/radonirinamaminiaina/zfnj5rv4/)

- Element must have `draggable` attribute set to `true` in order to be draggable.
- On the dragging element,

  - handle the following events:
    - `dragstart`
      - set element id to the event by calling `setData('text/plain', id)` on `event.dataTransfer.`
      - specify allowed operation with `e.dataTransfer.effectAllowed = 'move'`
      ```ts
      @autobind
      handleDragStart(e: DragEvent) {
        // We can transfer id and fetch the actual project from the state
        e.dataTransfer!.setData('text/plain', this.project.id);
        // data being dragged will be moved (not copied | linked)
        e.dataTransfer!.effectAllowed = 'move';
      }
      ```
    - `dragend`
      - update something on the dragged item
      - e.g. change opacity back to 1

- On the target element,

  - handle the following events:
    - `dragover` (dragged item comes over to target)
      - call `preventDefault` to allow `drop` event
      - check if event contains `dataTransfer` which has the desirable data type in its `types` array.
      - If true, add css class to the target to give reaction to users
      ```ts
      if (e.dataTransfer && e.dataTransfer.types[0] === 'text/plain') {
        const listEl = this.element.querySelector('ul')!;
        listEl.classList.add('droppable');
      }
      ```
    - `drop`
      - change the status of the Dragged item
        - Element id retrieved from `e.dataTransfer!.getData('text/plain)`;
      - item status is stored in state instance
      - So we call a method on the state instance to update its state.
      ```ts
      const projectId = e.dataTransfer!.getData('text/plain');
      projectState.moveProject(
        projectId,
        this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Completed
      );
      ```
    - `dragleave`
      - remove css class
      ```ts
      handleDragLeave() {
        const listEl = this.element.querySelector('ul')!;
        listEl.classList.remove('droppable');
      }
      ```

## Bind & Handle

### TL;DR

- Bind your handlers. or...
- `this` inside handler? -> **bind me**.

### You have to bind your handleSomeEvent function

- If you define an event handler, that function is eventually going to get passed to the event listener.
- That event listener is attached to the `document` object.
- If you're naming your function as handle-something or something-handler, 99% of the time, that something is going to be an event fired from a DOM element.
- So without binding, `this` inside handler means `document`
- You use `this` inside handler because you want to access instance properties and methods.
- Therefore, If you have `this` inside an event handler, bind it with the owner instance.
