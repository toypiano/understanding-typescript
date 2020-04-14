# Typescript Generics

- Generics helps you create reusable components.
- We can create generic interfaces, generic functions, and generic classes.
- Generic types takes type argument(s) inside angle brackets after the type name
  ```ts
  const names: Array<string> = ['Ethan', 'Elaine'];
  ```
- You can declare **type variable** inside angle brackets in order to capture the type(s) of input and use it to denote the return type dynamically.

```ts
function identity<T>(arg: T): T {
  return arg;
}
```

- Type variables are also referred to as "type parameters" or "generic parameters".

## Built-in Generics

Typescript offers many built-in generics that takes type argument(s) to provide more information about the generic type.

- `Array<elemType>`
  TS generic `Array` type requires the type of the array elements as type arguments.

```ts
let list: Array<number> = [1, 2, 3];
```

The above has the same effect as denoting the type of array elements followed by an empty array literal `[]`.

```ts
let list: number[] = [1, 2, 3];
```

- `Promise<resolvedType>`
  TS generic `Promise` type requires the type of the resolved value.

```ts
const promise: Promise<number> = new Promise((resolve, reject) => {
  setTimeout(() => resolve(777), 2000);
});

// data: number , err:any
promise.then((data) => data.toString()).catch((err) => console.log(err.length));
```

## Creating a Generic Function

By providing type variables to generic functions, TS can infer the type of the return value from the intersection of the given type variables.

`Non-generic function`

```ts
function merge(objA: object, objB: object) {
  // some processing...
  return Object.assign(objA, objB);
}
const mergedObj = merge({ name: 'Ethan', hobbies: 'Video game' }, { age: 6 });
// can't access name prop because TS only knows that it takes objects and returns object.
mergedObj.name🚨
```

`Generic function`

```ts
function merge<T, U>(objA: T, objB: U) {
  // some processing...
  return Object.assign(objA, objB);
}

// now TS understands that merge returns T & U
mergedObj.name;
```

Now the types for mergedObj is inferred by TS as:

```ts
const mergedObj: {
  name: string;
  hobbies: string;
} & {
  age: number;
};
```

### TS object intersection type vs union type

- `A & B` has all the types in A and B.
- `A | B` can have any types in A and B.
