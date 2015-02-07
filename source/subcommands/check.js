var concat = require('concat-stream');
var fs = require('fs');
var request = require('request');
var statuses = require('statuses');
var markup = require('commonform-markup');
var serialize = require('commonform-serialize');
var lint = require('commonform-lint');
var projectify = require('../projectify');

var selectLibrary = require('../select-library');

var humanize = function(object) {
  return Object.keys(object).map(function(key) {
    return key + ': ' + object[key];
  }).join(', ');
};

var formHandler = function(options, error, response, body) {
  if (error) {
    console.error(error);
  } else {
    var status = response.statusCode;
    if (status === 200) {
      body = projectify(body);
      var errors = lint(body);
      if (errors.length === 0) {
        process.stdout.write('No errors\n');
        process.exit(0);
      } else {
        errors.forEach(function(error) {
          process.stderr.write(error.rule + ' (');
          process.stderr.write(humanize(error.info) + ')\n');
        });
        process.exit(1);
      }
    } else {
      process.stdout.write(statuses[status] + '\n');
      process.exit(1);
    }
  }
};

module.exports = function(options) {
  var ref = options.reference;
  if (ref.digest) {
    selectLibrary(options, function(library) {
      request({
        method: 'GET',
        url: library.protocol + '//' + library.host +
          '/forms/' + ref.digest,
        qs: {denormalized: 'true'},
        json: true,
        rejectUnauthorized: false,
        auth: library.auth
      }, formHandler.bind(this, options));
    });
  } else if (ref.bookmark) {
    selectLibrary(options, function(library) {
      request({
        method: 'GET',
        url: library.protocol + '//' + library.host +
          '/bookmarks/' + ref.bookmark + '@' + ref.version,
        qs: {denormalized: 'true'},
        json: true,
        rejectUnauthorized: false,
        followRedirect: false,
        auth: library.auth
      }, function(error, response) {
        var status = response.statusCode;
        if (error) {
          console.error(error);
        } else if (status === 301) {
          request({
            method: 'GET',
            url: library.protocol + '//' + library.host +
              response.headers.location,
            qs: {denormalized: 'true'},
            json: true,
            rejectUnauthorized: false,
            auth: library.auth
          }, formHandler.bind(this, options));
        } else {
          process.stdout.write(statuses[status] + '\n');
          process.exit(1);
        }
      });
    });
  } else if (ref.file) {
    fs.createReadStream(ref.file)
      .pipe(concat(function(buffer) {
        var content = buffer.toString();
        var parser = content[0] === '{' ?
          serialize.parse.bind(serialize) :
          markup.parseLines.bind(markup);
        try {
          var project = parser(content);
          formHandler(options, null, {statusCode: 200}, project);
        } catch (e) {
          console.error(e);
          process.exit(1);
        }
      }));
  } else {
    process.exit(1);
  }
};
