var concat = require('concat-stream');
var fs = require('fs');
var request = require('request');
var statuses = require('statuses');
var markup = require('commonform-markup');
var serialize = require('commonform-serialize');
var projectify = require('../projectify');

var selectLibrary = require('../select-library');

var formHandler = function(options, error, response, body) {
  var status = response.statusCode;
  if (error) {
    console.error(error);
  } else if (status === 200) {
    process.stdout.write(options.format(body));
    process.exit(0);
  } else {
    process.stdout.write(statuses[status] + '\n');
    process.exit(1);
  }
};

module.exports = function(options) {
  var ref = options.reference;
  if (ref.digest) {
    selectLibrary(options, function(server) {
      request({
        method: 'GET',
        url: 'https://' + server.host + '/forms/' + ref.digest,
        qs: {denormalized: 'true'},
        json: true,
        rejectUnauthorized: false,
        auth: server.auth
      }, formHandler.bind(this, options));
    });
  } else if (ref.bookmark) {
    selectLibrary(options, function(server) {
      request({
        method: 'GET',
        url: 'https://' + server.host + '/bookmarks/' +
          ref.bookmark + '@' + ref.version,
        qs: {denormalized: 'true'},
        json: true,
        rejectUnauthorized: false,
        followRedirect: false,
        auth: server.auth
      }, function(error, response) {
        var status = response.statusCode;
        if (error) {
          console.error(error);
        } else if (status === 301) {
          request({
            method: 'GET',
            url: 'https://' + server.host + response.headers.location,
            qs: {denormalized: 'true'},
            json: true,
            rejectUnauthorized: false,
            auth: server.auth
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
          var project = projectify(parser(content));
          process.stdout.write(options.format(project));
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
