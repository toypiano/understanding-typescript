var userInput; // we don't know yet.
var userName;
userInput = 5;
userInput = 'Hey!'; // still unknown type (can change anytime)
// userName = userInput; // Error! unknown is not guaranteed to be string.
if (typeof userInput === 'string') {
    userName = userInput; // TS detects manual type-checking and let it pass.
}
var anyInput;
anyInput = 1980;
userName = anyInput; // any type is like a JOKER. TS will not have anything to do with "any" type.
function generateError(message, code) {
    throw { message: message, errorCode: code };
}
var error = generateError('Not Found', 404);
console.log(error);
