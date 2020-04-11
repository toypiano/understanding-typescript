# Advanced Types

## Intersection Types with `&`

Similar to the union type with `|` operator, you can create an intersection of multiple types with `&` operator.

```ts
type Combinable = string | number;
type Numeric = number | boolean;
type Universal = Combinable & Numeric;
```

```ts
type Admin = {
  name: string;
  privileges: string[];
};

type Employee = {
  name: string;
  startDate: Date; // supported by ts!
};
// Intersection operator: "&"
type ElevatedEmployee = Admin & Employee;

const e1: ElevatedEmployee = {
  name: 'Hayoun',
  privileges: ['create-server'],
  startDate: new Date(),
};
```

The same can be done with interface and `extends` keyword.

```ts
interface Admin {
  name: string;
  privileges: string[];
}

interface Employee {
  name: string;
  startDate: Date;
}

interface ElevatedEmployee extends Admin, Employee {}
```

## Type-Guard Pattern with Union type objects

With union type of objects, there are times when you are not sure whether an object contains certain property or method.

Typescript will warn you if try to use a property or a method that only belongs to one type inside union type.

```ts
type UnknownEmployee = Employee | Admin;

function printEmployeeInformation(emp: UnknownEmployee) {
  console.log('Name: ' + emp.name); // name belongs to both Employee and Admin type

  // Property 'privileges' does not exist on type 'Employee'.ts(2339)
  console.log('Privileges: ' + emp.privileges🚨);
}
```

In this case, you can implement "type guard" to avoid warning:

```ts
function printEmployeeInformation(emp: UnknownEmployee) {
  console.log('Name: ' + emp.name);
  // type-guard union type of objects by checking key name manually
  if ('privileges' in emp) {
    // outside this block, ts will be mad at emp.privileges
    console.log('Privileges: ' + emp.privileges);
  }
}
```

You can also use `instanceof` check instead of `in` prop check if your object is created with a constructor (class / function):

```ts
class Car {
  drive() {
    console.log('Driving...');
  }
}
class Truck {
  drive() {
    console.log('Driving a truck...');
  }
  loadCargo(amount: number) {
    console.log('Loading cargo ...' + amount);
  }
}
type Vehicle = Car | Truck;
const v1 = new Car();
const v2 = new Truck();

function useVehicle(vehicle: Vehicle) {
  vehicle.drive();
  // type-guard for object with constructor
  if (vehicle instanceof Truck) {
    vehicle.loadCargo(1000);
  }
}
```

## Discriminated Union Pattern

Another useful pattern when dealing with union type objects.  
If you have many different types in your union-typed object, type-guarding with `if` check for each individual property(method) becomes long and tedious.

```ts
interface Bird {
  flyingSpeed: number;
}

interface Horse {
  runningSpeed: number;
}

type Animal = Bird | Horse;

function moveAnimal(animal: Animal) {
  if ('flyingSpeed' in animal) {
    console.log('Moving at speed: ' + animal.flyingSpeed);
  } else {
    console.log('Moving at speed:' + animal.runningSpeed);
  }
}
```

This approach becomes very inefficient as you add more specialized types into your union type.

- Using string value to check property name is error-prone and requires more typing.

In this case, you can apply **Discriminated union pattern** where you assign unique literal type to a "type" (or "kind" sometimes) property that exists in all related objects.

> This is similar to the "Polymorphic Pattern" in data modeling.

- First add "type" property of literal type to your custom type or interface:

  ```ts
  interface Bird {
    // Assigns literal type of 'bird'
    type: 'bird'; // this is NOT a value assignment!
    flyingSpeed: number;
  }

  interface Horse {
    type: 'horse';
    runningSpeed: number;
  }
  ```

- Then you can use `switch` statement to check types of the `type` property:
  ```ts
  function moveAnimal(animal: Animal) {
    let speed;
    switch (animal.type) {
      case 'bird':
        speed = animal.flyingSpeed;
        break;
      case 'horse':
        speed = animal.runningSpeed;
    }
    console.log('Moving at speed: ' + speed);
  }
  ```

This type-checking with switch statement is much more efficient and less error-prone because you get an auto-completion for available properties in each case.

## Type Casting

When you are selecting DOM objects inside javascript, Typescript can't infer its type and can't even tell if the DOM selector returns non-null object.

```ts
// ts knows it's an paragraph element (by 'p' value we provided)
const para = document.querySelector('p');

// ts only knows it's HTML element with 'message' id (ts doesn't go into DOM)
const message = document.getElementById('message');

// TS doesn't know if
// 1. userName is not null => tell ts it's not null with '!'
// 2. placeholder exists in userName => tell ts with type-casting (this will automatically satisfy 1.)
userName🚨.placeholder🚨 = 'Your Name';
```

In this case, you can explicitly tell ts its type with `type-casting`:

Two syntaxes are available for type casting:

- Type-casting with angle brackets:

```ts
const userName = <HTMLInputElement>document.getElementById('name');
```

- Type-casting with `as` keyword (JSX-compatible):

```ts
// React-compatible typecasting
// Now it's YOUR RESPONSIBILITY that userName is really the object you type-casted as.
// (possible run-time error)
const userName = document.getElementById('name') as HTMLInputElement;
```
