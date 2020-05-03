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
