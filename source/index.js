var meta = require('../package.json');

module.exports = function(stdin, stdout, stderr, env, args, callback) {
  stdout.write(meta.version + '\n');
  callback(0);
};
