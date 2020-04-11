// interface Admin {
//   name: string;
//   privileges: string[];
// }

// interface Employee {
//   name: string;
//   startDate: Date;
// }

// interface ElevatedEmployee extends Admin, Employee {}

// same as above, but just a little bit more concise
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

// You can freely combine union types with intersection operator
type Combinable = string | number;
type Numeric = number | boolean;
type Universal = Combinable & Numeric;

function add(a: Combinable, b: Combinable) {
  // type-guard
  if (typeof a === 'string' || typeof b === 'string') {
    return a.toString() + b.toString();
  }
  return a + b;
}

type UnknownEmployee = Employee | Admin;

function printEmployeeInformation(emp: UnknownEmployee) {
  console.log('Name: ' + emp.name);
  // type-guard union type of objects by checking key name manually
  if ('privileges' in emp) {
    // outside this block, ts will be mad at emp.privileges
    // Property 'privileges' does not exist on type 'Employee'.ts(2339)
    console.log('Privileges: ' + emp.privileges);
  }
  if ('startDate' in emp) {
    console.log('Start Date: ' + emp.startDate);
  }
}

printEmployeeInformation(e1);

const e2: Employee = {
  name: 'Elaine',
  startDate: new Date('2040-07-12'),
};
printEmployeeInformation(e2);

// ==== Type Guard for Class Instances =========

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
// function useVehicle(vehicle: Vehicle) {
//   vehicle.drive();
//   // type-guard for object method
//   if ('loadCargo' in vehicle) {
//     vehicle.loadCargo(1000);
//   }
// }

useVehicle(v1);
useVehicle(v2);

// ========== Discriminated Unions ====================

interface Bird {
  // Assigns literal type of 'bird'
  type: 'bird'; // this is NOT a value assignment!
  flyingSpeed: number;
}

interface Horse {
  type: 'horse';
  runningSpeed: number;
}

type Animal = Bird | Horse;

// function moveAnimal(animal: Animal) {
//   if ('flyingSpeed' in animal) {
//     console.log('Moving at speed: ' + animal.flyingSpeed);
//   } else {
//     console.log('Moving at speed:' + animal.runningSpeed);
//   }
// }

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

moveAnimal({ type: 'bird', flyingSpeed: 10 });

// ========= Type Casting =====================

// ts knows it's an paragraph element (by 'p' value we provided)
const para = document.querySelector('p');

// ts only knows it's HTML element with 'message' id (ts doesn't go into DOM)
const message = document.getElementById('message');

// Typecasting tells ts exactly what type of object userName is.
// const userName = <HTMLInputElement>document.getElementById('name');

// React-compatible typecasting
// Now it's YOUR RESPONSIBILITY that userName is really the object you type-casted as.
// (possible run-time error)
const userName = document.getElementById('name') as HTMLInputElement;

// TS doesn't know if
// 1. userName is not null => tell ts it's not null with '!'
// 2. placeholder exists in userName => tell ts with type-casting (this will automatically satisfy 1.)
userName.placeholder = 'Your Name';
