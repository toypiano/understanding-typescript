# Typescript Generics

- Generics help you create reusable components.
- We can create generic interfaces, generic functions, and generic classes.
- Generics allow us to pass more information about the type so that we can work better with the typed variable.
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

```ts
const data = extractData<string>(user, 'userId');
// extractData() probably returns different data based o the argument you provide.
```

- Type variables are also referred to as "type parameters" or "generic parameters".

## Built-in Generics

Typescript offers many built-in generics that take type argument(s) to provide more information about the generic type.

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

## Working with Constraints

Sometimes we need to ensure that our type variables can only take certain types.
We can set certain constraints on the generic types by using `extends` keyword right after the type variable declaration.

```ts
// No constraints set on type variables T and U
function merge<T, U>(objA: T, objB: U) {
  // some processing...
  return Object.assign(objA, objB);
}
// Here, merging 6 into object fails silently (no ts warnings)
const mergedObj = merge({ name: 'Ethan', hobbies: 'Video game' }, 6);
```

```ts
// setting constraints on type variables with 'extends' keyword
function merge<T extends object, U extends object>(objA: T, objB: U) {
  // some processing...
  return Object.assign(objA, objB);
}
// now it has to be an object.
const mergedObj = merge({ name: 'Ethan', hobbies: 'Video game' }, { age: 6 });
```

## Generic Function Example

By constraining type variable, you can create a generic function that can work with any type of data as long as that data contains certain properties / methods. (Polymorphism!)

This is great because we don't have to create multiple overloads or union types with many sub-types every time we decide to make the function work with new type (hard-coding approach -> less re-usable).

```ts
interface Lengthy {
  length: number;
}

function countAndDescribe<T extends Lengthy>(element: T): [T, string] {
  let descriptionText = 'Have no value.';
  if (element.length === 1) {
    descriptionText = 'Have 1 element.';
  } else if (element.length > 1) {
    descriptionText = `Have ${element.length} elements.`;
  }
  return [element, descriptionText];
}

// works with a string
console.log(countAndDescribe('Hello there'));
// ["Hello there", "Have 11 elements."]

// works with an array
console.log(countAndDescribe(['Hello', 'there']));
// [Array(2), "Have 2 elements."]

// number has no property,'length'
console.log(countAndDescribe(5🚨));
// Argument of type '5' is not assignable to parameter of type 'Lengthy'.ts(2345)

```

## The "keyof" Constrain

In JS, APIs often need the name of the property to access the property value or method inside an object.  
An indexed type query `keyof T` yields the type of permitted property names for T.  
A `keyof T` type is considered a subtype of `string`.

```ts
interface Person {
  name: string;
  age: number;
  location: string;
}

type K1 = keyof Person; // "name" | "age" | "location"
type K2 = keyof Person[]; // "length" | "push" | "pop" | "concat" | ...
type K3 = keyof { [x: string]: Person }; // string
```

```ts
function extractAndConvert<T extends object, U>(obj: T, key: U) {
  return obj[key]🚨; // we don't know if obj will have [key] prop
  // Type 'U' cannot be used to index type 'T'.ts(2536)
}
```

```ts

// U extends the union type of T's keys (string literal type)
function extractAndConvert<T extends object, U extends keyof T >(obj: T, key: U) {
  return obj[key]; // we don't know if obj will have 'key' prop
}

// 'age' key is not found in the object
console.log(extractAndConvert({name: 'Hayoun'}, 'age'🚨));
// Argument of type '"age"' is not assignable to parameter of type '"name"'.ts(2345)
```

## Generic Classes

You can also apply constraints to generic classes and make it work with any type as long as it matches the given constraints.

> Generic Classes are a way to say that a particular type depends on another type.

```ts
// only works with primitive types
class DataStorage<T extends string | number | boolean> {
  // 'Storage' is a reserved name
  private data: T[] = [];

  addItem(item: T) {
    //  need to assign type for arg 'item'
    this.data.push(item);
  }

  removeItem(item: T) {
    // indexOf returns -1 if item is not found.
    // Consequently, the last item([-1]) in the array is removed
    this.data.splice(this.data.indexOf(item), 1);
  }

  getItems() {
    return [...this.data];
  }
}

const textStorage = new DataStorage<string>();
textStorage.addItem('Ethan');
textStorage.addItem('Elaine');
textStorage.removeItem('Elaine');
console.log(textStorage.getItems());

const numberStorage = new DataStorage<number>();

const objStorage = new DataStorage<object>();
objStorage.addItem({ name: 'Shobe' });
objStorage.addItem({ name: 'Ggrube' });

// Without constraints, we would have a problem here
// because 'removeItem' can't find this newly created object
// and TS will not say anything about this because
// removeItem will fallback to default on fail
objStorage.removeItem({ name: 'Shobe' });
```

## A First Summary

Generic types provide:

- flexibility with type variable
- type safety with constraints

## Generic Utility Types

TS offers some built-in "utility" generic types.

### `Readonly` type

Wraps around the type argument and make it read-only.

```ts
const names: Readonly<string[]> = ['Ethan', 'Elaine'];
names.push🚨('Na Youn'); // cannot modify Readonly type
```

### `Partial` type

Partial type wraps around the type argument and make all sub-types optional.
Useful when you don't want to set all the sub-types upfront, but populate them as you go.
Don't forget to typecast back to original type after you're done.

```ts
interface CourseGoal {
  title: string;
  description: string;
  completeUntil: Date;
}

function createCourseGoal(
  title: string,
  description: string,
  date: Date
): CourseGoal {
  let courseGoal: Partial<CourseGoal> = {}; // now we can init with empty obj
  courseGoal.title = title; // and create props as we go.
  courseGoal.description = description;
  courseGoal.completeUntil = date;
  // convert back to CourseGoal from Partial after adding all the props
  return courseGoal as CourseGoal;
}
```

[Full list of TS utility types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

## Generic Types vs Union Types

### Union Types

Can be great if the method is not related to outside object AND you want to take many types as input.

```ts
class DataStorage {
  private data: string[] | number[] | boolean[] = [];

  // we don't know what type of element data should contain
  // at the time of calling this method which can take any of these types.
  // e.g. We could call addItem passing "World" but data could be a number array at that time.
  addItem(item: string | number | boolean) {
    this.data.push(item🚨);
  }

  removeItem(item: string | number | boolean) {
    this.data.splice(this.data.indexOf(item🚨), 1);
  }

  getItems() {
    return [...this.data];
  }
}
```

### Generic Types

Is great when:

- you want to have methods that work with outside object
- you want to pass around data across class methods without worrying about type safety
- you want to enforce certain type throughout entire class instances you create.

```ts
class DataStorage<T extends string | number | boolean> {
  private data: T[] = [];

  addItem(item: T) {
    this.data.push(item);
  }

  removeItem(item: T) {
    this.data.splice(this.data.indexOf(item), 1);
  }

  getItems() {
    return [...this.data];
  }
}
```
