function add(n1: number, n2: number) {
  return n1 + n2;
}

function printResult(num: number): void {
  // you don't need to specify 'void' type here
  console.log('Result: ' + num);
}

function addAndHandle(n1: number, n2: number, cb: (num: number) => void) {
  const result = n1 + n2;
  const returnValue = cb(result); // this is fine as long as you don't USE the return value
  console.log(returnValue); // this is ok (just logging, not doing any computation...)

  // const isReturnValueTrue = returnValue === true; // now TS is mad at you.
  /* This condition will always return 'false' since 
  the types 'void' and 'boolean' have no overlap.ts(2367) */
}

addAndHandle(10, 20, (sum) => {
  console.log(sum);
  return true; // ts not saying anything here...
});

printResult(add(5, 12));

let combineValues: (a: number, b: number) => number;

combineValues = add;
// combineValues = printResult; // assigning wrong function

// combineValues = 777; // assigning wrong type

console.log(combineValues(4, 40));
