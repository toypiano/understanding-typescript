# 3rd Party Libraries & Typescript

## Using 3rd party JS libraries in Typescript

If you install a 3rd party js library like lodash as you would in normal node application, Typescript cannot find the module by default.

```bash
$ yarn add lodash
```

`app.ts`

```js
import _ from 'lodash🚨'; // Cannot find module 'lodash'.ts(2307)

console.log(_.shuffle([1, 2, 3]));
```

Typescript needs type declarations for external Javascript modules in order to import & use them.

### Installing types package for JS library

You can find the type package for lodash by googling "lodash type".

https://www.npmjs.com/package/@types/lodash

which is exported from the [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) github repo.

The repo contains type declaration files (`.d.ts`) for +5.7k Javascript libraries.

`DefinitelyTyped/types/lodash/index.d.ts`

```ts
/* cSpell:disable */
// Type definitions for Lo-Dash 4.14
// Project: https://lodash.com
// Definitions by: Brian Zengel <https://github.com/bczengel>,
//                 Ilya Mochalov <https://github.com/chrootsu>,
//                 Stepan Mikhaylyuk <https://github.com/stepancar>,
//                 AJ Richardson <https://github.com/aj-r>,
//                 e-cloud <https://github.com/e-cloud>,
//                 Georgii Dolzhykov <https://github.com/thorn0>,
//                 Jack Moore <https://github.com/jtmthf>,
//                 Dominique Rau <https://github.com/DomiR>
//                 William Chelman <https://github.com/WilliamChelman>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.8
/* cSpell:enalbe */

/// <reference path="./common/common.d.ts" />
/// <reference path="./common/array.d.ts" />
/// <reference path="./common/collection.d.ts" />
/// <reference path="./common/date.d.ts" />
/// <reference path="./common/function.d.ts" />
/// <reference path="./common/lang.d.ts" />
/// <reference path="./common/math.d.ts" />
/// <reference path="./common/number.d.ts" />
/// <reference path="./common/object.d.ts" />
/// <reference path="./common/seq.d.ts" />
/// <reference path="./common/string.d.ts" />
/// <reference path="./common/util.d.ts" />

export = _;
export as namespace _;

declare const _: _.LoDashStatic;
declare namespace _ {
  // tslint:disable-next-line no-empty-interface (This will be augmented)
  interface LoDashStatic {}
}

// Backward compatibility with --target es5
declare global {
  // tslint:disable-next-line:no-empty-interface
  interface Set<T> {}
  // tslint:disable-next-line:no-empty-interface
  interface Map<K, V> {}
  // tslint:disable-next-line:no-empty-interface
  interface WeakSet<T> {}
  // tslint:disable-next-line:no-empty-interface
  interface WeakMap<K extends object, V> {}
}
```

#### Install lodash types package.

```bash
$ yarn add --dev @types/lodash
```

`app.ts`

```ts
import _ from 'lodash'; // no error now!

// Get auto-completion for all available methods on _
console.log(_.shuffle([1, 2, 3]));
```

### Using `declare` to write TypeScript Declaration File

- [Writing TS Declaration Files](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html)

