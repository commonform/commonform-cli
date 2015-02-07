var concat = require('concat-stream');
var docx = require('commonform-docx');

module.exports = function() {
  process.stdin.pipe(concat(function(input) {
    var project = JSON.parse(input.toString());
    var zip = docx(project);
    var buffer = zip.generate({type:'nodebuffer'});
    process.stdout.write(buffer);
  }));
};
