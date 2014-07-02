var Promise = require('promise'),
    run = require('commandjs').run,
    version = require('./version.js');

function deploySetup(options) {
    var commands;

    commands = [
        "mkdir -p " + options.directory,
        'cd ' + options.directory,
        "git clone " + options.package.repository.url + ' .'
    ];

    if (options.buildCommands) {
        commands = commands.concat(options.buildCommands);
    }

    return run("ssh " + options.host + " '" + commands.join(';') + "'");
}

function deployPush(options) {
    return tagRelease(options).then(function () {
        return pushToRemote(options.remote);
    });
}

function deployPull(options) {
    return tagRelease(options).then(function(currentTag) {
        return pushBranch().then(function () {
            return pushTags();
        }).then(function() {
            return checkoutOnRemote(currentTag, options);
        });
    });
}

function tagRelease(options) {
    return new Promise(function(resolve, reject) {
        version.fetchLastTag().then(function(lastTag) {
            var currentTag = version.getNextTag(lastTag, options.increment);

            version.createTag(currentTag, function() {
                resolve(currentTag);
            }, reject);
        });
    });
}

function pushTags() {
    return run('git push --tags');
}

function pushBranch() {
    return run('git push');
}

function pushToRemote(remote) {
    return run('git push ' + remote);
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

    return run("ssh " + options.host + " '" + commands.join(';') + "'");
}

module.exports.deploySetup = deploySetup;
module.exports.deployPush = deployPush;
module.exports.deployPull = deployPull;
module.exports.tagRelease = tagRelease;
