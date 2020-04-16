class Department {
  // public name: string;
  // private id: string;
  // private employees: string[] = [];
  protected employees: string[] = [];

  constructor(private readonly id: string, public name: string) {
    // this.name = n;
    // this.id = id;
  }

  static throwParty(committee: string[], budget: number) {
    if (budget < 20) {
      throw Error("We can't even order a pizza with that budget");
    }
    console.log(`Party time! Please ask: `, ...committee);
  }

  describe(this: Department) {
    console.log(`Department: ${this.name}(${this.id})`);
  }

  addEmployee(employee: string) {
    // this.id = 'ninja'; // Department: Action__Attack(dep-action-ny-00)
    this.employees.push(employee);
  }

  printEmployeeInformation() {
    console.log(this.employees.length);
    console.log(this.employees);
  }
}

const accounting = new Department('dep-acc-ny-01', 'Accounting');

accounting.addEmployee('Ethan');
accounting.addEmployee('Elaine');
// accounting.employees.push('Racoon') // TS: employees is private!

accounting.describe();
accounting.printEmployeeInformation();

const secret = {
  name: 'Assassination',
  describe: accounting.describe,
};

// secret.describe();

// you can ONLY inherit from one class
class ITDepartment extends Department {
  admins: string[];
  constructor(id: string, admins: string[]) {
    super(id, 'IT'); // hard-code base prop(name) with 'IT', init id prop with input
    this.admins = admins; // could've just done "public admins: string[]" above
  }
}

const it = new ITDepartment('dep-it-ny-02', ['David', 'Molly']);
it.describe();
console.log(it);

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

  addEmployee(name: string) {
    if (name === 'Villain') {
      return; // Don't hire villains!
    }
    this.employees.push(name); // private property from base class. can't access from child class
  }

  attack(weaponIndex: number) {
    const weaponOfChoice = this.secretWeapons[weaponIndex];
    console.log(`AD attacked with ${weaponOfChoice}`);
  }

  addWeapon(weapon: string) {
    this.secretWeapons.push(weapon);
    this.newWeapon = weapon;
  }
}

const action = new ActionDepartment('dep-action-ny-00', [
  'flame thrower',
  'bazooka',
  'morning star',
]);

action.name = 'Action__Attack'; // changes name

action.describe(); // Department: Action__Attack(dep-action-ny-00)

action.addEmployee('Deadpool'); // Deadpool is not villain (is he?).
console.log(action);
// console.log(action.employees); //Property 'employees' is protected and only accessible within class 'Department' and its subclasses.ts(2445)
action.attack(0); // AD attacked with flame thrower
action.attack(2); // AD attacked with morning star
action.attack(3); // AD attacked with undefined

action.addWeapon('rc bomb');
// console.log(action.newWeapon);
console.log(action.newToy);

// action.newToy = ''; // app.ts:72 Uncaught Error: You cannot set an empty new toy.
action.newToy = 'rain maker';
console.log(action.newToy);

class ActionDouble extends ActionDepartment {}

const actionDouble = new ActionDouble('double', ['fake gun']);

// ===== Example 2: Musician =====================

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

const billEvans = new Pianist('be01', 'Bill Evans', 1929);

console.log(billEvans.name);
billEvans.play();

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
}

const monk = TheloniousMonk.getTheloniousMonk();
const tMonk = TheloniousMonk.getTheloniousMonk();
console.log(monk === tMonk); // true;
