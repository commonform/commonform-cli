var concat = require('concat-stream');
var markup = require('commonform-markup');
var serialize = require('commonform-serialize');

module.exports = function() {
  process.stdin.pipe(concat(function(buffer) {
    process.stdout.write(
      markup.toMarkup(
        serialize.parse(
          buffer.toString()
        )
      )
    );
  }));
};
