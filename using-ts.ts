const button = document.querySelector('button');
const input1 = document.getElementById('num1')! as HTMLInputElement; // non-null + typecasting
const input2 = document.getElementById('num2')! as HTMLInputElement; // non-null + typecasting

function add(num1: number, num2: number) {
  return num1 + num2;
}

button.addEventListener('click', () => {
  // are you sure input1 and 2 have value property?
  console.log(add(+input1.value, +input2.value));
});
