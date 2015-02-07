var path = require('path');
var fs = require('fs');

var home = require('user-home');
var extend = require('util-extend');

var defaults = {
  libraries: []
};

var file = path.join(home, '.commonform.json');
try {
  var realpath = fs.realpathSync(file);
  var content = fs.readFileSync(realpath).toString();
  module.exports = extend(defaults, JSON.parse(content));
} catch (e) {
  module.exports = defaults;
}
