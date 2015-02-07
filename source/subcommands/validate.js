var validate = require('commonform-validate');
var serialize = require('commonform-serialize');
var concat = require('concat-stream');

module.exports = function() {
  process.stdin.pipe(concat(function(buffer) {
    if (validate.nestedForm(serialize.parse(buffer.toString()))) {
      process.stdout.write(
        'Valid form' +
        ' (Common Form version ' + validate.version + ')' +
        '\n'
      );
      process.exit(0);
    } else {
      process.stderr.write(
        'Invalid form' +
        ' (Common Form version ' + validate.version + ')' +
        '\n'
      );
      process.exit(1);
    }
  }));
};
