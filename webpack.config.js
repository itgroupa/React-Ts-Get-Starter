const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const buildFolder = path.join(__dirname, "build");
const buildAssetsFolder = path.join(buildFolder, "assets");

module.exports = {
  mode: "development",

  entry: {
    polyfills: './src/polyfills.js',
    index: "./src/index.tsx"
  },

  output: {
    path: buildFolder,
    filename: '[name].bundle.js',
  },

  devtool: "source-map",

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader"
          }
        ]
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html"
    }),
    new CopyPlugin([
      { from: './public/assets', to:  buildAssetsFolder},
    ]),
  ],
  devServer: {
    contentBase: path.join(__dirname, "build"),
    compress: true,
    port: 8080,
    clientLogLevel: "none",
    historyApiFallback: true,
    watchContentBase: true
  }
};