var exec = require('child_process').exec;

function createTag(tag, fn) {
    exec('git tag ' + tag, function(error/*, stdout, stderr*/) {
        if (error) {
            throw error;
        }

        fn();
    });
}

function getNextTag(lastTag) {
    var nextTag = lastTag.split('.');

    nextTag[2] = parseInt(nextTag[2], 10) + 1;
    nextTag = nextTag.join('.');

    return nextTag;
}

function fetchLastTag(fn) {
    exec('git tag -l', function(error, stdout/*, stderr*/) {
        if (error) {
            throw error;
        }

        var tags = String(stdout).split("\n").filter(function(line) {
            return !!line;
        }).sort(),
                lastTag = '0.0.0';

        if (tags.length) {
            lastTag = tags[tags.length - 1];
        }

        fn(lastTag);
    });
}

module.exports.createTag = createTag;
module.exports.fetchLastTag = fetchLastTag;
module.exports.getNextTag = getNextTag;