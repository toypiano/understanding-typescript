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

### Array Types

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

### Tuples(TS only)

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

### Enums(TS only)

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

### "Any" Type(TS only)

When you want TS to shut up.
(If you don't know the type)

### Union Types(TS only)

### Literal Types(TS only)

### Type Aliases

### Function Return Types and Void

### Function Types

### Function Types and Callbacks

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
