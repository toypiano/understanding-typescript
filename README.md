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

If you are not sure what type of value a variable will be pointing at, you can assign `unknown` type.  
"Unknown" type cannot be acknowledged as any other type until it is type-checked manually (i.e. inside if statement).
Consider `unknown` type whenever you feel like you need to use `any` type. (which will make the variable invisible to ts).

```ts
let userInput: unknown; // we don't know yet.
let userName: string;

userInput = 5;
userInput = 'Hey!'; // still unknown type (can change anytime)
// userName = userInput; // Error! unknown is not guaranteed to be string.

if (typeof userInput === 'string') {
  userName = userInput; // TS detects manual type-checking and let it pass.
}

let anyInput: any;
anyInput = 1980;
userName = anyInput; // any type is like a JOKER. It can be "any" type.
```

### The Never Type

The `never` type represents the type of values that never occur. (throw | infinite loop)

```ts
// Function returning never must have unreachable end point!
function generateError(message: string, code: number): never {
  throw { message: message, errorCode: code };
}

let error: string;
error = generateError('Not Found', 404); // this is fine
console.log(error); // this is also fine
let never: never;
never = anyInput; // No types including "any" aren't assignable to never
```

## Typescript Configuration

### Watch Mode

Don't quit watch mode before saving your .ts file.

```bash
tsc app.ts --watch
```

But with this approach, we still need to target only one specific file.

### Compiling the Entire Project

```bash
tsc --init # creates tsconfig.json file
tsc # compile all ts files in this folder
tsc -w # watches all ts files
```

### Include and Exclude Files

You can include/ exclude certain files or folders by specifying `exclude` and `include` field in `tsconfig.json`.

```js
{
  "exclude": [
    "node_modules" /* Default only if you don't add exclude field.  */,
    "demo/" /* exclude all files inside demo folder */,
    "*.dev.ts" /* exclude any files ending with .dev.ts from the root folder */,
    "**/*.dev.ts" /* exclude above from any folder  */
  ],
  "include": ["src/" /* Only include this path - ones in exclude */]
}
```

You can also target specific files, for example when you're working with smaller projects.

```js
{
  "files": ["app.ts"]
}
```

Above setting works as include - exclude.

### Setting a Compilation Target

You can hit `ctrl+space` at the empty string value to see available options.

```js
{
  "compilerOptions": {
    "target": "es6" // es6 supports let, const, =>, ..., promise,...
  }
}
```

### Understanding TypeScript Libs

If you want TS to only support APIs from certain library, you specify that in:
(But in general, you don't have to touch the defaults...)

```js
{
  "compilerOptions": {
    "lib": [
      "dom", // document, console, ...
      "es6",
      "dom.iterable",
      "scripthost"
    ]
  }
}
```

### More Options

```js
{
  "allowJs": true /* Allow javascript files to be compiled. */,
  "checkJs": true /* Report errors in .js files. */,
  "jsx": "preserve" /* Specify JSX code generation: 'preserve', 'react-native', or 'react'. */,
  "declaration": true /* Generates corresponding '.d.ts' file. When you are writing library*/,
  "declarationMap": true /* Generates a sourcemap for each corresponding '.d.ts' file. */
}
```

### Source Maps

If `"sourceMap"` option is set to `true`, TS creates ~.js.map file which browsers can parse as .ts file, and we can access those files in Source tab in browser dev-tool for debugging.  
This is really convenient because we can work directly in the source file instead of the compiled version.

### Rootdir and Outdir

You can set output directory(usually `dist/`) into which TS compiles .ts files.  
Any folder structure inside source directory will be duplicated inside output folder(nice!).

`rootDir` option specifies the directory of the source folder which works similar to `include` field, but `rootDir` also preserves folder structure inside source folder, while `include` does not.
(If you want to place all .ts files into some folder without sub-folders, use `include` option)

### noemit on Error

`"noEmit": true`

- Just check the file for errors but don't compile them plz.

`"noEmitOnError": true`

- Don't compile .ts files if they contain any errors!
- This is "fail early" approach.

### Strict Compilation Options

`strict` option toggles all the related options at once.

```js
{
  "strict": true /* Enable all strict type-checking options. */,
  "noImplicitAny": true /* Yell if type is not assigned properly. You use ts for this. */,
  "strictNullChecks": true /* TS can't see dom to check if this will not return null! (e.g. document.querySelector('.header')!; */,
  "strictFunctionTypes": true /* Enable strict checking of function types. for classes */,
  "strictBindCallApply": true /* Enable strict 'bind', 'call', and 'apply' methods on functions. */,
  "strictPropertyInitialization": true /* Enable strict checking of property initialization in classes. */,
  "noImplicitThis": true /* Raise error on 'this' expressions with an implied 'any' type. */,
  "alwaysStrict": true /* Parse in strict mode and emit "use strict" for each source file. */
}
```

You can add `!` at the end of expression to dodge `strictNullChecks`. But proper way would be using if checks to ensure return value exists.

```ts
const newItem = document.querySelector('.new-item'); // add ! if you feel lazy.
if (newItem) {
  newItem.addEventListener('click', handleNewItemClicked);
}
```

### Code Quality Options

```js
{
  "noUnusedLocals": true /* Report errors on unused locals. */,
  "noUnusedParameters": true /* Report errors on unused parameters. */,
  "noImplicitReturns": true /* Report error when not all code paths in function return a value. */,
  "noFallthroughCasesInSwitch": true /* Report errors for fallthrough cases in switch statement. */
}
```

### Debugging with VSCode
