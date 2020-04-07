// You can create Alias for custom types
type Combinable = number | string;
type ConversionOption = 'as-number' | 'as-string'; // union of literal type

function combine(
  input1: Combinable,
  input2: Combinable,
  resultConversion: ConversionOption
) {
  let result;
  if (typeof input1 === 'number' && typeof input2 === 'number') {
    result = input1 + input2;
  } else {
    result = input1.toString() + input2.toString();
  }
  if (resultConversion === 'as-number') {
    return +result;
  } else {
    return result.toString();
  }
}

const combinedAges = combine(30, 26, 'as-number');
console.log(combinedAges);

const combinedStringAges = combine('30', '26', 'as-number');

const combinedNames = combine('Ethan', 'Elaine', 'as-string');
console.log(combinedNames);
