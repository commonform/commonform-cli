var concat = require('concat-stream');
var fs = require('fs');
var request = require('request');
var statuses = require('statuses');
var markup = require('commonform-markup');
var serialize = require('commonform-serialize');
var normalize = require('commonform-normalize');
var projectify = require('../projectify');

var selectLibrary = require('../select-library');

module.exports = function(options) {
  var ref = options.reference;
  if (ref.digest) {
    process.stderr.write('Cannot share a form by digest');
    process.exit(1);
  } else if (ref.bookmark) {
    process.stderr.write('Cannot share a form by bookmark name');
    process.exit(1);
  } else if (ref.file) {
    fs.createReadStream(ref.file)
      .pipe(concat(function(buffer) {
        var content = buffer.toString();
        var parser = content[0] === '{' ?
          serialize.parse.bind(serialize) :
          markup.parseLines.bind(markup);
        try {
          var project = projectify(parser(content));
          selectLibrary(options, function(library) {
            request({
              method: 'POST',
              url: library.protocol + '//' + library.host + '/forms',
              json: normalize(project.form),
              rejectUnauthorized: false,
              auth: library.auth
            }, function(error, response, body) {
              if (error) {
                console.error(error);
              } else {
                var status = response.statusCode;
                if (status === 200) {
                  body.forEach(function(object) {
                    process.stdout.write(object.status + '\n');
                    if (object.hasOwnProperty('location')) {
                      process.stdout.write(object.location + '\n');
                    }
                  });
                  process.exit(0);
                } else {
                  process.stdout.write(statuses[status] + '\n');
                  process.exit(1);
                }
              }
            });
          });
        } catch (e) {
          console.error(e);
          process.exit(1);
        }
      }));
  } else {
    process.exit(1);
  }
};
