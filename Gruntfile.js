/*
 * grunt-deployinator
 * https://github.com/istvan-antal/grunt-deployinator
 *
 * Copyright (c) 2014 István Miklós Antal
 * Licensed under the MIT license.
 */
module.exports = function (grunt) {
    'use strict';
    var jsHintOptions;
    
    jsHintOptions = {
        bitwise: true,
        curly: true,
        camelcase: true,
        eqeqeq: true,
        freeze: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        forin: true,
        sub: true,
        undef: true,
        unused: true,
        noempty: true,
        boss: false,
        eqnull: true,
        browser: true,
        indent: 4,
        maxcomplexity: 7,
        maxstatements: 36,
        maxparams: 5,
        maxdepth: 3,
        maxlen: 100,
        trailing: true,
        maxerr: 5,
        globals: {
            module: true,
            require: true,
            exports: true,
            grunt: true
        }
    };
    
    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>',
            ],
            options: jsHintOptions,
        },
        nodeunit: {
            tests: ['test/*_test.js'],
        },
        mochaTest: {
            unit: {
                options: {
                    reporter: 'spec'
                },
                src: ['spec/*.js']
            }
        }
    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-mocha-test');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['nodeunit', 'mochaTest']);
    grunt.registerTask('check', ['jshint', 'test']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);
};
