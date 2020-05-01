# Modules and Namespaces

Splitting Code into Multiple Files

## Write codes in multiple `.ts` files

Typescript will compile all `.ts` files in `src/` directory and manually import compiled JS files into `index.html`.

- Have to manage all imports manually
- TS doesn't know about connection between files. So we'll lose some of ts features & support.
- Not great for bigger project

## Namespaces

Use `namespace` when you need to split declarations (functions, classes, interfaces, ...) across multiple fils.

- Exported declarations (functions, classes, interfaces, types, variables...) inside `namespace` can be accessed from outside using the specified name.

```ts
namespace Interface {
  // without export, declarations are not accessible from referencing files
  export interface Draggable {
    handleDragStart(e: DragEvent): void;
    handleDragEnd(e: DragEvent): void;
  }

  export interface DragTarget {
    handleDragOver(e: DragEvent): void;
    handleDrop(e: DragEvent): void;
    handleDragLeave(e: DragEvent): void;
  }
}
```

- Namespaces allow you to export declarations from multiple files into the same object which can then be accessed via global namespace in the referencing files.

`src/conversions.ts`

```ts
namespace Utils {
  export function toCelsius(fah: number): number {
    return (fah - 32) * 0.556;
  }
  export function toFahrenheit(cel: number): number {
    return cel * 1.8 + 32;
  }
}
```

`src/formats.ts`

```ts
namespace Utils {
  export function formatCelsius(cel: number): string {
    return cel.toFixed(1) + '°C';
  }
  export function formatFahrenheit(cel: number): string {
    return cel.toFixed(1) + '°F';
  }
}
```

`src/app.ts`

```ts
/* interface declarations */
/// <reference path="drag-drop-interfaces.ts" />

/* class & other declarations related to Project(enums,...) */
/// <reference path="project-model.ts" />

/* namespace - Util  */
/// <reference path="conversions.ts" />
/// <reference path="formats.ts" />

// Utils is now available in global namespace
const a = Utils.formatCelsius(Utils.toCelsius(98));
const b = Utils.formatFahrenheit(Utils.toFahrenheit(36.5));
console.log(a, b); // 36.7°C 97.7°F
```

- Codes in multiple files can be accessed within the `namespace` name from the referencing file.
  `src/interfaces.ts`

```ts
namespace App {
  export interface Draggable {
    handleDragStart(e: DragEvent): void;
    handleDragEnd(e: DragEvent): void;
  }

  export interface DragTarget {
    handleDragOver(e: DragEvent): void;
    handleDrop(e: DragEvent): void;
    handleDragLeave(e: DragEvent): void;
  }
}
```

`src/app.ts`

```ts
/// <reference path="interfaces.ts" />

namespace App {
  // Draggable and FragTarget are directly accessible here

```

References

- [Namespaces and Modules](https://www.typescriptlang.org/docs/handbook/namespaces-and-modules.html#using-namespaces)
- [Is typescript Namespace feature deprecated?](https://michelenasti.com/2019/01/23/is-typescript-namespace-feature-deprecated.html)

### Triple Slash Directives

- Triple-slash directives are only valid at the top of their containing file.
- A triple-slash directive can only be preceded by single or multi-line comments, including other triple-slash directives. (ignored otherwise)
- They also serve as a method to **order the output** when using --out or --outFile. Files are emitted to the output file location in the same order as the input after preprocessing pass

* [Triple-Slash Directives](https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html)
* [How do I use namespaces with TypeScript external modules?](https://stackoverflow.com/a/30357635/13036807)

## File Bundling

### Per-file compilation(default)

- Each `.ts` file is transpiled into `.js` file inside `src` folder.
- Without TS `outFile` option, you have to manually import each transpiled .js file into `index.html` **while paying attention to the reference orders**.

```html
<head>
  ...
  <!-- namespace files must be imported before referencing files (Namespaces are plain JS objects) -->
  <script src="dist/conversions.js" defer></script>
  <script src="dist/formats.js" defer></script>
  <!--  main -->
  <script src="dist/app.js" defer></script>
  <!-- this file is empty - interfaces don't get compiled into js! -->
  <script src="dist/drag-drop-interfaces.js" defer></script>
  <!-- this works because Project gets instantiated by user after the loading-->
  <script src="dist/project-model.js" defer></script>
</head>
```

### Bundled compilation:

- All `/src/*.ts` files are bundled into one file -> less imports to manage
- Need to set `module` and `outFile` options in `tsconfig.json` file:

```json
  {
    "compilerOptions": {
      ...
      // Only 'amd' and 'system' modules are supported alongside --outFile.
      "module": "amd",
      ...
      "outFile": "./dist/bundle.js",
      ...
    }
  }
```

### `outFile` concatenation order

> Concatenate and emit output to single file. The order of concatenation is determined by the list of files passed to the compiler on the command line along with **triple-slash references and imports**. (ts doc)

Preprocessing input files

- The compiler performs a preprocessing pass on input files to resolve all triple-slash reference directives. During this process, additional files are added to the compilation.

  - The process starts with a set of root files; these are the file names specified on the command-line or in the "files" list in the tsconfig.json file. (files inside `/src` folder)
  - These root files are preprocessed in the same order they are specified.
  - Before a file is added to the list, all triple-slash references in it are processed, and their targets included.
  - Triple-slash references are resolved in a depth first manner, **in the order they have been seen in the file**.

- A triple-slash reference path is resolved relative to the containing file, if unrooted.

- [How do I control file ordering in combined output (--out)?](https://github.com/Microsoft/TypeScript/wiki/FAQ#how-do-i-control-file-ordering-in-combined-output---out)

### A Problem with Namespace Imports

TS will not warn as long as we reference all the files that are needed for **compile time**. If the program needs any unreferenced file during the runtime, our app will break.

We must reference all the files needed for **build & run time** in each individual file.

`src/components/project-input.ts`

```ts
/// <reference path="./base-component.ts" />
/// <reference path="../decorators/autobind.ts" />
/// <reference path="../util/validation.ts" />
/// <reference path="../state/project-state.ts" />

namespace App {
  export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    ...
```

Then in `app.ts`, you can reference only the files that are needed for the compile time.
`/src/app.ts`

```ts
/// <reference path="components/project-input.ts" />
/// <reference path="components/project-list.ts" />

namespace App {
  // Instantiate to render
  new ProjectInput();
  new ProjectList('active');
  new ProjectList('completed');
}
```

But still, you can delete any references that are only needed during the runtime, and TS will not throw any warnings. This is why **we should use ES6 module for importing dependencies**.

## ES6 Imports / Exports

- Per-file compilation but single <script> import.
- Multiple js files need to be loaded (more request upfront)
- You can use bundling library (e.g. webpack) to bundle them together.

* "models" describe how their actual implementations will look like.
