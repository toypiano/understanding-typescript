# Typescript Decorators

Decorators are TS meta-programming feature that supports annotating or modifying classes and class members.

Decorators can be attached to:

- class declaration
- property (static | instance)
- accessors (get | set)
- method
- parameter

In order to use decorators, uncomment `"experimentalDecorators": true` inside `tsconfig.json` file.

## A First Class Decorator

TS decorator is just a function you attach on top of classes.  
Decorator will be called after the class is **defined**. You don't have to instantiate a decorated class to run its decorator.

```ts
// Decorator functions start with Uppercase letter
function Logger(constructor: Function) {
  console.log('Logging...');
  console.log(constructor); // logs prettified constructor
}

@Logger // Logger decorator is called after the decorating function is DEFINED
class Person {
  name = 'Hayoun';
  constructor() {
    console.log('Creating person object...');
  }
}

// You don't have to call decorated function to run decorator
// const hayoun = new Person();

// console.log(hayoun);
```

In the browser console:

```bash
Logging...
class Person {
    constructor() {
        this.name = 'Hayoun';
        console.log('Creating person object...');
    }
}
```

## Working with Decorator Factories

You can also create a decorator factory that returns a decorator with input argument.  
Then you can customize your decorator as you need when you attach it to a class.

```ts
// Decorator Factory: Logger
function Logger(logString: string) {
  return function (constructor: Function) {
    console.log(logString); // now this decorator can do something with passed argument
    console.log(constructor);
  };
}

@Logger('[Person]') // Now call deco factory passing an argument
class Person {
  name = 'Hayoun';
  constructor() {
    console.log('Creating person object...');
  }
}
```

## Building More Useful Decorators

Angular uses decorator to select DOM-node and inject template HTML where you can provide data via decorated class properties.

Decorator factory provides a way to configure a decorator which can then instantiate the passed(decorated) class to do some amazingly awesome things with the instance properties.

Developers can use 3rd party decorators and just pass their classes to provide information
that the decorator need for their jobs.

```ts
/**
 * @function WithTemplate - ts decorator factory
 * @param template - stringified HTML to inject into hook element
 * @param hookId - Hook element ID
 */
function WithTemplate(template: string, hookId: string) {
  // returns decorator that takes a class and has access to factory arguments
  return function (constructor: any) {
    // query DOM element with given id (hookId)
    const hookEl = document.getElementById(hookId);
    // Instantiate decorated class and do something with it
    const hayoun = new constructor();
    if (hookEl) {
      hookEl.innerHTML = template;
      // display instance property (data) to the client
      hookEl.querySelector('span')!.textContent = hayoun.name;
    }
  };
}

@WithTemplate('<h1>My Person Object: <span></span></h1>', 'app')
class Person {
  name = 'Hayoun';
  constructor() {
    console.log('Creating person object...');
  }
}
```

## Adding Multiple Decorators

Multiple decorators run bottom-up. The decorator closer to the class will run first.

- 'Decorator factory' will run in normal javascript way - top to bottom.

```ts
// 1. Logger factory runs.
@Logger('[Person]') // 4. Logger decorator runs.
// 2. Template factory runs.
@WithTemplate('<h1>My Person Object: <span></span></h1>', 'app') // 3. Template decorator runs
class Person {
  name = 'Hayoun';
  constructor() {
    console.log('Creating person object...');
  }
}
```

## Property Decorators

You can also set decorators on class properties(members).  
Property decorators will be passed:

- ( static member: constructor function | instance member: prototype of the object ) as 1st argument
- and member `name` as the 2nd argument.
- and will be called right after the class definition is registered with javascript.

```ts
// property decorator
function Log(target: any, propertyName: string | Symbol) {
  console.log('Property decorator:');
  console.log(target, propertyName); //
  // {constructor: ƒ, getPriceWithTax: ƒ} "title"
}

class Product {
  // Log will run after the class definition is registered with javascript
  @Log // property decorator is passed (value, key)
  title: string;
  ...
```

## Accessor , Method, and Parameter Decorators

```ts
// accessor decorator
function Log2(target: any, name: string, descriptor: PropertyDescriptor) {
  console.log('Accessor decorator!');
  console.log(target); // {constructor: ƒ, getPriceWithTax: ƒ}
  console.log(name); // price
  console.log(descriptor);
  // {get: undefined, enumerable: false, configurable: true, set: ƒ}
}

// method decorator
function Log3(
  target: any,
  name: string | Symbol,
  descriptor: PropertyDescriptor
) {
  console.log('Method decorator!');
  console.log(target); // {constructor: ƒ, getPriceWithTax: ƒ}
  console.log(name); // getPriceWithTax
  console.log(descriptor);
  // {writable: true, enumerable: false, configurable: true, value: ƒ}
}

// param decorator
function Log4(target: any, name: string | Symbol, position: number) {
  console.log('Parameter decorator!');
  console.log(target); // {constructor: ƒ, getPriceWithTax: ƒ}
  console.log(name); // getPriceWithTax
  console.log(position); // 0
}

class Product {
  ...
  @Log2 // accessor decorator(target, name, descriptor)
  set price(val: number) {
    if (val > 0) {
      this._price = val;
    } else {
      throw new Error('invalid price - should be positive!');
    }
  }
  constructor(t: string, p: number) {
    // could've been done with declaration-shorthand
    this.title = t;
    this._price = p;
  }
  @Log3 // method decorator(target, name, descriptor)
  getPriceWithTax(@Log4 tax: number) { // param decorator(target, name, position)
    return this._price * (1 + tax);
  }
}
```

In the browser console, parameter decorator will run before the method decorator.

## When Do Decorators Execute?

Decorator runs after the definition, not after the invocation / instantiation.
Therefore, each attached decorator only runs once regardless of the number of class instantiation / method invocation.
