module.exports = function(format, opt) {
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
      return terminal(argument, {}) + '\n';
    };
  } else if (format === 'docx') {
    var docx = require('commonform-docx');
    return function(argument) {
      var title = opt['--title'] || 'Untitled';
      var zip = docx(title, argument, {});
      return zip.generate({type: 'nodebuffer'});
    };
  } else {
    return ['docx', 'markup', 'native', 'terminal'];
  }
};
