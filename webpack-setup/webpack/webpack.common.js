const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const Autoprefixer = require("autoprefixer");
const dynamicRoutesConfig = require('./../src/app/root/dynamicRoutesPaths.js');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// var ManifestPlugin = require('webpack-manifest-plugin');
// const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');

const extractSass = new ExtractTextPlugin({
    /**
     * [filename Name of the result file. May contain [name], [id] and [contenthash]]
     * @type {String}
     */
    filename: './c/[name].[chunkhash].css',
    /**
     * [allChunks Extract from all additional chunks too
     *  (by default it extracts only from the initial chunk(s)) When using
     *  CommonsChunkPlugin and there are extracted chunks
     *  (from ExtractTextPlugin.extract) in the commons chunk, allChunks
     *  must be set to true]
     * @type {Boolean}
     */
    allChunks: true,
    disable: process.env.NODE_ENV === "development"
});

module.exports = {
    entry: {
        external: path.resolve(__dirname, './../src/app/vendor/external/index.js'),
        internal: path.resolve(__dirname, './../src/app/vendor/internal/index.js'),
        app: path.resolve(__dirname, './../src/app/index.js')
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader"
        }, {
            test: /\.scss$/,
            use: extractSass.extract({
                use: [{
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "sass-loader" // compiles Sass to CSS
                }, {
                    loader: "postcss-loader", // for autoprefixer
                    options: {
                        plugins: function () {
                            return [
                                new Autoprefixer({
                                    browsers: ['last 2 versions', '> 5%']
                                })
                            ];
                        }
                    }
                }]
            })
        }, {
            test: /\.svg$/,
            loader: 'svg-inline-loader'
        }, {
            test: /\.font\.js/,
            loader: ExtractTextPlugin.extract({
                use: [
                    'css-loader',
                    'webfonts-loader'
                ]
            })
        }]
    },
    plugins: [
        extractSass,
        new webpack.optimize.CommonsChunkPlugin({
            /**
             * [name description]
             * @type {String}
             */
            name: 'vendor',
            /**
                 * [minChunks // The minimum number of chunks which need to contain a module before it's moved into the commons chunk.
                              // The number must be greater than or equal 2 and lower than or equal to the number of chunks.
                              // Passing `Infinity` just creates the commons chunk, but moves no modules into it.
                              // By providing a `function` you can add custom logic. (Defaults to the number of chunks)]
                 * @type {number|Infinity|function(module, count) -> boolean}
                 */
            minChunks: 2
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            jquery: 'jquery'
        }),
        // new BundleAnalyzerPlugin()
    ],
    resolve: {
        /**
         * [alias Alias for dynamic chucks]
         * @type {[type]}
         */
        alias: dynamicRoutesConfig
    }
};
