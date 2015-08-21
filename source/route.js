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
          try {
            stdout.write(transform(form));
            callback(0);
          } catch (e) {
            stderr.write(e);
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
  } else if (opt.share) {
    return function(callback) {
      require('./read-form')(stdin, opt, function(error, form) {
        var options = {
          hostname: 'api.commonform.org',
          post: 443,
          path: '/forms',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        };
        var request = require('https')
          .request(options, function(response) {
            console.log(
                'https://commonform.org/#' +
                response.headers.location.replace('/forms/', '')
            );
            callback(0);
          });
        request
          .on('error', function(error) {
            console.error(error.message);
            callback(1);
          })
          .end(JSON.stringify(form));
      });
    };
  } else {
    return undefined;
  }
};
