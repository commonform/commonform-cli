module.exports = function(stdin, opt, callback) {
  stdin.pipe(require('concat-stream')(function(buffer) {
    var input = buffer.toString();
    var transform = input.trim()[0] === '{' ?
      require('commonform-serialize') :
      require('commonform-markup');
    var form = transform.parse(input);
    callback(null, form);
  }));
};
