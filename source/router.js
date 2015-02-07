var glob = require('glob');
var path = require('path');

var files = path.join(__dirname, 'subcommands', '**/*.js');

var subcommands = glob.sync(files).map(function(file) {
  return {
    name: path.basename(file, '.js'),
    handler: require(file)
  };
});

module.exports = function(options) {
  subcommands.some(function(subcommand) {
    if (options[subcommand.name]) {
      subcommand.handler(options);
      return true;
    }
  });
};
