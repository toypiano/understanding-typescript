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
  return function (constructor: any) {
    console.log('template');
    const hookEl = document.getElementById(hookId);
    // Instantiate decorated class and do something with it
    const hayoun = new constructor();
    if (hookEl) {
      hookEl.innerHTML = template;
      hookEl.querySelector('span')!.textContent = hayoun.name;
    }
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

// You don't have to call decorated function to run decorator
// const hayoun = new Person();

// console.log(hayoun);

// ===== property decorators =================

// property decorator
function Log(target: any, propertyName: string | Symbol) {
  console.log('Property decorator:');
  console.log(target, propertyName);
}

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
