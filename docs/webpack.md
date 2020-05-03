# Using Webpack with Typescript

## Problem with ES6 module

Thanks to ES6 module, we can use `import` and `export` syntax to split codebase into multiple files and still include one `app.js` file inside index.html. But we have a new problem where each imported files have to be downloaded separately. This can be a issue because each network request for downloading has a minimum overhead and with slow connection speed, this will drastically increase the overall time for your application to be downloaded and be ready for use.

## Webpack: Bundling and Tooling

Using webpack has the following advantages:

- Bundle all your files before shipping.
- Minify code for faster download
- Dev-server and many other build tools / steps

## Install and Important Dependencies

```bash
yarn add --dev webpack wepack-cli webpack-dev-server typescript ts-loader
```

### webpack

- Transpile TS to JS files
- Then emit a bundled JS file.

### webpack-cli

- Run webpack commands in the project

### webpack-dev-server

- Start a dev-server
- Watch files and compile automatically on change
- Hot-reload the page

### typescript

- Good practice to install typescript per project to lock-in a specific version of TS.
- Newer Typescript can introduce breaking change and if your project doesn't include a local typescript, your app will break.

### ts-loader

- Sits between typescript and webpack to compile ts files.

## Adding Configuration to Webpack

### Disable `rootDir` option from `tsconfig.json`

`tsconfig.json`

```js
{
  "compilerOptions": {
    "target": "ES6", // ES6 or ES5 depending on your browser support
    "module": "es2015",
    "outDir": "./dist" // don't need to change,
    // "rootDir": "./src" , webpack will take care of this
    "sourceMap": true // for debugging in devtool,
}
```

### Remove `.js` from all importing path

`app.js`

```ts
import { ProjectInput } from './components/project-input';
import { ProjectList } from './components/project-list';
import { ProjectStatus } from './models/project';
```

### Create & Configure `webpack.config.js`

[Webpack Configuration](https://webpack.js.org/configuration/)

```js
// note that this is a .js file

const path = require('path'); // core node module

module.exports = {
  // Set entry point
  entry: './src/app.ts',

  // Configure output
  output: {
    filename: 'bundle.js',
    // insert content-generated hash to prevent clients from using cached file.
    // filename: 'bundle.[contenthash].js'

    // output path - webpack uses absolute path
    path: path.resolve(__dirname, 'dist'), // must match "outDir" in tsconfig
  },

  // ts-generated .map file is added as a DataUrl to the bundle
  // "sourceMap" : true is required in tsconfig
  devtools: 'inline-source-map',

  // tell webpack how to deal with files to be used by dedicated modules
  module: {
    rules: [
      {
        test: /\.ts$/, // regex to test file format before applying rules
        use: 'ts-loader', // use ts-loader to handle .ts files
        exclude: /node_modules/, // don't go into node_modules folder
      },
    ],
  },
  // which file extensions to add to imports
  resolve: {
    // Check file names in import and look for files that have the following extensions.
    // For files with the same name, webpack will choose the one
    // with the extension appearing first in the list.
    extensions: ['.ts', '.js'], // now users can leave off hte extension when importing
  },
};
```

### Add build script to `package.json`

```js
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "lite-server",
    "build": "webpack" // <--- just add "webpack" to "build" option
  },
```

### Clear '/dist' folder and Run build

```bash
$ yarn run build
```

You can ignore the following warning

```
WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value. Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/configuration/mode/
```

Now inside `dist/bundle.js` you get this 👩‍🎤👩🏾‍🎨👨🏼‍🎤🎨🖌🖼

```js
!function(e){var t={};function n(r){if(t[r])return t[r].exports;var i=t[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default", ...
```

### Import `bundle.js` from your `index.html` and Run start

```html
<head>
  <script type="module" src="dist/bundle.js" defer></script>
</head>
```

```bash
$ yarn start
```

- Now the browser loads a single bundle.js file
- We can also debug the original ts source codes in devtool.
  - Sources > Page > webpack:// > ./src

## Adding webpack-dev-server

### publicPath

Webpack dev server by default, generates the bundle from the memory only and doesn't write the bundled file onto the disk. - `bundle.js` will only be outputted upon build.

In order for our dev server to pick up `/dist/bundle.js` properly (from the memory), you need to set `publicPath` to "dist" in webpack.config.js.

```js
module.exports = {
  entry: './src/app.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'), // must match "outDir" in tsconfig
    publicPath: 'dist' // resolved relative to the index.html
  },
```

### mode: 'development'

Add `mode` option to webpack.config and set to 'development' to enhance developing experience by

- applying fewer optimization -> easier debugging
- generating more meaningful error messages

```js
module.exports = {
  mode: 'development',
  entry: './src/app.ts',
  output: {
```

## Production Workflow

For production we want to prepare our code before uploading to the server.
For this, we typically use different workflow than in development and for that we need to configure `webpack.config.prod.js`.

- Change `mode` to "production"
- Remove `publicPath` option
- Add plugins

```js
const path = require('path');
const CleanPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'production', // apply code optimization
  entry: './src/app.ts',

  // applied per file
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    // publicPath: 'dist', // only for local server
  },
  devtool: 'none', // no dev tool needed for production
  module: {
    // applied per file
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  // added for production - applied per project
  plugins: [new CleanPlugin.CleanWebpackPlugin()],
};
```

### clean-webpack-plugin

Cleans up "dist" folder before building our project.

```bash
yarn add --dev clean-webpack-plugin
```

### Change "build" option in `package.json`

```json
{
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "webpack-dev-server",
    "build": "webpack --config webpack.config.prod.js"
  }
}
```

### Run build

```bash
$ yarn build
```

Now `bundle.js` file is created in "dist/" folder.

Put the bundled js file along with html and css file to the server to deploy your application.
