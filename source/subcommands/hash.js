var JSONStream = require('JSONStream');
var validate = require('commonform-validate');
var hash = require('commonform-hash');
var through = require('through2');

module.exports = function() {
  process.stdin
    .pipe(JSONStream.parse())
    .pipe(through.obj(function(object, encoding, callback) {
      console.error(object);
      var output = validate.form(object) ?
        hash.hash(object) + '\n' : 'Invalid form\n';
      callback(null, output);
    }))
    .pipe(process.stdout);
};
