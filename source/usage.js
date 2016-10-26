var USAGE_FILE = require('path').join(__dirname, 'usage.txt')
module.exports = require('fs').readFileSync(USAGE_FILE, 'ascii')
