module.exports = function (stdin, opt, callback) {
  var source = opt.FILE
    ? require('fs').createReadStream(opt.FILE)
    : stdin
  source.pipe(require('concat-stream')(function (buffer) {
    var input = buffer.toString()
    var transform = input.trim()[0] === '{'
      ? function (string) {
        return {form: require('commonform-serialize').parse(string)}
      }
      : function (string) {
        return require('commonform-markup-parse')(string)
      }
    callback(null, transform(input))
  }))
}
