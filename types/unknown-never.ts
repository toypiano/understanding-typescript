let userInput: unknown; // we don't know yet.
let userName: string;

userInput = 5;
userInput = 'Hey!'; // still unknown type (can change anytime)
// userName = userInput; // Error! unknown is not guaranteed to be string.

if (typeof userInput === 'string') {
  userName = userInput; // TS detects manual type-checking and let it pass.
}

let anyInput: any;
anyInput = 1980;
userName = anyInput; // any type is like a JOKER. TS will not have anything to do with "any" type.

// Function returning never must have unreachable end point!
function generateError(message: string, code: number): never {
  throw { message: message, errorCode: code };
}

let error: string;
error = generateError('Not Found', 404); // this is fine
console.log(error); // this is also fine
let never: never;
// never = anyInput; // No types including "any" aren't assignable to never
