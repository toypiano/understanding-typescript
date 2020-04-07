function add(n1, n2) {
    return n1 + n2;
}
function printResult(num) {
    // you don't need to specify 'void' type here
    console.log('Result: ' + num);
}
function addAndHandle(n1, n2, cb) {
    var result = n1 + n2;
    cb(result);
}
addAndHandle(10, 20, function (sum) {
    console.log(sum);
});
printResult(add(5, 12));
var combineValues;
combineValues = add;
// combineValues = printResult; // assigning wrong function
// combineValues = 777; // assigning wrong type
console.log(combineValues(4, 40));
