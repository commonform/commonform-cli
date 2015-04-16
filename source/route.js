module.exports = function(stdin, stdout, stderr, env, opt) {
  if (opt['--version'] || opt['-v']) {
    return function(callback) {
      var meta = require('../package.json');
      stdout.write(meta.name + ' ' + meta.version + '\n');
      callback(0);
    };
  } else {
    return undefined;
  }
};
