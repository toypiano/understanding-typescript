// const person: {
//   name: string;
//   age: number;
//   hobbies: string[];
//   role: [number, string]; // TS tuple type
// } = {
//   name: 'Hayoun Lee',
//   age: 39,
//   hobbies: ['Reading manga', 'Watching standup comedies'],
//   role: [3, 'husband'],
// };
var Role;
(function (Role) {
    Role[Role["HUSBAND"] = 3] = "HUSBAND";
    Role[Role["FATHER"] = 4] = "FATHER";
    Role[Role["SELF"] = 97] = "SELF";
})(Role || (Role = {}));
var person = {
    name: 'Hayoun Lee',
    age: 39,
    hobbies: ['Reading manga', 'Watching standup comedies'],
    role: Role.HUSBAND
};
// person.role.push('father'); // TS allows mutating tuples...
/* person.role[1] = 10; // Type '10'  is not assignable to type string */
/* person.role = []; // reassignment is also NOT allowed!(has to be in the same shape) */
var favoriteActivities;
favoriteActivities = ['Sleeping' /* 1 ts yells at this*/];
console.log(person.name);
for (var _i = 0, _a = person.hobbies; _i < _a.length; _i++) {
    var hobby = _a[_i];
    // TS automatically infers the type of hobby from hobbies array
    console.log(hobby.toUpperCase());
    /* console.log(hobby.pop()) // ts yells at this */
}
if (person.role === Role.SELF) {
    console.log('is self');
}
