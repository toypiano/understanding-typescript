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

```ts
function Log(target: any, propertyName: string | Symbol) {
  console.log('[Log target:]', target);
  console.log('[Log name:]', propertyName);
}

class Product {
  @Log
  static classId = 'P02733';
  @Log
  title: string;
  constructor(t: string) {
    this.title = t;
  }
}
```

- 1st argument:
  - static member: constructor function
  ```ts
  class Product {
    constructor(t) {
      this.title = t;
    }
  }
  ```
  - instance member: prototype of the object
  ```ts
  { constructor: class Product, __proto__: Object }
  ```
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

## Returning (and changing) a Class in a Class Decorator

Class decorator can take a decorated class, extend it to add extra logic & properties and finally replace the original class with returning class.

- You are adding new logic inside the returning constructor
  - So this will run when you instantiate the modified class, not after the class definition.
- Inside the returning class constructor, you can access all properties from old & new class with `this` keyword.

  - For this, the modified class being returned must be a generic class whose type is a constructor function that returns a instance object which includes properties being accessed with `this`. (Say WAT!??)

```ts
function WithTemplate(template: string, hookId: string) {
  return function <T extends { new (...args: any[]): { name: string } }>(
    decoratedConstructor: T
  ) {
    return class extends decoratedConstructor {
      constructor(..._: any[]) {
        // taking some args but not using it.
        super(); // execute logic from decorated class
        // Add  extra logic inside returning constructor
        const hookEl = document.getElementById(hookId);
        if (hookEl) {
          hookEl.innerHTML = template;
          // "this" instance will have the property, "name"
          // as specified in decorator declaration
          hookEl.querySelector('span')!.textContent = this.name;
        }
      }
    };
  };
}
```

In the above example:

- `WidthTemplate` is a decorator factory and takes 2 string arguments - `template` and `hookId`
- Typescript will call the returned decorator right after decorated class definition is registered in javascript.
  - , which in turn, returns another class that replaces the original decorated class.
- The decorator is a generic function:
  - whose type variable `T` extends a class (constructor function)
    - that takes arbitrary number of arguments of `any` type, destructured into `args` array.
    - and instantiates objects with "name" property.
    - properties not specified here cannot be access via `this` inside constructor.
  ```ts
  function <T extends { new (...args: any[]): { name: string } }>
  ```
  - and takes `decoratedConstructor` of type `T` as argument
  ```ts
  <T extends {...}>(decoratedConstructor: T)
  ```
  - to return a new class extending this passed `decoratedConstructor` class
    - we don't know if the decorated class takes certain arguments, but we know that we're not going to use them here (if any)
    ```ts
    constructor(..._: any[]) {
    ```
    - we inherit all the instance members
    ```ts
    super();
    ```
    - and do something with argument injected through the factory
    ```ts
    const hookEl = document.getElementById(hookId);
    ```
    - but that something also needs the members from the original class
    ```ts
    if (hookEl) {
      hookEl.innerHTML = template;
      hookEl.querySelector('span')!.textContent = this.name;
    }
    ```

### Recap

1. Configure / inject argument to decorator with factory
2. Inside the decorator we return a new class
3. Inside that class, we do something with the original class member + injected argument
4. This class replaces the original one.
5. The "something" will run when we instantiate the new class.

## Other Decorator Return Types

Only class, method, and accessor decorators can return.
Return values from method and accessor decorator update their descriptor properties.  
e.g. `enumerable`, `configurable`, etc...

## Example: "Autobind" Decorator

Create a method decorator, `Autobind`

- Takes (target: `any`, targetName: `string`, descriptor: `PropertyDescriptor` )
- Returns new descriptor object that updates old descriptor

```ts
// target would be prototype because we're adding this to a instance method
function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const updatedDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      // runs when value (decorated method) is accessed
      // Here, 'this' points to the owner of the decorated method
      // == Printer instance
      const boundFn = originalMethod.bind(this); // bind the method with its original context
      return boundFn;
    },
  };
  return updatedDescriptor; // replace old descriptor
}

class Printer {
  message = 'Printer works!';
  @Autobind
  showMessage() {
    console.log(this.message);
  }
}

const p = new Printer();

const button = document.querySelector('button')!;
// showMessage is bound with p instead of button
button.addEventListener('click', p.showMessage);
```

## Validation with Decorators

Create a 3rd party library where:

- Property decorators registers decorated property and validation constraints to the global config object.
- A validator function will be passed a validating instance and will access global config for related information:
  - Name of the constructor of the decorated property
  - Name of the decorated property
  - Array of registered validation constraints
- The validator function will loop through each constraints and finally return the result with true | false.

```ts
interface ValidatorConfig {
  // validating class name
  [property: string]: {
    [validatableProp: string]: string[]; // ['required', 'positive']
  };
}
// When app starts and our 3rd party library loads, no validators are registered yet.
const registeredValidators: ValidatorConfig = {};

/* 
Property decorators
- saves decorated class properties and name of the validator 
  to the global config: registeredValidators,
  categorized by class name after the class is defined.
  eg.
  { Course: { title: ['required'], price: ['positive'] } }
*/

function Required(target: any, propName: string) {
  // The class instance will have constructor that points to the class (Course)
  registeredValidators[target.constructor.name] = {
    // spread existing validating properties under the given class name
    ...registeredValidators[target.constructor.name],
    [propName]: [
      // spread existing constraints of the decorated property.
      ...registeredValidators[target.constructor.name][propName],
      'required',
    ],
  };
}

function PositiveNumber(target: any, propName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propName]: [
      ...registeredValidators[target.constructor.name][propName],
      'positive',
    ],
  };
}

/**
 * @function validate - validator function. work with global validator config object
 * @param obj - Course instance
 */
// type obj as 'any' because we don't know what properties it will have
function validate(obj: any) {
  const objValidatorConfig = registeredValidators[obj.constructor.name];
  if (!objValidatorConfig) {
    // name of the given class is not registered in the config
    return true;
  }
  let isValid = true;
  for (const prop in objValidatorConfig) {
    // loop through validator array of each property
    for (const validator of objValidatorConfig[prop]) {
      switch (validator) {
        case 'required':
          isValid = isValid && !!obj[prop]; // converts truthy | falsy to boolean
          break;
        case 'positive':
          // if any validator of any props in the registered class fails validation,
          // isValid becomes false;
          isValid = isValid && obj[prop] > 0;
          break;
      }
    }
  }
  return isValid;
}

class Course {
  @Required // apply validation: 'required'
  title: string;
  @PositiveNumber // apply validation: 'positive'
  price: number;

  constructor(t: string, p: number) {
    this.title = t;
    this.price = p;
  }
}

const courseForm = document.querySelector('form');
courseForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const titleEl = document.getElementById('title') as HTMLInputElement;
  const priceEl = document.getElementById('price') as HTMLInputElement;

  const title = titleEl.value;
  const price = +priceEl.value; // HTML value is ALWAYS string!

  // instead of adding validation logic here,
  // it would be nice if we could have that inside the Course class

  const createdCourse = new Course(title, price);
  // validate the entire instance at once!
  if (!validate(createdCourse)) {
    alert('Invalid input, please try again!');
    return;
  }
  // log only if validated
  console.log(createdCourse);
});
```

Package that does this for you:
[class-validator](https://github.com/typestack/class-validator)

[nest.js](https://nestjs.com/)

- A progressive Node.js framework for building efficient, reliable and scalable server-side applications.
