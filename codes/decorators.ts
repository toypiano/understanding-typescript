function Logger(logString: string) {
  console.log('Logger Factory');
  return function (constructor: Function) {
    console.log(logString); // now this decorator can do something with passed argument
    console.log(constructor); // logs prettified constructor
  };
}

// function WithTemplate(template: string, hookId: string) {
//   // We'll get a class as an argument, but we're not using it
//   return function (_: Function) {
//     const hookEl = document.getElementById(hookId);
//     if (hookEl) {
//       hookEl.innerHTML = template;
//     }
//   };
// }

/**
 * @param template - stringified HTML to inject into hook element
 * @param hookId - Hook element ID
 */
function WithTemplate(template: string, hookId: string) {
  console.log('Template Factory');
  // decorator extending object with "new" method
  // which takes any type of arguments and returns a new object with name property
  return function <T extends { new (...args: any[]): { name: string } }>(
    decoratedConstructor: T
  ) {
    // return a class that extends passed constructor
    return class extends decoratedConstructor {
      // keeps all properties of the original class
      // and add new members...
      constructor(..._: any[]) {
        // will take some args but not using it.

        super(); // execute logic from decorated class

        // Add  extra logic inside returning constructor
        // Now these will run only when returned class is instantiated
        console.log('template');
        const hookEl = document.getElementById(hookId);

        if (hookEl) {
          hookEl.innerHTML = template;
          // original + add props accessible via this
          hookEl.querySelector('span')!.textContent = this.name;
        }
      }
    };
  };
}

@Logger('[Person]')
@WithTemplate('<h1>My Person Object: <span></span></h1>', 'app')
class Person {
  name = 'Hayoun';
  constructor() {
    console.log('Creating person object...');
  }
}

// now you have to instantiate to run logic inside modified class
const hayoun = new Person();

// console.log(hayoun);

// ===== property decorators =================

// property decorator
function Log(target: any, propertyName: string | Symbol) {
  console.log('Property decorator:');
  console.log(target, propertyName);
}

// accessor decorator
function Log2(
  target: any,
  name: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  console.log('Accessor decorator!');
  console.log(target); // {constructor: ƒ, getPriceWithTax: ƒ}
  console.log(name); // price
  console.log(descriptor);
  // {get: undefined, enumerable: false, configurable: true, set: ƒ}
  return { enumerable: true };
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
  // Log will run after the class definition is registered with javascript
  @Log // property decorator is passed (value, key)
  title: string;
  private _price: number;

  @Log2
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
  @Log3
  getPriceWithTax(@Log4 tax: number) {
    return this._price * (1 + tax);
  }
}

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
// 'this' in showMessage becomes button element.
button.addEventListener('click', p.showMessage);

// =====  Validation with Decorators =====================

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
    ...registeredValidators[target.constructor.name],
    [propName]: [
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
          isValid = isValid && obj[prop] > 0;
          break;
      }
    }
  }
  return isValid;
}

class Course {
  @Required
  title: string;
  @PositiveNumber
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
  const price = +priceEl.value;
  // instead of adding validation logic here,
  // it would be nice if we could have that inside the Course class

  const createdCourse = new Course(title, price);
  if (!validate(createdCourse)) {
    alert('Invalid input, please try again!');
    return;
  }
  console.log(createdCourse);
});
