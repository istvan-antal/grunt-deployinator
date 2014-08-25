var run = require("commandjs").run;

var tagPrefix = "tag: ",
    tagPrefixLength = tagPrefix.length;

function parseTags(tags) {
    if (!tags) {
        return [];
    }

    tags = tags.trim();
    return tags.
        substring(1, tags.length - 1).
        split(", ").
        filter(function (item) {
            return item.substr(0, tagPrefixLength) === tagPrefix;
        }).
        map(function (item) {
            return item.substr(tagPrefixLength);
        });
}

function fetchTagsForHead() {
    return run("git log --no-decorate --pretty='format:%d%x09' -n 1").then(function (data) {
        return parseTags(data.trim());
    });
}

module.exports.fetchTagsForHead = fetchTagsForHead;