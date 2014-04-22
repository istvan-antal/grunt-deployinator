var exec = require('child_process').exec,
    Promise = require('promise'),
    version = require('./version.js');

function deployPush(options) {
    return tagRelease().then(function () {
        return pushToRemote(options.remote);
    });
}

function deployPull(options) {
    return tagRelease().then(function(currentTag) {
        return pushTags().then(function() {
            return checkoutOnRemote(currentTag, options);
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
    return runCommand('git push --tags');
}

function pushToRemote(remote) {
    return runCommand('git push ' + remote);
}

function checkoutOnRemote(currentTag, options) {
    var command = "ssh " + options.host + " '";

    command += "cd " + options.directory + ';';
    command += "git fetch --tags;";
    command += "git checkout " + currentTag + ";";
    command += "npm install;";
    command += "grunt build";
    command += "'";

    return runCommand(command);
}

function runCommand(command) {
    return new Promise(function(resolve, reject) {
        exec(command, function (error, stdout, stderr) {
            if (error) {
                return reject(error);
            }

            resolve(stdout + stderr);
        });
    });
}

module.exports.deployPush = deployPush;
module.exports.deployPull = deployPull;
module.exports.tagRelease = tagRelease;