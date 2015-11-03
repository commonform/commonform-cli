module.exports = function(stdin, opt, callback) {
  stdin.pipe(require('concat-stream')(function(buffer) {
    var input = buffer.toString()
    var transform = (
      input.trim()[0] === '{' ?
        require('commonform-serialize').parse :
        function(string) {
          return require('commonform-markup-parse')(string).form } )
    var form = transform(input)
    callback(null, form) })) }
