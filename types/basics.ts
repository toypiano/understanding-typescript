function add(n1: number, n2: number, showResult: boolean, phrase: string) {
  // if (typeof n1 !== 'number' || typeof n2 !== 'number') {
  //   throw new Error('Incorrect input!');
  // }
  const result = n1 + n2;
  if (showResult) {
    console.log(phrase + result);
  } else {
    return n1 + n2;
  }
}

// Manual assignment
let number1: number;
number1 = 5;
const number2 = 2.8; // ts just assigns value, not type for const (it's not going to change anyways)
const printResult = true;
/* Type inference automatically adds type */
let resultPhrase = 'Result is: ';
// resultPhrase = 0; // ts yells error

add(number1, number2, printResult, resultPhrase);
