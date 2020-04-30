# Modules and Namespaces

## Splitting Code into Multiple Files

### Write codes in multiple `.ts` files

Typescript will compile all `.ts` files in `src/` directory and manually import compiled JS files into `index.html`.

- Have to manage all imports manually
- TS doesn't know about connection between files. So we'll lose some of ts features & support.
- Not great for bigger project

### Namespaces & File Bundling

- `namespace` is a ts feature that groups codes together under a namespace which then can be used to import / export codes between files.
- Per-file or bundled compilation is possible (less imports to manage)

### ES6 Imports / Exports

- Per-file compilation but single <script> import.
- Multiple js files need to be loaded (more request upfront)
- You can use bundling library (e.g. webpack) to bundle them together.
