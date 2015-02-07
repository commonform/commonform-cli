var Configstore = require('configstore');
var packageJSON = require('../package');

module.exports = new Configstore(packageJSON.name, {libraries:{}});
