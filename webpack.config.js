const path = require('path'); // core node module

module.exports = {
  mode: 'development',
  entry: './src/app.ts',
  output: {
    filename: 'bundle.js',
    // insert content-generated hash to prevent clients from using cached file.
    // filename: 'bundle.[contenthash].js'

    // webpack uses absolute path
    path: path.resolve(__dirname, 'dist'), // must match "outDir" in tsconfig
    publicPath: 'dist',
  },
  // ts-generated .map file is added as a DataUrl to the bundle
  // "sourceMap" : true is required in tsconfig
  devtool: 'inline-source-map',
  // tell webpack how to deal with files
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
    // check file name in import and look for files with the following extensions
    // For files with the same name, webpack will choose the one
    // with the extension appearing first in the list.
    extensions: ['.ts', '.js'], // now users can leave off hte extension when importing
  },
};
