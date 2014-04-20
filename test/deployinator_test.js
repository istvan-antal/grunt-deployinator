var version = require('../lib/version.js');

exports.deployinator = {
    setUp: function(done) {
        // setup here if necessary
        done();
    },
    version: function(test) {
        test.equal(version.getNextTag('0.3'), '0.3.1');
        test.done();
    }
};
