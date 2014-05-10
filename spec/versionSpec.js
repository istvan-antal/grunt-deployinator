var version = require('../lib/version.js'),
    fs = require('fs');

describe('Version utilities', function () {

    it('should throw error if increment is missing', function () {
        expect(function () { version.getNextTag('0.3'); }).to.throw();
    });

    it('should throw error if increment is invalid', function () {
        expect(function () { version.getNextTag('0.3', 'foo'); }).to.throw();
    });

    it('should be able to handle full version numbers', function () {
        expect(version.getNextTag('0.2.1', 'patch')).to.equal('0.2.2');
        expect(version.getNextTag('0.2.1', 'minor')).to.equal('0.3.0');
        expect(version.getNextTag('0.2.1', 'major')).to.equal('1.0.0');
    });

    it('should be able to handle partial version numbers', function () {
        expect(version.getNextTag('0.3', 'patch')).to.equal('0.3.1');
        expect(version.getNextTag('0.3', 'minor')).to.equal('0.4.0');
        expect(version.getNextTag('0.3', 'major')).to.equal('1.0.0');
    });

    it('should be able to increment multi digit numbers', function () {
        expect(version.getNextTag('0.3.10', 'patch')).to.equal('0.3.11');
    });

    it('should return the last version number from an output', function () {
        var data = String(fs.readFileSync('spec/data/versionListOutput.txt'));

        expect(version.extractLastTag(data)).to.equal('0.3.11');
    });

    it('should return zeroes if output is empty', function () {
        expect(version.extractLastTag('')).to.equal('0.0.0');
    });

    it('should be able to increment multi digit numbers', function () {
        expect(version.compareVersions('0.3.10', '0.3.9')).to.be.above(0);
        expect(version.compareVersions('0.3', '0.3.2')).to.be.below(0);
        expect(version.compareVersions('0.3.0', '0.3.0')).to.equal(0);
        expect(version.compareVersions('0.3', '0.3.0')).to.equal(0);
    });
});
