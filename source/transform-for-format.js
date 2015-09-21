var formats = {
  docx: {
    package: 'commonform-docx',
    postprocess: function(output) {
      return output.generate({type: 'nodebuffer'});
    }
  },
  html5: {
    package: 'commonform-html',
    options: {html5: true},
    appendNewline: true
  },
  html: {
    package: 'commonform-html',
    appendNewline: true
  },
  latex: {
    package: 'commonform-latex',
    appendNewline: true
  },
  markdown: {
    package: 'commonform-markdown'
  },
  markup: {
    package: 'commonform-markup',
    stringify: true,
    appendNewline: true
  },
  native: {
    package: 'commonform-serialize',
    stringify: true
  },
  terminal: {
    package: 'commonform-terminal',
    appendNewline: true
  },
  tex: {
    package: 'commonform-tex',
    appendNewline: true
  }
};

module.exports = function(format, opt) {
  if (format in formats) {
    var method = formats[format];
    var processor = require(method.package);
    return function(argument) {
      var title = opt['--title'];
      var blanks = {};
      var blanksPath = opt['--blanks'];
      if (blanksPath) {
        blanks = JSON.parse(
          require('fs').readFileSync(blanksPath)
            .toString());
      }
      var sigpages;
      var sigpagesPath = opt['--signatures'];
      if (sigpagesPath) {
        sigpages = JSON.parse(
          require('fs').readFileSync(sigpagesPath)
            .toString());
      }
      var newline = (method.appendNewline ? '\n' : '');
      if (method.stringify) {
        return processor.stringify(argument) + newline;
      } else {
        var options = (method.options ? method.options : {});
        if (format === 'docx' && sigpages) {
          options.after = require('ooxml-signature-pages')(sigpages);
        }
        // console.error(options.after)
        // process.exit(1)
        options.numbering = opt.numbering;
        options.title = title;
        var rendered = processor(argument, blanks, options);
        if (method.postprocess) {
          return method.postprocess(rendered);
        } else {
          return rendered + newline;
        }
      }
    };
  } else {
    return Object.keys(formats).sort();
  }
};
