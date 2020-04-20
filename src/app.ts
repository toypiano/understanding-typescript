function Logger(logString: string) {
  console.log('@Logger');
  return function (constructor: Function) {
    console.log(logString);
    console.log(constructor);
  };
}

function WithTemplate(template: string, elemId: string) {
  console.log('@WithTemplate');
  return function (constructor: any) {
    console.log('Writing to DOM...');
    const elem = document.getElementById(elemId);
    const person = new constructor(); // instantiating Person...
    if (elem) {
      elem.innerHTML = template;
      elem.querySelector('span')!.textContent = person.time.toDateString();
    }
  };
}

@Logger('[Person Logger]')
@WithTemplate('<h1><span></span></h1>', 'app')
class Person {
  name = 'Ethan';
  time = new Date();
  constructor() {
    console.log('[Person constructor]');
  }
}

// Property Decorators ===========================

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
