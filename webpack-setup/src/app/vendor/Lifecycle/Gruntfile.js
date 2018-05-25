/**
 * Author : Ankit Anand
 * Version : base
 * Desc : plugin.js created to contain all internal plugin
 */
var babel = require('../node_modules/rollup-plugin-babel');
var nodeResolve = require('rollup-plugin-node-resolve');
var commonjs = require('rollup-plugin-commonjs');
var replace = require('rollup-plugin-replace');

module.exports = function(grunt) {


    var target = grunt.option('target');

    grunt.initConfig({
        env: {
            dev: {},
            test: {},
            stag: {}
        },
        rollup: {
            interfaces: {
                options: {
                    moduleName: "interfaces",
                    format: "iife",
                    plugins: function() {
                        return [
                            nodeResolve({ jsnext: true, main: true }),
                            commonjs(),
                            replace({
                                'process.env.NODE_ENV': JSON.stringify("production")
                            }),
                            babel({
                                exclude: '../node_modules/**'
                            })
                        ];
                    }
                },

                files: [{
                    'dest': 'src/j/interfaces.js',
                    'src': 'src/jass/interfaces.js'
                }]
            },
            lifecycle: {
                options: {
                    moduleName: "something",
                    format: "iife",
                    plugins: function() {
                        return [
                            nodeResolve({ jsnext: true, main: true, skip: ['react'] }),
                            commonjs(),
                            replace({
                                'process.env.NODE_ENV': JSON.stringify(target)
                            }),
                            babel({
                                exclude: './node_modules/**'
                            })
                        ];
                    },
                    globals: {
                        react: 'interfaces["Virtual"]',
                        reactDom: 'interfaces["VirtualDom"]'
                    }
                },
                files: [{
                    'dest': 'src/j/bundle.js',
                    'src': 'src/app/index.js'
                }]
            },
            build: {
                options: {
                    moduleName: "something",
                    format: "iife",
                    plugins: function() {
                        return [
                            nodeResolve({ jsnext: true, main: true }),
                            commonjs(),
                            replace({
                                'process.env.NODE_ENV': JSON.stringify(target)
                            }),
                            babel({
                                exclude: '../node_modules/**'
                            })
                        ];
                    }
                },
                files: [{
                    'dest': 'src/app/component/virtualcomponent/bundle.js',
                    'src': 'src/app/component/virtualcomponent/index.js'
                }, {
                    'dest': 'src/app/component/virtualcomponent/testcase/bundle.js',
                    'src': 'src/app/component/virtualcomponent/testcase/index.js'
                }, {
                    'dest': 'src/app/component/webcomponent/bundle.js',
                    'src': 'src/app/component/webcomponent/index.js'
                }, {
                    'dest': 'src/app/component/es6/bundle.js',
                    'src': 'src/app/component/es6/index.js'
                }]

            }
        },
        browserify: {
            interfaces: {
                files: {
                    'src/j/interfaces.js': 'src/j/interfaces.js'
                }
            },
            lifecycle: {
                files: {
                    'src/j/bundle.js': 'src/j/bundle.js'
                }
            },
            dist: {
                files: {
                    'src/app/component/virtualcomponent/bundle.js': 'src/app/component/virtualcomponent/bundle.js',
                    'src/app/component/virtualcomponent/testcase/bundle.js': 'src/app/component/virtualcomponent/testcase/bundle.js',
                    'src/app/component/webcomponent/bundle.js': 'src/app/component/webcomponent/bundle.js',
                    'src/app/component/es6/bundle.js': 'src/app/component/es6/bundle.js',
                }
            }
        },
        watch: {
            build: {
                files: ['src/**/*.js', "!src/j/**/*.js", "!src/app/**/bundle.js"],
                tasks: ["rollup", "browserify"]
            }
        }
    });

    grunt.file.expand('../node_modules/grunt-*/tasks').forEach(grunt.loadTasks);
    require('../node_modules/grunt-config-merge')(grunt);
    require('../grunt/global/grunt-lifecycle.js')(grunt);

    //grunt.registerTask('default', ["rollup", "browserify", "watch"]);
    
    grunt.registerTask('interfaces', ["rollup:interfaces", "browserify:interfaces"]);
    grunt.registerTask('lifecycle', ["rollup:lifecycle", "browserify:lifecycle"]);
    grunt.registerTask('default', ["lifecycle"]);

};
