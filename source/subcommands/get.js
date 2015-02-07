var selectServer = require('../select-server');
var statuses = require('statuses');
var request = require('request');
var hash = require('commonform-hash');
var validate = require('commonform-validate');

module.exports = function(options) {
  var id = options['<id>'];
  if (hash.isDigest(id)) {
    selectServer(options, function(server) {
      request({
        method: 'GET',
        url: 'https://' + server.host + '/forms/' + id,
        qs: {denormalized: 'true'},
        json: true,
        rejectUnauthorized: false,
        auth: {
          user: server.auth.split(':')[0],
          password: server.auth.split(':')[1]
        }
      })
      .on('response', function(response) {
        var status = response.statusCode;
        if (status !== 200) {
          console.error(status);
          process.stdout.write(statuses(status));
        }
      })
      .pipe(process.stdout);
    });
  } else if (validate.bookmarkName(id) || id.indexOf('@') > -1) {
    selectServer(options, function(server) {
      request({
        method: 'GET',
        url: 'https://' + server.host + '/bookmarks/' + id,
        json: true,
        rejectUnauthorized: false,
        followRedirect: false,
        auth: {
          user: server.auth.split(':')[0],
          password: server.auth.split(':')[1]
        }
      })
      .on('response', function(response) {
        var status = response.statusCode;
        if (status !== 200) {
          process.stdout.write(statuses(status));
        }
      })
      .pipe(process.stdout);
    });
  } else {
    console.error('"' + id + '"is not a valid digest or bookmark name');
    process.exit(1);
  }
};
