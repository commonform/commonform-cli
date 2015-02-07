var concat = require('concat-stream');
var lint = require('commonform-lint');
var serialize = require('commonform-serialize');

var humanize = function(object) {
  return Object.keys(object).map(function(key) {
    return key + ': ' + object[key];
  }).join(', ');
};

module.exports = function() {
  process.stdin.pipe(concat(function(buffer) {
    var project = serialize.parse(buffer.toString());
    var errors = lint(project);
    if (errors.length > 0) {
      errors.forEach(function(error) {
        process.stderr.write(error.rule + ' (');
        process.stderr.write(humanize(error.info) + ')\n');
      });
      process.exit(0);
    } else {
      process.stdout.write('No errors\n');
      process.exit(0);
    }
  }));
};
