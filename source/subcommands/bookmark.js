var path = require('path');
var request = require('request');
var statuses = require('statuses');

var selectLibrary = require('../select-library');

var handler = function(library, name, version, digest) {
  request({
    method: 'POST',
    url: library.protocol + '//' + library.host + '/bookmarks',
    json: [{
      name: name,
      version: version,
      form: digest
    }],
    rejectUnauthorized: false,
    followRedirect: false,
    auth: library.auth
  }, function(error, response, body) {
    if (error) {
      console.error(error);
      process.exit(1);
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
};

module.exports = function(options) {
  var mark = options.bookmark;
  var ref = options.reference;
  if (ref.digest) {
    selectLibrary(options, function(library) {
      handler(library, mark.name, mark.version, ref.digest);
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
          process.exit(1);
        } else if (status === 301) {
          var digest = path.basename(response.headers.location);
          handler(library, mark.name, mark.version, digest);
        } else {
          process.stdout.write(statuses[status] + '\n');
          process.exit(1);
        }
      });
    });
  } else if (ref.file) {
    process.stderr.write('Share the form first, then bookmark it.');
    process.exit(1);
  } else {
    process.exit(1);
  }
};
