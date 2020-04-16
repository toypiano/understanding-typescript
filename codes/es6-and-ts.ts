const add = (a: number = 0, b: number = 1) => a + b;
const printOutput: (o: number | string) => void = (output) =>
  console.log(output);
const button = document.querySelector('button');
button?.addEventListener('click', (e) => console.log(e));

printOutput(add(0));

const hobbies = ['sleep', 'eat'];
const [hobby1, hobby2, ...otherHobbies] = hobbies;
console.log(hobby1, hobby2, otherHobbies, hobbies);
// sleep eat [] ["sleep", "eat"]

const activeHobbies = ['smile'];

activeHobbies.push(...hobbies);

const person = {
  name: 'Hayoun',
  age: 39,
};

// Copied destructured values into new personName variable because
// name variable already exist in the scope.
const { name: personName, age: personAge } = person;

const copiedPerson = { ...person };

const addNumbers = (...numbers: number[]) => {
  return numbers.reduce((curr, val) => curr + val);
};
const addedNumbers = addNumbers(1, 2, 3, 4, 5);
console.log(addedNumbers);
