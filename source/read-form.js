module.exports = function(stdin, opt, callback) {
  stdin.pipe(require('concat-stream')(function(buffer) {
    var form = require('commonform-serialize').parse(buffer.toString());
    callback(null, form);
  }));
};
