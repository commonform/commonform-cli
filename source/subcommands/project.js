var fs = require('fs');
var concat = require('concat-stream');
var merge = require('util-merge');
var serialize = require('commonform-serialize');
var validate = require('commonform-validate');

var read = function(path) {
  return JSON.parse(fs.readFileSync(fs.realpathSync(path)));
};

var PROJECT_TEMPLATE = {
  commonform: validate.version,
  preferences: {},
  metadata: {},
  values: {},
  form: {}
};

module.exports = function(options) {
  process.stdin.pipe(concat(function(buffer) {
    var form = serialize.parse(buffer.toString());
    var project = merge(
      PROJECT_TEMPLATE,
      {
        metadata: {title: options['<title>']} ,
        preferences: options['--prefs'] ?
          read(options['--prefs']) : {},
        values: options['--fields'] ?
          read(options['--fields']) : {},
        form: form
      }
    );
    process.stdout.write(JSON.stringify(project));
    process.exit(0);
  }));
};
