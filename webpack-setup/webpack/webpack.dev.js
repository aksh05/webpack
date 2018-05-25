const webpack = require('webpack');
const path = require('path');
const Merge = require('webpack-merge');
const CommonConfig = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = function(env) {
    console.log(env)
    return Merge(CommonConfig, {
        output: {
            /**
             * [filename Output file name with chuckHash]
             * @type {String}
             */
            filename: './j/[name].js',
            /**
             * [chunkFilename: To define dynamic loaded chunk name, if not define then file "with id " generated.]
             * @type {String}
             */
            chunkFilename: './j/[name].js',
            /**
             * [path relative path of directory]
             * @type {[type]}
             */
            path: path.resolve(__dirname, './../dist'),
        },

        // devtool: 'cheap-module-source-map',
        devServer: {
            /**
             * [contentBase description]
             * @type {[type]}
             */
            contentBase: path.join(__dirname, "./../dist"),
            /**
             * [compress description]
             * @type {Boolean}
             */
            compress: true,
            /**
             * [port description]
             * @type {Number}
             */
            port: 9000,
            /**
             * [stats description]
             * @type {String}
             */
            stats: "errors-only",
            /**
             * [historyApiFallback: To tell webpack dev server to serve index.html for any route]
             * @type {Boolean}
             */
            historyApiFallback: true
        },
        plugins: [new HtmlWebpackPlugin({
                title: "test template",
                template: "./src/index.html",
                fileName: "./../../index.html", // not working need to check,
                /**
                 * [chunksSortMode description]
                 * @param  {[type]} chunk1 [description]
                 * @param  {[type]} chunk2 [description]
                 * @return {[type]}        [description]
                 */
                chunksSortMode: function(chunk1, chunk2) {
                    var order = ['runtime', 'vendor', 'external', 'internal', 'app'];
                    var order1 = order.indexOf(chunk1.names[0]);
                    var order2 = order.indexOf(chunk2.names[0]);
                    return order1 - order2;
                },
                // inject: 'body',
                // excludeChunks: ['tracking', 'text']
                // hash: true,
            }),
            /**
             * [CleanWebpackPlugin description]
             * @type {[type]}
             */
            new CleanWebpackPlugin(['dist'], {
                /**
                 * [root: Need of root path because dist folder is one lever up to webpack folder]
                 * @type {[type]}
                 */
                root: path.join(__dirname, "./../")
            }),

            /**
             * To pass environment variable inside the code.
             */
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('dev')
                }
            })
        ],
        module: {
            rules: [{
                test: /\.(png|jpg|gif)$/,
                use: [{
                    loader: "file-loader",
                    options: {
                        name: '[name].[ext]',
                        outputPath: "i/",
                        publicPath: "./../"
                    }
                }]
            }]
        }
    })
}