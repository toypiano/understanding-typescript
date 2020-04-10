# Classes & Interfaces

## Class method `this` parameter (TS feature)

- In typescript, you can specify `this` parameter when a class method is defined.
- It prevents the method from referencing `undefined` property which is a natural JS behavior.
- `this` inside `describe` method must be pointing at object with all the properties defined in Department class. (i.e. has to be Department _instance_.)

```ts
class Department {
  name: string;

  constructor(n: string) {
    this.name = n;
  }

  describe(this: Department) {
    console.log('Department: ' + this.name);
  }
}

const secret = {
  // name: 'Assassination',
  describe: accounting.describe,
};

secret.describe(); // 'name' is undefined inside secret
// Property 'name' is missing in type '{ describe: (this: Department) => void; }' but required in type 'Department'.ts(2684)
```

Here, normal JS would log 'Department: undefined'.
You can remove `this: Department` from describe parameter and have the same result.

## TS `private` Properties & Methods

Private properties and methods cannot be accessed outside the class definition.

```ts
class Department {
  name: string;
  private employees: string[] = [];

  constructor(n: string) {
    this.name = n;
  }
  addEmployee(employee: string) {
    this.employees.push(employee);
  }
}

accounting.addEmployee('Ethan');
accounting.addEmployee('Elaine');
accounting.employees🚨.push('Racoon') // TS: employees is private!
```

## TS Shorthand for Init Prop

There are some boilerplates to declare all the typed properties, assign types to the constructor params, and then assign the values you received into the class properties again.

```ts
class Department {
  public name: string;
  private id: string;
  private employees: string[] = [];

  constructor(n: string, id: string) {
    this.name = n;
    this.id = id;
  }
  ...
```

With TS shorthand, you can declare properties, assign types, and initialize them all in one place.

```ts
class Department {
  private employees: string[] = [];
  constructor(public name: string, private id: string) {}
```

## `readonly` Modifier

Add `readonly` keyword in front of property declaration to disable any updates after initialization.

```ts
class Department {
  private employees: string[] = [];
  constructor(public name: string, private readonly id: string) {}

  addEmployee(employee: string) {
    this.id = 🚨'ninja'; // ts: you can't reassign to readonly!
    this.employees.push(employee);
  }
```

## Class Inheritance

