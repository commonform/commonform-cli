var concat = require('concat-stream');
var fs = require('fs');
var request = require('request');
var statuses = require('statuses');
var markup = require('commonform-markup');
var hash = require('commonform-hash');
var serialize = require('commonform-serialize');

var selectLibrary = require('../select-library');

var formHandler = function(options, error, response, body) {
  if (error) {
    console.error(error);
  } else {
    var status = response.statusCode;
    if (status === 200) {
      process.stdout.write(hash.hash(body) + '\n');
      process.exit(0);
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
          var form = parser(content);
          if (form.hasOwnProperty('form')) {
            form = form.form;
          }
          process.stdout.write(hash.hash(form) + '\n');
          process.exit(0);
        } catch (e) {
          console.error(e);
          process.exit(1);
        }
      }));
  } else {
    process.exit(1);
  }
};
