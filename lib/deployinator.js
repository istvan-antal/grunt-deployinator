var exec = require('child_process').exec,
    Promise = require('promise'),
    version = require('./version.js');

function deployPush(options) {
    return tagRelease().then(function () {
        return pushToRemote(options.remote);
    });
}

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
    
    return new Promise(function(resolve, reject) {
        tagRelease().then(function(currentTag) {
            pushTags().then(function() {
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

function pushTags() {
    return new Promise(function(resolve, reject) {
        exec('git push --tags', function (error, stdout, stderr) {
            if (error) {
                return reject(error, stderr);
            }

            resolve(stdout);
        });
    });
}

function pushToRemote(remote) {
    return new Promise(function(resolve, reject) {
        exec('git push ' + remote, function (error, stdout, stderr) {
            if (error) {
                return reject(error, stderr);
            }

            resolve(stdout + stderr);
        });
    });
}

module.exports.deployPush = deployPush;
module.exports.deployPull = deployPull;
module.exports.tagRelease = tagRelease;