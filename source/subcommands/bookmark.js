var request = require('request');
var selectServer = require('../select-server');

module.exports = function(options) {
  selectServer(options, function(server) {
    console.error(options);
    request({
      method: 'POST',
      url: 'https://' + server.host + '/bookmarks',
      json: [{
        name: options['<name>'],
        form: options['<digest>'],
        version: options['--version'] || undefined
      }],
      rejectUnauthorized: false,
      auth: {
        user: server.auth.split(':')[0],
        password: server.auth.split(':')[1]
      }
    }, function(error, response, body) {
      console.error(response.statusCode);
      console.error(body);
      process.exit(0);
    });
  });
};
