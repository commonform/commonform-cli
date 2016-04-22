var formats = {
  docx: {
    package: 'commonform-docx',
    postprocess: function(output) {
      return output.generate({ type: 'nodebuffer' }) } },
  html5: {
    package: 'commonform-html',
    options: { html5: true },
    appendNewline: true },
  html: {
    package: 'commonform-html',
    appendNewline: true },
  latex: {
    package: 'commonform-latex',
    appendNewline: true },
  markdown: {
    package: 'commonform-markdown' },
  markup: {
    package: 'commonform-markup-stringify',
    appendNewline: true },
  native: {
    package: 'commonform-serialize',
    stringify: true },
  terminal: {
    package: 'commonform-terminal',
    appendNewline: true } }

module.exports = function(format, opt) {
  if (format in formats) {
    var method = formats[format]
    var processor = require(method.package)
    return function(argument) {
      var title = opt['--title']
      var blanks = [ ]
      var blanksPath = opt['--blanks']
      if (blanksPath) {
        blanks = JSON.parse(
          require('fs').readFileSync(blanksPath)
            .toString()) }
      var sigpages
      var sigpagesPath = opt['--signatures']
      if (sigpagesPath) {
        sigpages = JSON.parse(
          require('fs').readFileSync(sigpagesPath)
            .toString()) }
      var newline = (method.appendNewline ? '\n' : '')
      if (method.stringify) {
        return processor.stringify(argument.form) + newline }
      else {
        var options = ( method.options ? method.options : { } )
        if (format === 'docx' && sigpages) {
          options.after = require('ooxml-signature-pages')(sigpages) }
        options.numbering = opt.numbering
        options.title = title
        options.indentMargins = opt['--indent-margins']
        options.centerTitle = !opt['--left-align-title']
        if (argument.directions && !Array.isArray(blanks)) {
          blanks =
          Object.keys(blanks)
            .reduce(function(output, key) {
              var value = blanks[key]
              argument.directions
                .filter(function(direction) {
                  return direction.identifier === key })
                .forEach(function(direction) {
                  output.push({
                    blank: direction.path,
                    value: value }) })
              return output },
              [ ]) }
        var rendered = processor(argument.form, blanks, options)
        if (method.postprocess) {
          return method.postprocess(rendered) }
        else {
          return rendered + newline } } } }
  else {
    return Object.keys(formats).sort() } }
