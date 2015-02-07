var fs = require('fs');
var validate = require('commonform-validate');
var hash = require('commonform-hash');

var projectify = require('./projectify');

var FORMATTERS = {
  terminal: function() {
    var format = require('commonform-terminal');
    return function(object) {
      return format(projectify(object));
    };
  },
  native: function() {
    return require('commonform-serialize').stringify;
  },
  markup: function() {
    var markup = require('commonform-markup');
    return function(object) {
      return markup.toMarkup(
        object.hasOwnProperty('form') ? object.form : object
      ) + '\n';
    };
  }
};

module.exports = function(options) {
  // REFERENCE
  if (options.REFERENCE) {
    if (options.REFERENCE === '-') {
      options.reference = {file: '/dev/stdin'};
    } else {
      var split;
      var ref = options.REFERENCE;
      try {
        options.reference = {file: fs.realpathSync(ref)};
      } catch (e) {
        if (hash.isDigest(ref)) {
          options.reference = {digest: ref};
        } else if (validate.bookmarkName(ref)) {
          options.reference = {bookmark: ref, version: 'latest'};
        } else if (
          (split = ref.split('@')) &&
          validate.bookmarkName(split[0]) &&
          validate.version(split[1])
        ) {
          options.reference = {bookmark: split[0], version: split[1]};
        } else {
          process.stdout.write('Invalid reference, "' + ref + '"');
          process.exit(1);
        }
      }
    }
  }

  // FORMAT
  var format = options['--format'];
  if (FORMATTERS.hasOwnProperty(format)) {
    options.format = FORMATTERS[format]();
  } else {
    var valid = Object.keys(FORMATTERS).map(function(f) {
      return '"' + f + '"';
    }).join(', ');
    process.stderr.write(
      'Invalid format, "' + format + '". ' +
      'Valid formats are ' + valid + '.\n'
    );
    process.exit(1);
  }

  return options;
};
