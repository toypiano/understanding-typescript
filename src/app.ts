/* // Built-in generics

const names: Array<string> = ['Ethan', 'Elaine']; // string[]
// names[0].split(' ');
const inferred = [1, 2];

// Generics offer additional type information when needed
const promise: Promise<number> = new Promise((resolve, reject) => {
  setTimeout(() => resolve(777), 2000);
});

// data: number , err:any
promise.then((data) => data.toString()).catch((err) => console.log(err.length));
 */

// function merge(objA: object, objB: object) {
//   // some processing...
//   return Object.assign(objA, objB);
// }
// T and Y have to be a type object
function merge<T extends object, U extends object>(objA: T, objB: U) {
  // some processing...
  return Object.assign(objA, objB);
}

// Here, merging 6 into object fails silently
const mergedObj = merge({ name: 'Ethan', hobbies: 'Video game' }, { age: 6 });
console.log(mergedObj);

// Anything with this typed property is 'Lengthy' type(polymorphism)
interface Lengthy {
  length: number;
}

// Often when you have a generic function, your parameter will be of that type
// This function will work with any type that has 'length: number' property

// With type variable, we don't have to create multiple overloads
// or union type with many sub-types every time we decide to
// make the function work with new type (hard-coding approach -> less re-usable).

function countAndDescribe<T extends Lengthy>(element: T): [T, string] {
  let descriptionText = 'Have no value.';
  if (element.length === 1) {
    descriptionText = 'Have 1 element.';
  } else if (element.length > 1) {
    descriptionText = `Have ${element.length} elements.`;
  }
  return [element, descriptionText];
}

// works with a string
console.log(countAndDescribe('Hello there'));

// works with an array
console.log(countAndDescribe(['Hello', 'there']));

// number has no property,'length'
// console.log(countAndDescribe(5));
// Argument of type '5' is not assignable to parameter of type 'Lengthy'.ts(2345)

// ==== The keyof Constraint ==========================

function extractAndConvert<T extends object, U extends keyof T>(
  obj: T,
  key: U
) {
  return obj[key]; // we don't know if obj will have 'key' prop
}

console.log(extractAndConvert({ name: 'Hayoun' }, 'name'));

// ==== Generic Classes =================================

// only works with primitive types
class DataStorage<T extends string | number | boolean> {
  // 'Storage' is a reserved name
  private data: T[] = [];

  addItem(item: T) {
    //  need to assign type for arg 'item'
    this.data.push(item);
  }

  removeItem(item: T) {
    // indexOf returns -1 if item is not found.
    // Consequently, the last item([-1]) in the array is removed
    this.data.splice(this.data.indexOf(item), 1);
  }

  getItems() {
    return [...this.data];
  }
}

const textStorage = new DataStorage<string>();
textStorage.addItem('Ethan');
textStorage.addItem('Elaine');
textStorage.removeItem('Elaine');
console.log(textStorage.getItems());

const numberStorage = new DataStorage<number>();

/* const objStorage = new DataStorage<object>();
objStorage.addItem({ name: 'Shobe' });
objStorage.addItem({ name: 'Ggrube' });
// indexOf will not find the passed obj (every obj is different)
objStorage.removeItem({name: 'Shobe'}); 
 */

// ====== Generic Utility Types ====================

interface CourseGoal {
  title: string;
  description: string;
  completeUntil: Date;
}

function createCourseGoal(
  title: string,
  description: string,
  date: Date
): CourseGoal {
  let courseGoal: Partial<CourseGoal> = {}; // now we can init with empty obj
  courseGoal.title = title; // and create props as we go.
  courseGoal.description = description;
  courseGoal.completeUntil = date;
  // convert back to CourseGoal from Partial after adding all the props
  return courseGoal as CourseGoal;
}

const names: Readonly<string[]> = ['Ethan', 'Elaine'];
// names.push('Na Youn');
