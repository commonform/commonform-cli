var path = require('path');
var fs = require('fs');

var home = require('user-home');
var extend = require('util-extend');

var defaults = {servers: []};

module.exports = extend(
  defaults,
  JSON.parse(fs.readFileSync(
    fs.realpathSync(path.join(home, '.commonform.json'))
  ).toString())
);
