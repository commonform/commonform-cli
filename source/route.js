module.exports = function(stdin, stdout, stderr, env, opt) {
  if (opt['--version'] || opt['-v']) {
    return function(callback) {
      var meta = require('../package.json');
      stdout.write(meta.name + ' ' + meta.version + '\n');
      callback(0);
    };
  } else if (opt.read) {
    return function(callback) {
      var serialize = require('commonform-serialize');
      var concat = require('concat-stream');
      stdin.pipe(concat(function(buffer) {
        var input = buffer.toString();
        var form = serialize.parse(input);
        var format = opt['--format'];
        var transform = require('./transform-for-format')(format);
        if (typeof transform === 'function') {
          stdout.write(transform(form));
          callback(0);
        } else {
          stderr.write([
            '"' + format + '" is not a valid format.',
            'Valid formats are ' +
            require('english-list')('and', transform.map(function(s) {
              return '"' + s + '"';
            })) +
            '.'
          ].join('\n') + '\n');
          callback(1);
        }
      }));
    };
  } else {
    return undefined;
  }
};
