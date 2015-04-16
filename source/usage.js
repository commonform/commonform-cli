var fs = require('fs');
var path = require('path');
var USAGE_FILE = path.join(__dirname, 'usage.txt');
var usage = fs.readFileSync(USAGE_FILE).toString();
module.exports = usage;
