# Next-generation Javascript & Typescript

## ES6 Arrow Functions in Typescript

- Pure arrow function: specify types for arguments

```ts
const add = (a: number = 0, b: number = 1) => a + b;
```

- Arrow function with no return: specify arg type + `void` return type

```ts
const printOutput: (o: number | string) => void = (output) =>
  console.log(output);
```

- Callback passed to event handlers
  - TS infers type of event automatically.

```ts
const button = document.querySelector('button');
// ? replaces If (button) { ... }
button?.addEventListener('click', (e) => console.log(e));
```

## ES6 Rest Params in Typescript

```ts
const add = (...numbers: number[]) => {
  return numbers.reduce((curr, val) => curr + val);
};
const addedNumbers = add(1, 2, 3, 4, 5);
console.log(addedNumbers);
```

## ES6 Destructuring in Typescript

Most of the time, you don't have to do anything because types were already assigned to the array elements || object properties before you destructure them.

```ts
const hobbies = ['sleep', 'eat'];
const [hobby1, hobby2, ...otherHobbies] = hobbies;
console.log(hobby1, hobby2, otherHobbies, hobbies);
// sleep eat [] ["sleep", "eat"]

const person = {
  name: 'Hayoun',
  age: 39,
};
// Copied destructured values into new personName variable because
// name variable already exist in the scope.
const { name: personName, age: personAge } = person;
```
