var exec = require('child_process').exec,
    Promise = require('promise');

function run(command) {
    return new Promise(function(resolve, reject) {
        exec(command, function (error, stdout, stderr) {
            if (error) {
                return reject(error);
            }

            resolve(stdout + stderr);
        });
    });
}

module.exports.run = run;
