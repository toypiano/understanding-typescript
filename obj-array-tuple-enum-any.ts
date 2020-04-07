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

enum Role {
  HUSBAND = 3, // we can add default index to labels
  FATHER, // ts automatically assigns the index of 4
  SELF = 97,
}

const person = {
  name: 'Hayoun Lee',
  age: 39,
  hobbies: ['Reading manga', 'Watching standup comedies'],
  role: Role.HUSBAND,
};

// person.role.push('father'); // TS allows mutating tuples...
/* person.role[1] = 10; // Type '10'  is not assignable to type string */

/* person.role = []; // reassignment is also NOT allowed!(has to be in the same shape) */

let favoriteActivities: string[];
favoriteActivities = ['Sleeping' /* 1 ts yells at this*/];

console.log(person.name);

for (const hobby of person.hobbies) {
  // TS automatically infers the type of hobby from hobbies array
  console.log(hobby.toUpperCase());
  /* console.log(hobby.pop()) // ts yells at this */
}

if (person.role === Role.SELF) {
  console.log('is self');
}
