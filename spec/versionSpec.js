var version = require('../lib/version.js');

describe('Version utilities', function () {
    it('should be able to handle partial version numbers', function () {
        expect(version.getNextTag('0.3')).to.equal('0.3.1');
    });
});