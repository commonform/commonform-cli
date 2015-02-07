var Configstore = require('configstore');
var packageJSON = require('../package');

var DEFAULTS = {
  libraries: {
    'public': 'https://anonymous:anonymous@api.commonform.org'
  }
};

module.exports = new Configstore(packageJSON.name, DEFAULTS);
