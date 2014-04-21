var assert = require("assert");
var version = require('../lib/version.js');

describe('Version utilities', function () {
    it('should be able to handle partial version numbers', function () {
        assert.equal(version.getNextTag('0.3'), '0.3.1');
    });
});