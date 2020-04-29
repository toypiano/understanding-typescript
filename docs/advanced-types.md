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

> Type guards helps you avoid runtime error by checking types before you try to do something with the values.

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

## Index Properties

You want to create an object with some key-value pairs where keys have different names, but their values have the same type that serve similar purposes, i.e. you are creating a dictionary object

- e.g.) actionTypes.FETCH_SUCCESS | FETCH_FAIL or error.mail | error.username
  ```ts
  const error = {
    email: 'Not a valid email',
    username: 'Must start with letter',
    ...
  };
  ```

You might even want to add new key-value pair dynamically into the object, but usually you need to specify the key name first then assign a type to it.

`index type` tells TS that if a property with the given key-type is added to the object, it must have the value of the specified type.

```ts
interface ErrorContainer {
  [prop: string]: string;
}

const errorBag: ErrorContainer = {
  email: 'Not a valid email!',
  id🚨: 3, // If you provided string type key name, value must be string
```

Note that integer properties are sorted in iteration, but they are still strings.

```ts
const errorBag: ErrorContainer = {
  email: 'Not a valid email!',
  0: 'InputError', // you can dynamically add props
  1🚨: 999, // 1(key) is string. Its value must be a string!
```

https://javascript.info/object#property-names-limitations

> Property names (keys) must be either strings or symbols. Other types are automatically converted to strings.

You can also specify other properties that should exist in the object:

```ts
interface ErrorContainer {
  id: string;
  [prop: string ]: string;
}
// errorBag must have id prop!
const errorBag🚨: ErrorContainer = {
  email: 'Not a valid email!'
}
```

Keys with the same type cannot be different types at the same time.

- string & number => always false
- string | number => always true

```ts
interface ErrorContainer {
  [prop: string ]: string;
  [key: string]: number;🚨 // This doesn't make sense.
}
```

This is fine:

```ts
interface ErrorContainer {
  [prop: string]: string | number;
}
```

## Function Overloads

```ts
type Combinable = string | number;
type Numeric = number | boolean;
type Universal = Combinable & Numeric;

function add(a: Combinable, b: Combinable) {
  if (typeof a === 'string' || typeof b === 'string') {
    return a.toString() + b.toString();
  }
  return a + b;
}

// TS doesn't know if Combinable has the method, "split"
const result = add("Hello", " world").split🚨(' ');
```

In this example, `add` doesn't have any return type specified, so TS will infer it as `Combinable` because it includes all the possible type that the parameters can have.  
However, even though you know that you'll get a string if you pass two string values into add, TS doesn't know that because it doesn't analyze what add function does inside its codeblock.

So if your function can return a value with different types depending on the types of the arguments, you can teach TS what type that function return will be based on its input type.

```ts
// function overloads for "add"
function add(a: number, b: number): number;
function add(a: string, b: number): string;
function add(a: number, b: string): string;
function add(a: string, b: string): string;
function add(a: Combinable, b: Combinable) {
  // type-guard
  if (typeof a === 'string' || typeof b === 'string') {
    return a.toString() + b.toString();
  }
  return a + b;
}
// Now TS knows this returns string type that has 'split' method.
const result = add('Hello', ' world').split(' ');
```

Note that if you add an overload for only one possible case, TS will stop inferring the return type and only refer to the overload you provided for function returns AND parameters.

```ts
function add(a: string, b: string): string;
function add(a: Combinable, b: Combinable) {
  // type-guard
  if (typeof a === 'string' || typeof b === 'string') {
    return a.toString() + b.toString();
  }
  return a + b;
}

const result = add("Hello", " world").split(' '); // this is fine, but...
const result2 = add("test", 2🚨); // 2 is not string
const result3 = add(90🚨 , "Banstock"); // 90 is not string
const result4 = add(1🚨,1); // 1 is not string
```

Therefore, if you are going to add an overload to a function, you have to add overloads for all possible combinations. Also, you have to order overloads from more detailed to more general because TS uses the first overload that matches.

## Optional Chaining

Optional chaining is a TS feature similar to JavaScript's short-circuit evaluation. It allows run-time code to silently fail if the referencing property doesn't exist in the object (e.g. data is being fetched asynchronously)

```ts
const data = {
  id: 'u1',
  name: 'Max',
  // job: { title: 'CEO', description: 'My own company' },
};

console.log(data?.job?title)
```

In Js, this is similar to:

```js
// JS short-circuit
console.log(data && data.job && data.job.title); // undefined
console.log(data.job.title); // throws TypeError
```

## Nullish Coalescing

Javascript groups [ 0, '', null, undefined ] together as "falsy" values.  
Therefore in the following code, you'll get `DEFAULT` fallback value;

```js
const userInput = 0;
const storedData = userInput || 'DEFAULT';
console.log(storedData); // DEFAULT
```

If you want to use 0 or an empty string as truthy value, then you can use Typescripts' `nullish coalescing operator`, `??`.

```ts
const userInput = 0;

// you want fallback only on null or undefined. not 0 or ''
const storedData = userInput && 'DEFAULT';
console.log(storedData); // 0
```
