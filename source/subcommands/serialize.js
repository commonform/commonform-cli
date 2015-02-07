var markup = require('commonform-markup');
var concat = require('concat-stream');
var serialize = require('commonform-serialize');

module.exports = function() {
  process.stdin.pipe(concat(function(buffer) {
    process.stdout.write(
      serialize.stringify(markup.parseLines(buffer.toString()))
    );
  }));
};
