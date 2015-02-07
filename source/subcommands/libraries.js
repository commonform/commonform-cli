var configuration = require('../configuration');
var url = require('url');

module.exports = function() {
  var servers = configuration.servers;
  var names = Object.keys(servers);
  if (names.length > 0) {
    names.forEach(function(name) {
      var serverURL = servers[name];
      var parsed = url.parse(serverURL);
      process.stdout.write(
        '"' + name + '"' +
        ' (' + parsed.host + parsed.pathname + ')\n');
    });
    process.exit(0);
  } else {
    process.stdout.write('No known library servers');
    process.exit(1);
  }
};
