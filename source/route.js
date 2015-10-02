var analyses = [
  'blanks', 'definitions', 'headings', 'references', 'uses'
];

module.exports = function(stdin, stdout, stderr, env, opt) {
  var analysis = require('array-find')(analyses, function(analysis) {
    return opt.hasOwnProperty(analysis) && opt[analysis];
  });
  if (analysis) {
    return function(callback) {
      require('./read-form')(stdin, opt, function(error, form) {
        var analysed = require('commonform-analyze')(form);
        Object.keys(analysed[analysis])
          .sort()
          .forEach(function(element) {
            stdout.write(element + '\n');
          });
        callback(0);
      });
    };
  } else if (opt['--version'] || opt['-v']) {
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
      var numberStyle = opt['--number'];
      var styles = require('./numberings');
      if (!styles.hasOwnProperty(numberStyle)) {
        stderr.write([
          '"' + numberStyle + '" is not a valid numbering style.',
          'Valid styles are ' +
          require('english-list')(
            'and',
            Object.keys(styles).map(function(s) {
              return '"' + s + '"';
            })
          ) +
          '.'
        ].join('\n') + '\n');
        callback(1);
        return;
      } else {
        opt.numbering = require(styles[numberStyle]);
      }
      require('./read-form')(stdin, opt, function(error, form) {
        var format = opt['--format'];
        var transform = require('./transform-for-format')(format, opt);
        if (typeof transform === 'function') {
          try {
            stdout.write(transform(form));
            callback(0);
          } catch (e) {
            stderr.write(e.message);
            callback(1);
          }
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
  } else if (opt.critique) {
    return function(callback) {
      require('./read-form')(stdin, opt, function(error, form) {
        var issues = require('commonform-critique')(form);
        issues.forEach(function(issue) {
          stdout.write(issue.message + '\n');
        });
        callback(issues.length === 0 ? 0 : 1);
      });
    };
  } else if (opt.unmarked) {
    return function(callback) {
      require('./read-form')(stdin, opt, function(error, form) {
        var issues = require('commonform-unmarked-uses')(form);
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
