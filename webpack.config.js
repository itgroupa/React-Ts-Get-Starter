const path = require('path');
const webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MinifyPlugin = require('babel-minify-webpack-plugin');

const buildFolder = path.join(__dirname, 'build');
const buildAssetsFolder = path.join(buildFolder, 'assets');

const getPlugins = (dev, mock) => {
    //basicly
    let result = [
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
        new CopyPlugin([
            {from: './public/assets', to: buildAssetsFolder},
        ]),
    ];

    //minifications
    if (!dev) {
        result.push(
            new MinifyPlugin()
        )
    }

    //replace file
    if (mock) {
        result.push(
            new webpack.NormalModuleReplacementPlugin(
                /environment.ts/,
                'environment.mock.ts'
            )
        )
    } else if (dev) {
        result.push(
            new webpack.NormalModuleReplacementPlugin(
                /environment.ts/,
                'environment.dev.ts'
            )
        )
    }
    return result;
}

const getFileNames = (dev) => dev ? '[name].bundle.js' : '[name].[contenthash].bundle.js';
const getDevTools = (dev) => dev ? 'source-map' : 'none';
const getMode = (dev) => dev ? 'development' : 'production';

module.exports = env => {

    let mock = env.mock === 'true';
    let dev = env.dev === 'true';

    console.log(`dev mode = ${dev}`);
    console.log(`mock mode = ${mock}`);

    return {
        mode: getMode(dev),

        entry: {
            polyfills: './src/polyfills.js',
            index: './src/index.tsx',
        },

        output: {
            path: buildFolder,
            filename: getFileNames(dev),
        },

        devtool: getDevTools(dev),


        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.json']
        },


        module: {

            rules: [
                {
                    test: /\.ts(x?)$/,
                    use: [
                        {
                            loader: 'ts-loader'
                        }
                    ]
                },
                {
                    test: /\.scss$/,
                    use: ['style-loader', 'css-loader', 'sass-loader']
                },
            ]
        },
        plugins: getPlugins(dev, mock),

        devServer: {
            contentBase: path.join(__dirname, 'build'),
            compress: true,
            port: 8080,
            clientLogLevel: 'none',
            historyApiFallback: true,
            watchContentBase: true
        }
    };
};
