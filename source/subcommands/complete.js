var fs = require('fs');
var analyze = require('commonform-analyze');
var concat = require('concat-stream');
var markup = require('commonform-markup');
var request = require('request');
var serialize = require('commonform-serialize');
var statuses = require('statuses');

var projectify = require('../projectify');
var promptForValues = require('../prompt-for-values');
var selectLibrary = require('../select-library');

var handler = function(options, error, response, body) {
  if (error) {
    console.error(error);
  } else {
    var status = response.statusCode;
    if (status === 200) {
      var project = projectify(body);
      var analysis = analyze(project);
      promptForValues(Object.keys(analysis.fields), function(values) {
        project.values = values;
        fs.writeFileSync(options.file, options.format(project));
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
      }, handler.bind(this, options));
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
          }, handler.bind(this, options));
        } else {
          process.stdout.write(statuses[status] + '\n');
          process.exit(1);
        }
      });
    });
  } else if (ref.file) {
    if (ref.file === '/dev/stdin') {
      process.stderr.write('Cannot complete forms from standard input');
      process.exit(1);
    } else {
      fs.createReadStream(ref.file)
        .pipe(concat(function(buffer) {
          var content = buffer.toString();
          var parser = content[0] === '{' ?
            serialize.parse.bind(serialize) :
            markup.parseLines.bind(markup);
          try {
            var project = projectify(parser(content));
            handler(options, null, {statusCode: 200}, project);
          } catch (e) {
            console.error(e);
            process.exit(1);
          }
        }));
    }
  } else {
    process.exit(1);
  }
};
