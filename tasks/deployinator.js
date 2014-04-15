/*
 * grunt-deployinator
 * https://github.com/istvan-antal/grunt-deployinator
 *
 * Copyright (c) 2014 István Miklós Antal
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
    grunt.registerMultiTask('deployinator', 'Grunt plugin that deploys git repositories on remote servers.', function() {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options();
        
        if (!options.host || !options.directory) {
            grunt.fail.fatal('Please sepecify a host and directory.');
        }
        
        var exec = require('child_process').exec,
            done = this.async(),
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
            var currentTag = getNextTag(lastTag);
            
            exec('git tag ' + currentTag, function (error/*, stdout, stderr*/) {
                if (error) {
                    throw error;
                }
                
                pushTags(function () {
                    checkoutVersion(currentTag);
                });
            });
        }
            
        function getNextTag(lastTag) {
            var nextTag = lastTag.split('.');
            
            nextTag[2] = parseInt(nextTag[2], 10) + 1;
            nextTag = nextTag.join('.');
            
            return nextTag;
        }
        
        function fetchLastTag(fn) {
            exec('git tag -l', function (error, stdout/*, stderr*/) {
                if (error) {
                    throw error;
                }
                
                var tags = String(stdout).split("\n").filter(function (line) {
                        return !!line;
                    }).sort(),
                    lastTag = '0.0.0';
                
                if (tags.length) {
                    lastTag = tags[tags.length - 1];
                }
                
                fn(lastTag);
            });
        }
        
        fetchLastTag(tagVersion);
    });
};
