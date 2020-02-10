const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.config.js');
const buildFolder = path.join(__dirname, "build");
const MinifyPlugin = require('babel-minify-webpack-plugin');

module.exports = merge(common, {
   mode: 'production',

   devtool: "none",

   output: {
    path: buildFolder,
    filename: '[name].[contenthash].js',
  },

  plugins: [
    new MinifyPlugin()
  ]
 });