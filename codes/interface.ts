interface AddFn {
  // adding an anonymous function type
  // special ts syntax to use interface as a function type.
  (a: number, b: number): number;
}

// type AddFn = (a: number, b: number) => number;

let add: AddFn;

add = (n1: number, n2: number) => {
  return n1 + n2;
};

interface Named {
  readonly name?: string;
  outputName?: string;
  addPrefix?(prefix: string): string;
}

interface Greetable extends Named {
  greet(phrase: string): void;
}

interface Married {
  spouse: string;
  haveAChild(): void;
}

let user1: Greetable;

class Person implements Greetable {
  constructor(public name: string = '') {}
  greet(phrase: string) {
    if (this.name) {
      console.log(phrase + ' ' + this.name);
    } else {
      console.log('Hi!');
    }
  }
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

// user1 = {
//   name: 'Trevor',
//   age: 30,
//   // ES6 object method syntax
//   greet(phrase: string) {
//     console.log(phrase + ' ' + this.name);
//   },
// };

user1 = new Person(/* 'Joe' */); // Hi!

user1.greet('How you doing,'); // How you doing, Trevor

const joe = new MarriedPerson('Joe', 'Joanne');
joe.haveAChild(); // Joe has a child with Joanne
