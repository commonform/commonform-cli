var processOptions = require('./process-options');

var subcommands = [
  'bookmark',
  'check',
  'fingerprint',
  'read',
  'share'
];

module.exports = function(options) {
  var length = subcommands.length;
  for (var i = 0; i < length; i++) {
    var subcommand = subcommands[i];
    if (options[subcommand]) {
      options = processOptions(options);
      require('./subcommands/' + subcommand)(options);
      break;
    }
  }
};
