var fs = require('fs');
var path = require('path');
var validate = require('commonform-validate');
var hash = require('commonform-hash');

var projectify = require('./projectify');

var fail = function(message) {
  process.stderr.write(message + '\n');
  process.exit(1);
};

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
  },
  docx: function() {
    var format = require('commonform-docx');
    return function(object) {
      return format(projectify(object)).generate({type: 'nodebuffer'});
    };
  }
};

module.exports = function(options) {
  // REFERENCE
  if (options.REFERENCE) {
    if (options.REFERENCE === '-') {
      options.reference = {file: '/dev/stdin'};
    } else {
      var referenceSplit;
      var ref = options.REFERENCE;
      try {
        options.reference = {file: fs.realpathSync(ref)};
      } catch (e) {
        if (hash.isDigest(ref)) {
          options.reference = {digest: ref};
        } else if (validate.bookmarkName(ref)) {
          options.reference = {bookmark: ref, version: 'latest'};
        } else if (
          (referenceSplit = ref.split('@')) &&
          validate.bookmarkName(referenceSplit[0]) &&
          validate.version(referenceSplit[1])
        ) {
          options.reference = {
            bookmark: referenceSplit[0],
            version: referenceSplit[1]
          };
        } else {
          fail('Invalid reference, "' + ref + '"');
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
    fail(
      'Invalid format, "' + format + '". ' +
      'Valid formats are ' + valid + '.\n'
    );
  }

  // BOOKMARK
  if (options.BOOKMARK) {
    var mark = options.BOOKMARK;
    if (validate.bookmarkName(mark)) {
      options.bookmark = {name: mark};
    } else if (mark.indexOf('@') > -1) {
      var bookmarkSplit = mark.split('@');
      if (
        validate.bookmarkName(bookmarkSplit[0]) &&
        validate.semanticVersion(bookmarkSplit[1])
      ) {
        options.bookmark = {
          name: bookmarkSplit[0],
          version: bookmarkSplit[1]
        };
      } else {
        fail('Invalid bookmark name, "' + mark + '"');
      }
    } else {
      fail('Invalid bookmark name, "' + mark + '"');
    }
  }

  if (options.FILE) {
    options.file = path.resolve(options.FILE);
  }

  return options;
};
