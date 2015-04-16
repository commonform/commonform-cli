module.exports = function(format) {
  if (format === 'markup') {
    var markup = require('commonform-markup');
    return function(argument) {
      return markup.stringify(argument) + '\n';
    };
  } else if (format === 'native') {
    var serialize = require('commonform-serialize');
    return serialize.stringify.bind(serialize);
  } else if (format === 'terminal') {
    var terminal = require('commonform-terminal');
    return function(argument) {
      return terminal(argument, {});
    };
  } else {
    return ['markup', 'native', 'terminal'];
  }
};
