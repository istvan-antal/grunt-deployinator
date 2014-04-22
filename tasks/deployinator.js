/*
 * grunt-deployinator
 * https://github.com/istvan-antal/grunt-deployinator
 *
 * Copyright (c) 2014 István Miklós Antal
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
    var deployinator = require('../lib/deployinator.js');
    
    grunt.registerMultiTask('deployPull',
        'SSH into a server and do a pull', function() {
        var options = this.options();
        
        if (!options.host || !options.directory) {
            grunt.fail.fatal('Please sepecify a host and directory.');
        }
        
        var done = this.async();
        
        deployinator.deployPull(options).then(function (output) {
            grunt.log.writeln(output);
            done();
        });
    });
    
    grunt.registerMultiTask('deployPush',
        'Push to a server to deploy', function() {
        var options = this.options();
        
        if (!options.remote) {
            grunt.fail.fatal('Please sepecify a remote.');
        }
        
        var done = this.async();
        
        deployinator.deployPush(options).then(function (output) {
            grunt.log.writeln(output);
            done();
        });
    });
    
    grunt.registerTask('tagRelease',
        'Creates a git tag for the release.', function() {
        
        var done = this.async();
        
        deployinator.tagRelease().then(done);
    });
};