# Learn Typescript

## TypeScript Course for Beginners 2020

https://www.youtube.com/watch?v=BwuLxPH8IDs&t=8889s

## Typescript Types

### JS dynamic types vs TS static types

- TS supports only dev process, not the runtime.

### Numbers, Strings and Booleans

```ts
function add(n1: number, n2: number, showResult: boolean, phrase: string) { ...
```

### Type Assignment and Type Inference

- You can manually assign types with `let` (not `const`)

- Add `: SomeType` right after the variable name

```ts
let number1: number;
number1 = 5;
```

- Or you can let TS to inference type automatically

```ts
let resultPhrase = 'Result is: ';
// resultPhrase = 0; // ts yells error
```

### Object Types

- More specific, detailed types are possible.
- TS can also infer types for property values inside an object.

```ts
const person = {
  name: 'Hayoun Lee',
  age: 39,
};
/*  
// Explicit type assignment
const person: {
  name: string;
  age: number;
} = {
  name: 'Hayoun Lee',
  age: 39,
};
*/
```

### Array Types (JS Core)

- Element Type can be flexible or strict
- TS automatically infers the type(s) of the elements inside an array.
- If you want to enforce specific type into the members of the array, you can:

```ts
let favoriteActivities: string[];
favoriteActivities = ['Sleeping' /*, 1 ts yells at this*/];
```

- With TS's type inference, you also get an autocomplete for the method/property of iteration variable:

```ts
for (const hobby of person.hobbies) {
  // TS automatically infers the type of hobby from hobbies array
  console.log(hobby.toUpperCase());
  /* console.log(hobby.pop()) // ts yells at this */
}
```

### Tuples

- Fixed-length array.
- Can specify types at each position
- You MUST explicitly assign type specifying all columns in tuple

```ts
const person: {
  name: string;
  age: number;
  hobbies: string[];
  role: [number, string]; // TS tuple type
} = {
  name: 'Hayoun Lee',
  age: 39,
  hobbies: ['Reading manga', 'Watching standup comedies'],
  role: [3, 'husband'],
};
```

### Enums

Global constant identifiers which maps numbered index(key) into human-readable label(value).

```ts
enum Role {
  HUSBAND = 3, // we can add default index to labels
  FATHER, // ts automatically assigns the index of 4
  SELF = 97,
}
```

is transpiled to:

```js
var Role;
(function (Role) {
  Role[(Role['HUSBAND'] = 3)] = 'HUSBAND'; // Role[3] = "HUSBAND";
  Role[(Role['FATHER'] = 4)] = 'FATHER';
  Role[(Role['SELF'] = 97)] = 'SELF';
})(Role || (Role = {}));
```

Now Intellisense shows those labels after `Role.` even though those labels are stored as values, not keys
(This will work great with action-types in redux)

### "Any" Type

When you want TS to shut up.
(If you don't know the type)

### Union Types

This type OR that type

```ts
function combine(input1: number | string, input2: number | string) { ...
```

### Literal Types

Specify primitive value as individual type.  
Usually used with union types.

```ts
function combine(
  input1: number | string,
  input2: number | string,
  resultConversion: 'as-number' | 'as-string' // union of literal type
) { ...
```

### Type Aliases

You can create a custom type alias with `type` statement.  
(like a CSS variable)

```ts
type Combinable = number | string;
type ConversionOption = 'as-number' | 'as-string'; // union of literal type

function combine(
  input1: Combinable,
  input2: Combinable,
  resultConversion: ConversionOption
) {
```

### Function Return Types and Void

Functions that doesn't return any value are assigned `void` type implicitly by TS.

```ts
// you don't need to specify 'void' type here
function printResult(num: number): void {
  console.log('Result: ' + num);
}
```

### Function Types

You can assign `Function` type to the variables pointing at functions.

```ts
let addFunction: Function;
addFunction = 1 + 1; // Type 'number' is not assignable to type 'Function'
addFunction = (a: number, b: number) => a + b; // this is fine
```

But this can't prevent it from being assigned to a wrong function.

```ts
addFunction = (name: string) => `Hello, ${name}!`; // as long as it's a function...
```

You can specify the argument types and the return type of the function using fat arrow like:

```ts
let addFunction: (num1: number, num2: number) => number;
addFunction = (name: string) => `Hello, ${name}!`; // now you'll get a lot of complaints
```

### Function Types and Callbacks

You can also assign types to the callback arguments and return value.
If you assign `void` to the callback return, TS will not say anything until you actually "use" that value inside the function.

```ts
function addAndHandle(n1: number, n2: number, cb: (num: number) => void) {
  const result = n1 + n2;
  const returnValue = cb(result); // this is fine as long as you don't USE the return value
  console.log(returnValue); // this is ok (just logging, not doing any computation...)

  const isReturnValueTrue = returnValue === true; // now TS is mad at you.
  /* This condition will always return 'false' since 
  the types 'void' and 'boolean' have no overlap.ts(2367) */
}

addAndHandle(10, 20, (sum) => {
  console.log(sum);
  return true; // ts not saying anything here...
});
```

### The Unknown Type

### The Never Type

## Typescript Configuration

### Watch Node

### Compiling the Entire Project

### Include and Exclude Files

### Setting a Complication Target

### Understanding TypeScript Libs

### More Options

### Source Maps

### Rootdir and Outdir

### noemit on Error

### Strict Compilation Options

### Code Quality Options

### Debugging with VSCode
