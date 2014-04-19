/*
 * grunt-deployinator
 * https://github.com/istvan-antal/grunt-deployinator
 *
 * Copyright (c) 2014 István Miklós Antal
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
    var exec = require('child_process').exec,
        version = require('../lib/version.js');
    
    grunt.registerMultiTask('deployinator', 'Grunt plugin that deploys git repositories on remote servers.', function() {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options();
        
        if (!options.host || !options.directory) {
            grunt.fail.fatal('Please sepecify a host and directory.');
        }
        
        var done = this.async(),
            host =  options.host,
            directory =  options.directory;
            
        function checkoutVersion(currentTag) {
            var command = "ssh " + host + " '";
            
            command += "cd " + directory + ';';
            command += "git fetch --tags;";
            command += "git checkout " + currentTag + ";";
            command += "npm install;";
            command += "grunt build";
            command += "'";
            
            exec(command, function (error, stdout/*, stderr*/) {
                if (error) {
                    throw error;
                }
                
                grunt.log.writeln(stdout);
                
                done();
            });
        }
            
        function pushTags(fn) {
            exec('git push --tags', function (error/*, stdout, stderr*/) {
                if (error) {
                    throw error;
                }
                
                fn();
            });
        }
        
        function tagVersion(lastTag) {
            var currentTag = version.getNextTag(lastTag);
            
            version.createTag(currentTag, function () {
                pushTags(function () {
                    checkoutVersion(currentTag);
                });
            });
        }
        
        version.fetchLastTag(tagVersion);
    });
};
