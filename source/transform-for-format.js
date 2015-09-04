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
  } else if (format === 'html') {
    var html = require('commonform-html');
    return function(argument) {
      var blanks = {};
      var path = opt['--blanks'];
      var options = {};
      if (path) {
        blanks = JSON.parse(require('fs').readFileSync(path).toString());
      }
      return html(argument, blanks, options) + '\n';
    };
  } else if (format === 'html5') {
    var html5 = require('commonform-html');
    return function(argument) {
      var blanks = {};
      var path = opt['--blanks'];
      var options = {html5: true};
      if (path) {
        blanks = JSON.parse(require('fs').readFileSync(path).toString());
      }
      return html5(argument, blanks, options) + '\n';
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
      var zip = docx(
        argument,
        blanks,
        {
          title: title,
          numbering: opt.numbering
        }
      );
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
      'docx', 'html', 'html5', 'latex', 'markdown', 'markup', 'native',
      'terminal', 'tex'
    ].sort();
  }
};