In JS, you can only inherit from **only one base class** with `extends` keyword.
If you want to add new property (isn't that the reason creating new class?) to the base properties, use `super()` to initialize base properties and initialize new properties (either with shorthand or explicit assignment) with `constructor`.

```ts
class ITDepartment extends Department {
  admins: string[];
  constructor(id: string, admins: string[]) {
    super('IT', id); // hard-code base prop(name) with 'IT', init id prop with input
    this.admins = admins; // could've just done "public admins: string[]" above
  }
}

const it = new ITDepartment('dep-it-ny-02', ['David', 'Molly']);
it.describe(); // Department: dep-it-ny-02(IT)
```

Using TS constructor shorthand:

```ts
class ActionDepartment extends Department {
  constructor(id: string, private secretWeapons: string[]) {
    super('Action', id);
  }

  attack(weaponIndex: number) {
    const weaponOfChoice = this.secretWeapons[weaponIndex];
    console.log(`AD attacked with ${weaponOfChoice}`);
  }
}

const action = new ActionDepartment('dep-action-ny-00', [
  'flame thrower',
  'bazooka',
  'morning star',
]);

action.attack(0); // AD attacked with flame thrower
action.attack(2); // AD attacked with morning star
action.attack(3); // AD attacked with undefined
```

## `private` vs `protected` property & method

### Private

- Cannot access from outside of the defined class
- Cannot access from inheriting classes.

```ts
class Department {
  private employees: string[] = [];
  constructor(private readonly id: string, public name: string) {}
  addEmployee(employee: string) {
    this.employees.push(employee);
  }
  ...
}
class ActionDepartment extends Department {
  constructor(id: string, private secretWeapons: string[]) {
    super(id, 'Action');
  }
  addEmployee(name: string) {
    if (name === 'Villain') {
      return; // Don't hire villains!
    }
    this.employees🚨.push(name); // private property from base class. can't access from child class
  }
}

```

### Protected

- Cannot access from outside of the defined & inheriting class
- Can access from inheriting classes.

```ts
class Department {
  protected employees: string[] = [];
  constructor(private readonly id: string, public name: string) {}
  addEmployee(employee: string) {
    this.employees.push(employee);
  }
  ...
}
class ActionDepartment extends Department {
  constructor(id: string, private secretWeapons: string[]) {
    super(id, 'Action');
  }
  // You can override base class methods
  addEmployee(name: string) {
    if (name === 'Villain') {
      return; // Don't hire villains!
    }
    this.employees.push(name); // now you can access base property
  }
}

/* Our employee information is classified */
console.log(action.employees🚨);
//Property 'employees' is protected and only accessible within class 'Department' and its subclasses.ts(2445)

```

## Getters & Setters

Class getter and setters are useful when you want to apply some logic when getting / setting property value.

- eg. condition check, unit conversion, type conversion, ...

```ts
class ActionDepartment extends Department {
  private newWeapon: string;
  constructor(id: string, private secretWeapons: string[]) {
    super(id, 'Action');
    this.newWeapon = secretWeapons[0];
  }
  // You cannot use existing name for getters
  get newToy() {
    if (this.newWeapon) {
      return this.newWeapon;
    }
    throw new Error(`Toy stock is empty.`);
  }
  // You can use the same name as getter
  set newToy(toy: string) {
    if (!toy) {
      throw new Error('You cannot set an empty new toy.');
    }
    this.addWeapon(toy);
  }
  ...
}
action.newToy = 'rain maker';
console.log(action.newToy); // rain maker
```

## ES6 Static Methods & Properties

Static methods (and properties) are not accessed on the instances of the class.

- So `this.whosHappy` doesn't make sense.
- `HappyPeople.whosHappy` does.

Static methods are useful when you want to create utility functions which:

- can be used without class instances
  - `SuperHero.getDCHeroes()`
  - `thor.changeHair()` needs instances to apply the method on.
- input|output other class instances and thus, you cannot "chain" them. - `Object.entry(data)` returns an array of tuples(array with 2 elements) - `Array.from("abc")` takes a string and other iterable objects
  [SO: When to use static methods?](https://stackoverflow.com/a/2671636/13036807)

Many programmers frown upon creating static methods and rather opt for having utility functions inside `util` folder.

```ts
class Department {
  ...
  static throwParty(committee: string[], budget: number) {
    if (budget < 20) {
      throw Error("We can't even order a pizza with that budget");
    }
    console.log(`Party time! Please ask: `, ...committee);
  }
  ...
```

## Abstract Classes

You can use abstract methods with abstract class when you want to specify the name, parameter types, and return types of specific method to be shared across its child classes.
Any classes that inherit from that base class must implement the method with the same name and type but can customize to fit the need of individual class.

- classes marked with `abstract` **cannot be instantiated.**

```ts
abstract class Musician {
  constructor(
    private readonly id: string,
    public name: string,
    public born: number,
    public instruments: string[]
  ) {}
  abstract play(this: Musician): void;
}

class Pianist extends Musician {
  constructor(id: string, name: string, born: number) {
    super(id, name, born, ['piano']);
  }
  play() {
    console.log(`${this.name} plays piano`);
  }
}
```

### Singletons and Private Constructors

Singletons in OOP is the classes that can have only one instance.

- TS "singleton" pattern:

  ```ts
  // You have only one T. Monk who plays like him...
  class TheloniousMonk extends Pianist {
  private static instance: TheloniousMonk;

  private constructor(id: string) {
    super(id, 'Thelonious Monk', 1917);
  }

  static getTheloniousMonk() {
    if (TheloniousMonk.instance) {
      return this.instance;
    }
    this.instance = new TheloniousMonk('melodious');
    return this.instance;
  }
  ...
  }
  const monk = TheloniousMonk.getTheloniousMonk();
  const tMonk = TheloniousMonk.getTheloniousMonk();
  console.log(monk === tMonk); // true;
  ```
