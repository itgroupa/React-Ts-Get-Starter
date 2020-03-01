const path = require('path');
const webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MinifyPlugin = require('babel-minify-webpack-plugin');

const fs = require('fs');

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
        /*result.push(
            new webpack.NormalModuleReplacementPlugin(/\.ts$/, function (res) {
                if (res.request.endsWith('environment.ts')) {
                    const file_for_replace = resource.request.replace(/environment.ts/, 'environment.mock.ts');
                    if (fs.existsSync(path.resolve(resource.context, file_for_replace))) {
                        resource.request = file_for_replace;
                    }
                }
                if (res.request.endsWith('environment.ts')) {
                    const file_for_replace = resource.request.replace(/web-api-http.service.ts/, 'mock-web-api-http.service.ts');
                    if (fs.existsSync(path.resolve(resource.context, file_for_replace))) {
                        resource.request = file_for_replace;
                    }
                }
                if (res.request.endsWith('environment.ts')) {
                    const file_for_replace = resource.request.replace(/web-socket.service.ts/, 'mock-web-socket.service.ts');
                    if (fs.existsSync(path.resolve(resource.context, file_for_replace))) {
                        resource.request = file_for_replace;
                    }
                }
            })
        );*/
        result.push(
            new webpack.NormalModuleReplacementPlugin(
                /environment.ts/,
                'environment.mock.ts'
            )
        );
        result.push(
            new webpack.NormalModuleReplacementPlugin(
                /web-api-http.service.ts/,
                'mock-web-api-http.service.ts'
            )
        );
        result.push(
            new webpack.NormalModuleReplacementPlugin(
                /web-socket.service.ts/,
                'mock-web-socket.service.ts'
            )
        );
    } else if (dev) {
        result.push(
            new webpack.NormalModuleReplacementPlugin(
                /environment.ts/,
                'environment.dev.ts'
            )
        );
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
