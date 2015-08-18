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
      var blanks = {};
      var path = opt['--blanks'];
      if (path) {
        blanks = JSON.parse(require('fs').readFileSync(path).toString());
      }
      return terminal(argument, blanks) + '\n';
    };
  } else if (format === 'latex') {
    var latex = require('commonform-latex');
    return function(argument) {
      var blanks = {};
      var path = opt['--blanks'];
      if (path) {
        blanks = JSON.parse(require('fs').readFileSync(path).toString());
      }
      return latex(argument, blanks) + '\n';
    };
  } else if (format === 'tex') {
    var tex = require('commonform-tex');
    return function(argument) {
      var blanks = {};
      var path = opt['--blanks'];
      if (path) {
        blanks = JSON.parse(require('fs').readFileSync(path).toString());
      }
      return tex(argument, blanks) + '\n';
    };
  } else if (format === 'docx') {
    var docx = require('commonform-docx');
    return function(argument) {
      var title = opt['--title'] || 'Untitled';
      var blanks = {};
      var path = opt['--blanks'];
      if (path) {
        blanks = JSON.parse(require('fs').readFileSync(path).toString());
      }
      var zip = docx(title, argument, blanks);
      return zip.generate({type: 'nodebuffer'});
    };
  } else if (format === 'markdown') {
    return function(argument) {
      var blanks = {};
      var path = opt['--blanks'];
      if (path) {
        blanks = JSON.parse(require('fs').readFileSync(path).toString());
      }
      return require('commonform-markdown')(argument, blanks);
    };
  } else {
    return [
      'docx', 'latex', 'markdown', 'markup', 'native', 'terminal', 'tex'
    ].sort();
  }
};
