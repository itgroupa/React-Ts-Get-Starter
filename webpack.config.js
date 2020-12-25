const settings = require('./src/settings');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const JSONMinifyPlugin = require('node-json-minify');
const workboxPlugin = require('workbox-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const uuid = require('uuid');
const fs = require('fs');

const buildFolder = path.join(__dirname, 'build');

const getPlugins = (build) => {
    let version = uuid.v4();
    if (!fs.existsSync(path.join(buildFolder))) {
        fs.mkdirSync(buildFolder, 0o744);
    }
    console.log(settings);
    fs.writeFileSync(path.join(buildFolder, settings.SW_VERSION_NAME), `{"version": "${version}"}`, {encoding:'utf8',flag:'w'});

    let result = [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            templateParameters: {
                'basePath': '',
            },
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: './public/manifest.json',
                    transform: function(content) {
                        return JSONMinifyPlugin(content.toString());
                    },
                    to: buildFolder
                },
            ]
        })
    ];

    //minifications
    if (build !== 'local') {
        result.push(new workboxPlugin.GenerateSW({
            swDest: settings.SW_FILE_NAME,
            clientsClaim: true,
            skipWaiting: true,
          }));
        result.push(new webpack.DefinePlugin({
            '__REACT_DEVTOOLS_GLOBAL_HOOK__': '({ isDisabled: true })'
          }));
        result.push(new CompressionPlugin({
            test: /\.js(\?.*)?$/i,
          }));
        result.push(
            new TerserPlugin()
        );
    }

    //replace file
    if (build !== 'local') {
        result.push(
            new webpack.NormalModuleReplacementPlugin(
                /environment.ts/,
                `environment.${build}.ts`
            )
        );
    }
    return result;
}

const getFileNames = (build) => build === 'local' ? '[name].bundle.js' : '[name].[contenthash].bundle.js';
const getDevTools = (build) => build === 'local' ? 'source-map' : 'none';
const getMode = (build) => build === 'local' ? 'development' : 'production';

module.exports = env => {
    const build = env.build;
    return {
        mode: getMode(build),

        entry: {
            polyfills: './src/polyfills.js',
            index: './src/index.tsx',
        },

        output: {
            path: buildFolder,
            filename: getFileNames(build),
            publicPath: build === 'beta' ? '/admin' : '/'
        },

        devtool: getDevTools(build),


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
                    test: /\.sass$/,
                    use: ['style-loader', 'css-loader', 'sass-loader']
                },
            ]
        },
        plugins: getPlugins(build),

        devServer: {
            contentBase: path.join(__dirname, 'build'),
            compress: false,
            clientLogLevel: 'none',
            historyApiFallback: true,
            watchContentBase: true
        }
    };
};
