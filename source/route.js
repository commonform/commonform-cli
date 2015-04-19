module.exports = function(stdin, stdout, stderr, env, opt) {
  if (opt['--version'] || opt['-v']) {
    return function(callback) {
      var meta = require('../package.json');
      stdout.write(meta.name + ' ' + meta.version + '\n');
      callback(0);
    };
  } else if (opt.hash) {
    return function(callback) {
      require('./read-form')(stdin, opt, function(error, form) {
        var normalized = require('commonform-normalize')(form);
        stdout.write(normalized.root + '\n');
        callback(0);
      });
    };
  } else if (opt.render) {
    return function(callback) {
      require('./read-form')(stdin, opt, function(error, form) {
        var format = opt['--format'];
        var transform = require('./transform-for-format')(format, opt);
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
      });
    };
  } else if (opt.lint) {
    return function(callback) {
      require('./read-form')(stdin, opt, function(error, form) {
        var issues = require('commonform-lint')(form);
        issues.forEach(function(issue) {
          stdout.write(issue.message + '\n');
        });
        callback(issues.length === 0 ? 0 : 1);
      });
    };
  } else {
    return undefined;
  }
};
