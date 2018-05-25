const webpack = require('webpack');
const path = require('path');
const Merge = require('webpack-merge');
const CommonConfig = require('./webpack.common.js');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default
var ManifestPlugin = require('webpack-manifest-plugin');

module.exports = function(env) {
    console.log(env)
    const config = Merge(CommonConfig, {
        output: {
            /**
             * [filename Output file name with chuckHash]
             * @type {String}
             */
            filename: './j/[name].[chunkhash].js',
            /**
             * [chunkFilename: To define dynamic loaded chunk name, if not define then file "with id " generated.]
             * @type {String}
             */
            chunkFilename: './j/[name].[chunkhash].js',
            /**
             * [path relative path of directory]
             * @type {[type]}
             */
            path: path.resolve(__dirname, './../gen')
        },
        plugins: [
            new webpack.HashedModuleIdsPlugin(),
            new webpack.optimize.CommonsChunkPlugin({
                name: ['runtime']
            }),
            new UglifyJSPlugin(),
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('production')
                }
            }),
            new ManifestPlugin()
        ],
        module: {
            rules: [{
                test: /\.(png|jpg|gif|svg)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: "i/",
                        publicPath: "./../"
                    }
                }, {
                    loader: 'image-webpack-loader',
                    options: {
                        gifsicle: {
                            interlaced: false,
                        },
                        optipng: {
                            optimizationLevel: 7,
                        },
                        pngquant: {
                            quality: '65-90',
                            speed: 4
                        },
                        mozjpeg: {
                            progressive: true,
                            quality: 65
                        },
                        //Specifying webp here will create a WEBP version of your JPG/PNG images
                        webp: {
                            quality: 75
                        }
                    }
                }]
            }]
        }
    });
    return config;
}