var exec = require('child_process').exec,
    run = require('./command.js').run;

/* istanbul ignore next */
function createTag(tag, fn) {
    exec('git tag ' + tag, function(error/*, stdout, stderr*/) {
        if (error) {
            throw error;
        }

        fn();
    });
}

var increments = {
    "major": 0,
    "minor": 1,
    "patch": 2
};

function getNextTag(lastTag, increment) {
    var nextTag = parseVersionString(lastTag),
        i;

    if (!increment) {
        throw new Error('increment is required');
    }

    if (!increments.hasOwnProperty(increment)) {
        throw new Error('increment `' + increment + '` is invalid');
    }

    nextTag[increments[increment]] += 1;

    for (i = increments[increment] + 1; i < 3; i ++) {
        nextTag[i] = 0;
    }

    nextTag = nextTag.join('.');

    return nextTag;
}

function sortByVersion(versionList) {
    var versions = versionList.slice();

    versions.sort(compareVersions);

    return versions;
}

function compareVersions(a, b) {
    if (a === b) {
        return 0;
    }

    a = parseVersionString(a);
    b = parseVersionString(b);

    var i = 0;

    while (i < 2 && a[i] === b[i]) {
        i += 1;
    }

    return a[i] - b[i];
}

function parseVersionString(versionString) {
    var result = versionString.split('.'),
        i;

    result = result.map(function (value) {
        return parseInt(value, 10);
    });

    for (i = 0; i < 3; i ++) {
        if (!result[i]) {
            result[i] = 0;
        }
    }

    return result;
}

function extractLastTag(data) {
    var tags = sortByVersion(data.split("\n").filter(function(line) {
            return !!line;
        })),
        lastTag = '0.0.0';

    if (tags.length) {
        lastTag = tags[tags.length - 1];
    }

    return lastTag;
}

/* istanbul ignore next */
function fetchLastTag() {
    return run('git pull --tags').then(function () {
        return run('git tag -l').then(function (data) {
            return extractLastTag(String(data));
        });
    });
}

module.exports.createTag = createTag;
module.exports.fetchLastTag = fetchLastTag;
module.exports.getNextTag = getNextTag;
module.exports.extractLastTag = extractLastTag;
module.exports.compareVersions = compareVersions;