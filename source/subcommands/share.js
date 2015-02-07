var request = require('request');

var selectServer = require('../select-server');

module.exports = function(options) {
  selectServer(options, function(server) {
    process.stdin
      .pipe(request({
         method: 'POST',
         url: 'https://' + server.host + '/forms',
         json: true,
         rejectUnauthorized: false,
         auth: {
           user: server.auth.split(':')[0],
           password: server.auth.split(':')[1]
         }
      }))
      .pipe(process.stdout);
  });
};
