var fs = require('fs')
var path = require('path')

var fixtures = path.join(
  path.dirname(fs.realpathSync(__filename)),
  '..', 'fixtures')

module.exports = path.join.bind(path, fixtures)
