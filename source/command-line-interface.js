var dependencies = require('../package.json').dependencies;
var fs = require('fs');
var path = require('path');

var router = require('./router');
var meta = require('../package.json');
var usage = fs.readFileSync(path.join(__dirname, 'usage.txt'))
  .toString();

var VERSION = 'commonform-cli ' + meta.version + ' (' +
  Object.keys(dependencies)
    .filter(function(dependency) {
      return dependency.slice(0, 11) === 'commonform-';
    })
    .map(function(dependency) {
      return dependency.slice(11) +
        ' ' +
        dependencies[dependency];
    })
    .join('');

module.exports = function(argv) {
  var options = require('docopt').docopt(
    usage, {argv: argv, help: true, version: VERSION}
  );
  router(options);
};
