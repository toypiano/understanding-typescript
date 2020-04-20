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
