const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.config.js');
const buildFolder = path.join(__dirname, "build");

module.exports = merge(common, {
   mode: 'development',

   devtool: "none",

   output: {
    path: buildFolder,
    filename: '[name].bundle.js',
  },

  plugins: [
  ]
 });