- [Using declare for globals](https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html#global-variables))

#### Global variables

> Use `declare var` to declare variables. If the variable is read-only, you can use `declare const`. You can also use `declare let` if the variable is block-scoped.

`Code`

```js
console.log('Half the number of widgets is ' + foo / 2);
```

`Declaration`

```ts
/** The number of widgets present */
declare var foo: number;
```

#### Global functions

`Code`

```js
greet('hello, world');
```

`Declaration`

```ts
declare function greet(greeting: string): void;
```

#### Object with Properties

`Code`
The global variable `myLib` has a function `makeGreeting` for creating greetings, and a property `numberOfGreetings` indicating the number of greetings made so far.

```js
let result = myLib.makeGreeting('hello, world');
console.log('The computed greeting is:' + result);

let count = myLib.numberOfGreetings;
```

`Declaration`
Use `declare namespace` to describe types or values accessed by dotted notation.

```ts
declare namespace myLib {
  function makeGreeting(s: string): string;
  let numberOfGreetings: number;
}
```

For more examples of type declaration:

https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html

### Using `declare` as a last resort

Suppose you want to use a global variable declared in `<script>` tag before the closing body tag inside your index.html file.  
Theoretically you can use that variable inside a deferred script because it loads after what's inside the body.

```html
  <script type="module" src="dist/bundle.js" defer></script>
</head>

<body>
  <script>
    var LUCKY_NUMBER = '07338';
  </script>
</body>
```

But Typescript doesn't go into the html file for global variables. So it doesn't know it exists.

`app.ts`

```ts
console.log(LUCKY_NUMBER🚨); // Cannot find name 'LUCKY_NUMBER'.ts(2304)
```

```ts
declare var LUCKY_NUMBER: any; // don't worry, it's there.
console.log(LUCKY_NUMBER); // ok
```

## Using Typescript Libraries

There are many libraries written with TypeScript that utilize many of the features offered by TS.

### No types needed: class-transformer

[class-transformer](https://github.com/typestack/class-transformer) - "Proper decorator-based transformation / serialization / deserialization of plain javascript objects to class constructors"

#### Motivation: map instances from fetched json

In your JS application, you frequently need to fetch json data from the server, and transform them into class instances so that you can use various methods to work with the data.

You can map over the data array where you create new instances of the class and manually copy all properties from the data to new objects. (or instantiate passing object properties to constructor)

```ts
const users = fetch("users.json").then((users: User[]) => {
  return users.map(user => {
    return new User(user.id, user.firstName, user.lastName, user.age, ...);
  })
})
```

> But things may go wrong very fast once you have a more complex object hierarchy.

You can use `class-transformer` instead.

```ts
const users = fetch('users.json').then((users: User[]) => {
  return plainToClass(User, users);
});
```

#### Not using types

`plainToClass` doesn't use TypeScript specific features, and therefore can also be used in Vanilla JS.

#### Tooling to control what your models are exposing in your API

By default, `plainToClass` sets all properties from the plain object, even those which are not specified in the class. But you can also enforce type-safe instance with `excludeExtraneousValues` option.

```ts
import { Expose, plainToClass } from 'class-transformer';

class User {
  // @Expose decorator:
  // expose all your class properties as a requirement
  @Expose() id: number;
  @Expose() firstName: string;
  @Expose() lastName: string;
}

const fromPlainUser = {
  unknownProp: 'hello there',
  firstName: 'Jim',
  lastName: 'Carey',
};

console.log(
  plainToClass(User, fromPlainUser, { excludeExtraneousValues: true })
);

// User {
//   id: undefined,
//   firstName: 'Jim',
//   lastName: 'Carey'
// }
```

### Typescript-embracing: class-validator

[class-validator](https://github.com/typestack/class-validator) - "Allows use of decorator and non-decorator based validation. Internally uses validator.js to perform validation. Class-validator works on both browser and node.js platforms"

#### Enable "experimentalDecorators"

To use decorators in TS, enable `experimentalDecorators` in `tsconfig.json`

```
"experimentalDecorators": true
```

#### Usage

```ts
import {
  validate,
  validateOrReject,
  Contains,
  IsInt,
  Length,
  IsEmail,
  IsFQDN,
  IsDate,
  Min,
  Max,
} from 'class-validator';

export class Post {
  @Length(10, 20)
  title: string;

  @Contains('hello')
  text: string;

  @IsInt()
  @Min(0)
  @Max(10)
  rating: number;

  @IsEmail()
  email: string;

  @IsFQDN()
  site: string;

  @IsDate()
  createDate: Date;
}

let post = new Post();
post.title = 'Hello'; // should not pass
post.text = 'this is a great post about hell world'; // should not pass
post.rating = 11; // should not pass
post.email = 'google.com'; // should not pass
post.site = 'googlecom'; // should not pass

validate(post).then((errors) => {
  // errors is an array of validation errors
  if (errors.length > 0) {
    console.log('validation failed. errors: ', errors);
  } else {
    console.log('validation succeed');
  }
});

validateOrReject(post).catch((errors) => {
  console.log('Promise rejected (validation failed). Errors: ', errors);
});
// or
async function validateOrRejectExample(input) {
  try {
    await validateOrReject(input);
  } catch (errors) {
    console.log(
      'Caught promise rejection (validation failed). Errors: ',
      errors
    );
  }
}
```
