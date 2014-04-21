var exec = require('child_process').exec,
    Promise = require('promise'),
    version = require('./version.js');


function deployPull(options) {
    var host = options.host,
        directory = options.directory;

    function checkoutVersion(currentTag, done) {
        var command = "ssh " + host + " '";

        command += "cd " + directory + ';';
        command += "git fetch --tags;";
        command += "git checkout " + currentTag + ";";
        command += "npm install;";
        command += "grunt build";
        command += "'";

        exec(command, function(error, stdout/*, stderr*/) {
            if (error) {
                throw error;
            }

            done(stdout);
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

    return new Promise(function(resolve, reject) {
        tagRelease().then(function(currentTag) {
            pushTags(function() {
                checkoutVersion(currentTag, resolve);
            });
        });
    });
}

function tagRelease() {
    return new Promise(function(resolve, reject) {
        version.fetchLastTag(function(lastTag) {
            var currentTag = version.getNextTag(lastTag);

            version.createTag(currentTag, function() {
                resolve(currentTag);
            });
        });
    });
}

module.exports.deployPull = deployPull;
module.exports.tagRelease = tagRelease;