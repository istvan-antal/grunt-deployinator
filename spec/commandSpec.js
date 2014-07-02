var command = require('commandjs');

describe('Command utilities', function () {

    it('should resolve for a successful command', function (done) {
        command.run('pwd').then(function () {
            done();
        }, function () {
            done(true);
        });
    });

    it('should reject for an unsuccessful command', function (done) {
        command.run('non0existing-command').then(function () {
            done(true);
        }, function () {
            done();
        });
    });
});
