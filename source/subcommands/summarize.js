var concat = require('concat-stream');
var fs = require('fs');
var request = require('request');
var statuses = require('statuses');
var markup = require('commonform-markup');
var serialize = require('commonform-serialize');
var analyze = require('commonform-analyze');
var projectify = require('../projectify');

var selectLibrary = require('../select-library');

var formHandler = function(options, error, response, body) {
  if (error) {
    console.error(error);
    process.exit(1);
  } else {
    var status = response.statusCode;
    if (status === 200) {
      body = projectify(body);
      var analysis = analyze(body);
      Object.keys(analysis).forEach(function(category) {
        process.stdout.write(
          category[0].toUpperCase() + category.slice(1) + '\n'
        );
        var items = Object.keys(analysis[category]);
        if (items.length === 0) {
          process.stdout.write('    (None)\n');
        } else {
          items
            .sort(function(a, b) {
              return a.toLowerCase() > b.toLowerCase();
            })
            .forEach(function(item) {
              process.stdout.write('    ' + item + '\n');
            });
        }
      });
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
