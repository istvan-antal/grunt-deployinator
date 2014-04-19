'use strict';

var grunt = require('grunt'),
    version = require('../lib/version.js');

exports.deployinator = {
    setUp: function(done) {
        // setup here if necessary
        done();
    },
    version: function(test) {
        test.equal(version.getNextTag('0.3'), '0.3.1');
        test.done();
    }/*,
    custom_options: function(test) {
        test.expect(1);

        var actual = grunt.file.read('tmp/custom_options');
        var expected = grunt.file.read('test/expected/custom_options');
        test.equal(actual, expected, 'should describe what the custom option(s) behavior is.');

        test.done()
    };*/
};
