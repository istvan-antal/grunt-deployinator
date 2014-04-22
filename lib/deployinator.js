var exec = require('child_process').exec,
    Promise = require('promise'),
    version = require('./version.js');

function deployPush(options) {
    return tagRelease(options).then(function () {
        return pushToRemote(options.remote);
    });
}

function deployPull(options) {
    return tagRelease(options).then(function(currentTag) {
        return pushTags().then(function() {
            return checkoutOnRemote(currentTag, options);
        });
    });
}

function tagRelease(options) {
    return new Promise(function(resolve, reject) {
        version.fetchLastTag(function(lastTag) {
            var currentTag = version.getNextTag(lastTag, options.increment);

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
    var commands;

    commands = [
        "cd " + options.directory,
        "git fetch --tags",
        "git checkout " + currentTag
    ];
    
    if (options.buildCommands) {
        commands = commands.concat(options.buildCommands);
    }

    return runCommand("ssh " + options.host + " '" + commands.join(';') + "'");
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