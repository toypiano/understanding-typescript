# TS type alias vs interface

Differences and use cases

## Type alias and Interface can be used to:

- Describe the shape of an object or a function signature:

`interface`

```ts
interface Point {
  x: number;
  y: number;
}

interface SetPoint {
  (x: number, y: number): void;
}
```

``type alias`

```ts
type Point = {
  x: number;
  y: number;
};

type SetPoint = (x: number, y: number) => void;
```

- Extend other type alias or interface

```ts
interface PartialPointX { x: number; }
interface Point extends PartialPointX { y: number; }

type PartialPointZ = { z: number; };
type Point = PartialPointX & { x: number; };
// can cross-extend
interface Point extends Partial PointZ { y: number; }
type Point = PartialPointX & { x: number; };
```

- Implemented by a class

```ts
interface PointOnXY {
  x: number;
  y: number;
}

type PointOnYZ = {
  y: number;
  z: number;
};

class PointA implements PointOnXY {
  x = 1;
  y = 1;
}

class PointB implements PointOnYZ {
  x = 1;
  z = 1;
}
```

- Use index type
  - Get the compiler to check code that uses dynamic property names.

```ts
interface ErrorContainer {
  id: string;
  [prop: string]: string;
}

// also

type ErrorContainer = {
  id: string;
  [prop: string]: string;
};

const errorBag: ErrorContainer = {
  id: '4dgf0x', // must be included
  email: 'Email invalid',
  password: 'Password invalid',
  username: 'Username invalid',
};
```

## Only type alias can:

- Describe the shape of primitives, unions, tuples and other non-object & non-function type

- But union type cannot be extended or implemented by class and interface which are considered static blueprints

```ts
type Name = string;

type PartialPointX = { x: number };
type PartialPointY = { y: number };
type PartialPoint = PartialPointX | PartialPointY;


// Class cannot implement union type
class SpecialPartialPoint implements PartialPoint {
...
}

type Date = [number, string];
```

- Use computed properties to generate mapped types
  - `interfaces` don't have implementation detail.

```ts
type Keys = 'firstName' | 'surname';

type DudeType = {
  [key in Keys]: string;
};

const test: DudeType = {
  firstName: 'Ethan',
  surname: 'Lee',
};
```

## Only interface can:

- Merge(augment) multiple declarations (will not throw error if you do - not good)

```ts
interface Point { x: number; }
.
.
.
//.. and some 500 lines below...
interface Point { z: number; }

// TS expect you to have both x and y in point
const point: Point = { z: number }; // Error - WAT?!!!?
```

## Use type alias for:

- Function signature
- Union type
- Computed Properties
- Utility types
  ```ts
  export type NonUndefined<A> = A extends undefined ? never : A;
  ```
- React state and props

## Use interface for:

- Object type literal
- Public API definition (library)

# TS interface vs class

## Interfaces

- Define a type for development and compilation. Don't persist into JS runtime.
- Can be **implemented** or **extended** ,but cannot be instantiated with `new`

### Use interfaces when you need to:

- Creating contract of the properties and function signatures for an object
- Delegate function implementation into other classes and objects
- Create type definition files to be used on an existing object

### Use classes when you need to:

- Create objects that have actual function code - implementation - in them (not just signature).
- Create instances of them with `new`
- Create simple data objects with initial default value.
- Use `instanceof` during runtime.

## References

- [SO - interface vs types](https://stackoverflow.com/a/52682220/13036807)
- [SO - interface vs classes ](https://stackoverflow.com/a/55505227/13036807)
- [Typescript interface vs. type](https://pawelgrzybek.com/typescript-interface-vs-type/)
- [TypeScript: type vs interface](https://dev.to/stereobooster/typescript-type-vs-interface-2n0c)
- [Typescript: Classes vs. Interfaces (J. Gage)](https://passionfordev.com/typescript-classes-vs-interfaces/)
- [TypeScript: Classes vs Interfaces (J. Henry)](https://jameshenry.blog/typescript-classes-vs-interfaces/)
