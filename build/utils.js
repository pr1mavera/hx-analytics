const { join } = require('path');
const fs = require('fs');

exports.resolveFile = path => {
    return join(__dirname, '..', path);
};

exports.deleteall = path => {
    var files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(file => {
            var curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) { // recurse
                deleteall(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

exports.blue = str => '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m';

exports.getSize = code => (code.length / 1024).toFixed(2) + 'kb';
