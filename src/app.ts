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

function merge(objA: object, objB: object) {
  // some processing...
  return Object.assign(objA, objB);
}
// function merge<T, U>(objA: T, objB: U) {
//   // some processing...
//   return Object.assign(objA, objB);
// }

const mergedObj = merge({ name: 'Ethan', hobbies: 'Video game' }, { age: 6 });
// can't access name prop because TS only knows that it takes objects and returns object.
// mergedObj.name

// now TS understands that merge returns T & U
mergedObj.name;
/* Return type inferred by TS
const mergedObj: {
    name: string;
    hobbies: string;
} & {
    age: number;
}
*/
