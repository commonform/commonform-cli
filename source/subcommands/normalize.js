var JSONStream = require('JSONStream');
var normalize = require('commonform-normalize');
var through = require('through2');

module.exports = function() {
  process.stdin
    .pipe(JSONStream.parse())
    .pipe(through.obj(function(object, encoding, callback) {
      callback(null, JSON.stringify(normalize(object)));
    }))
    .pipe(process.stdout);
};
