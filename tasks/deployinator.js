/*
 * grunt-deployinator
 * https://github.com/istvan-antal/grunt-deployinator
 *
 * Copyright (c) 2014 István Miklós Antal
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
    var deployinator = require('../lib/deployinator.js');

    function deploySetup(options) {
        var pkg = grunt.file.readJSON('package.json');

        options.package = pkg;

        if (!pkg.repository ||
            !pkg.repository.type ||
            pkg.repository.type !== 'git' ||
            !pkg.repository.url) {
            grunt.fail.fatal('Please sepecify the repository in the package.json');
        }

        return deployinator.deploySetup(options);
    }

    grunt.registerMultiTask('deployPull',
        'SSH into a server and do a pull', function() {
        var options = this.options();
        var done = this.async();

        if (!options.host || !options.directory) {
            grunt.fail.fatal('Please sepecify a host and directory.');
        }

        if (grunt.option('setup')) {
            return deploySetup(options).then(function (output) {
                grunt.log.writeln(output);
                done();
            }, function (error) {
                grunt.fail.fatal('Error encountered during setup: ' + error);
            });
        }

        options.increment = getVersionIncrement();

        deployinator.deployPull(options).then(function (output) {
            grunt.log.writeln(output);
            done();
        }, function (error) {
            grunt.fail.fatal('Error encountered during deploy: ' + error);
        });
    });

    grunt.registerMultiTask('deployPush',
        'Push to a server to deploy', function() {
        var options = this.options();
        options.increment = getVersionIncrement();

        if (!options.remote) {
            grunt.fail.fatal('Please sepecify a remote.');
        }

        var done = this.async();

        deployinator.deployPush(options).then(function (output) {
            grunt.log.writeln(output);
            done();
        }, function (error) {
            grunt.fail.fatal('Error encountered during deploy: ' + error);
        });
    });

    grunt.registerMultiTask('npmDeploy',
        'Publish an NPM module', function() {

        var done = this.async();

        //TODO
        deployinator.npmDeploy().then(function (output) {
            grunt.log.writeln(output);
            done();
        });
    });

    grunt.registerTask('tagRelease',
        'Creates a git tag for the release.', function() {

        var done = this.async(),
            options = this.options();

        options.increment = getVersionIncrement();

        deployinator.tagRelease(options).then(done, function (error) {
            grunt.fail.fatal('Error encountered during deploy: ' + error);
        });
    });

    function getVersionIncrement() {
        if (grunt.option('majorRelease')) {
            return 'major';
        }

        if (grunt.option('release')) {
            return 'minor';
        }

        return 'patch';
    }
};