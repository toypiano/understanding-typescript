var button = document.querySelector('button');
var input1 = document.getElementById('num1'); // non-null + typecasting
var input2 = document.getElementById('num2'); // non-null + typecasting
function add(num1, num2) {
    return num1 + num2;
}
button.addEventListener('click', function () {
    // are you sure input1 and 2 have value property?
    console.log(add(+input1.value, +input2.value));
});
