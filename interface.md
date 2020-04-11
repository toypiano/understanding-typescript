# Typescript Interface

In Typescript, interface defines the structure of an object and works as a binding contract when creating an object/class that extends that interface.

Most of the time, interface can be replaced with custom type, but it is more common to use interface for defining structure for **objects** and **classes**.

## `interface` vs `type`

### Interface

- Can only be used to define the structure of an object.
- More clear that we are structuring an object.

```ts
interface Person {
  name: string;
  age: number;
  greet(phrase: string): void;
}

let user1: Person;

user1 = {
  name: 'Trevor',
  age: 30,
  // ES6 object method syntax
  greet(phrase: string) {
    console.log(phrase + ' ' + this.name);
  },
};

user1.greet('How you doing,'); // How you doing, Trevor
```

### Custom Type (alias)

- You can also define other types with `type` keyword.

```ts
type Person = {
  name: string;
  age: number;
  greet(phrase: string): void;
};

type Combinable = number | string;
type ConversionOption = 'as-number' | 'as-string'; // union of literal type

function combine(
  input1: Combinable,
  input2: Combinable,
  resultConversion: ConversionOption
) { ...
```

## Implementing multiple interfaces

- When you create a class, you can implement multiple interfaces.
- With interface, you can define certain structures of properties and methods to share across multiple classes.

```ts
interface Greetable {
  name: string;
  greet(phrase: string): void;
}

interface Married {
  spouse: string;
  haveAChild(): void;
}

class MarriedPerson implements Greetable, Married {
  constructor(public name: string, public spouse: string) {}
  greet(phrase: string) {
    console.log(phrase + ' ' + this.name);
  }
  haveAChild() {
    console.log(this.name + ' has a child with ' + this.spouse);
  }
}

const joe = new MarriedPerson('Joe', 'Joanne');
joe.haveAChild(); // Joe has a child with Joanne
```

- This is similar to using `abstract` classes, but abstract can:
  - only be used with classes
  - can provide (partial) implementation
  - persist over runtime.
  - [interface vs abstract](https://stackoverflow.com/a/50115567/13036807)

## Why interface?

We have an instance foo of class `Bar` and because `Bar` implements `Baz` interface, we can be sure that foo has all `Baz` property and methods on it. This way, we don't have to know all the properties and methods inside `Bar` but still can use `Baz` method on foo with confidence.

## `readonly` modifier in `interface`

You cannot add `private` or `public` inside interface, but you can add `readonly` modifier in front of a property name to make it impossible to override the initial value similar to "const".

```ts
interface Greetable {
  readonly name: string;
  greet(phrase: string): void;
}
```

## Extending interface

Interface can extend other interfaces as in classes using `extends`

```ts
interface Named {
  readonly name: string;
}

interface Greetable extends Named {
  greet(phrase: string): void;
}
```

Unlike classes, an interface can extend multiple interfaces (because they don't persist into runtime)

```ts
interface Greetable extends Named, French {
  greet(phrase: string): void;
}
```

## Interface as function types

Interface can also be used to define the structure of a function and can replace function `type`, because function is in the end, an object.

```ts
interface AddFn {
  // adding an anonymous function type
  // special ts syntax to use interface as a function type.
  (a: number, b: number): number;
}
```

But for function type, `type` statement is more commonly used:

```ts
type AddFn = (a: number, b: number) => number;
```

## Optional parameters & properties

You can make properties | methods optional by appending `?` to the field name:

```ts
interface Named {
  readonly name?: string;
  outputName?: string;
  addPrefix?(prefix: string): string;
}
```

If you specified a property inside an interface as optional, and also want to go the classes that extend that interface and make sure their methods can work with/without that (optional) property, you can add `?` when declaring class properties with class constructor.
<br>
Also, you may need to add 'if' check if you want to use optional properties inside your method:

```ts
interface Named {
  readonly name?: string;
  outputName?: string;
  addPrefix?(prefix: string): string;
}

interface Greetable extends Named {
  greet(phrase: string): void;
}

class Person implements Greetable {
  constructor(public name?: string) {}
  // now works with/without name
  greet(phrase: string) {
    if (this.name) {
      // name could be `undefined`
      console.log(phrase + ' ' + this.name);
    } else {
      console.log('Hi!');
    }
  }
}

let user1: Greetable;
user1 = new Person(); // now can call without passing name
```

Providing default parameter value inside constructor works similar to making the parameter optional:

```ts
class Person implements Greetable {
  constructor(public name: string = '') {}
  // now works with/without name (will be assigned an empty string when name is not given)
  greet(phrase: string) {
    if (this.name) {
      // name could be `undefined`
      console.log(phrase + ' ' + this.name);
    } else {
      console.log('Hi!');
    }
  }
}

let user1: Greetable;
user1 = new Person(); // still works the same!
```
