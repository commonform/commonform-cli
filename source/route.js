var analyses = [ 'definitions', 'headings', 'references', 'uses' ]

module.exports = function(stdin, stdout, stderr, env, opt) {
  var analysis = require('array-find')(analyses, function(analysis) {
    return opt.hasOwnProperty(analysis) && opt[analysis] })
  if (analysis) {
    return function(callback) {
      require('./read-input')(stdin, opt, function(error, input) {
        var analysed = require('commonform-analyze')(input.form)
        Object.keys(analysed[analysis])
          .sort()
          .forEach(function(element) {
            stdout.write(element + '\n') })
        callback(0) }) } }
  else if (opt['--version'] || opt['-v']) {
    return function(callback) {
      var meta = require('../package.json')
      stdout.write(meta.name + ' ' + meta.version + '\n')
      callback(0) } }
  else if (opt.hash) {
    return function(callback) {
      require('./read-input')(stdin, opt, function(error, input) {
        var normalized = require('commonform-normalize')(input.form)
        stdout.write(normalized.root + '\n')
        callback(0) }) } }
  else if (opt.render) {
    return function(callback) {
      var numberStyle = opt['--number']
      var styles = require('./numberings')
      if (!styles.hasOwnProperty(numberStyle)) {
        stderr.write([
          '"' + numberStyle + '" is not a valid numbering style.',
          'Valid styles are ' +
          require('english-list')(
            'and',
            Object.keys(styles).map(function(s) {
              return '"' + s + '"' })
          ) +
          '.' ].join('\n') + '\n')
        callback(1)
        return }
      else {
        opt.numbering = require(styles[numberStyle]) }
      require('./read-input')(stdin, opt, function(error, input) {
        var format = opt['--format']
        var transform = require('./transform-for-format')(format, opt)
        if (typeof transform === 'function') {
          try {
            stdout.write(transform(input))
            callback(0) }
          catch (e) {
            stderr.write(e.message)
            callback(1) } }
        else {
          stderr.write([
            '"' + format + '" is not a valid format.',
            'Valid formats are ' +
            require('english-list')('and', transform.map(function(s) {
              return '"' + s + '"'
            })) +
            '.' ].join('\n') + '\n')
          callback(1) } }) } }
  else if (opt.lint) {
    return function(callback) {
      require('./read-input')(stdin, opt, function(error, input) {
        var issues = require('commonform-lint')(input.form)
        issues.forEach(function(issue) {
          stdout.write(issue.message + '\n') })
        callback(issues.length === 0 ? 0 : 1) }) } }
  else if (opt.critique) {
    return function(callback) {
      require('./read-input')(stdin, opt, function(error, input) {
        var issues = require('commonform-critique')(input.form)
        issues.forEach(function(issue) {
          stdout.write(issue.message + '\n') })
        callback(issues.length === 0 ? 0 : 1) }) } }
  else if (opt.directions) {
    return function(callback) {
      stdin.pipe(require('concat-stream')(function(buffer) {
        var input = buffer.toString()
        stdout.write(
          JSON.stringify(
            require('commonform-markup-parse')(input).directions))
        callback(0) })) } }
  else if (opt.share) {
    return function(callback) {
      require('./read-input')(stdin, opt, function(error, input) {
        require('commonform-share')(
          input.form,
          function(error, location) {
            var API = 'https://api.commonform.org'
            if (error) {
              stderr.write(API + ' responded ' + error.statusCode)
              callback(1) }
            else {
              stdout.write(API + location + '\n')
              /* istanbul ignore if */
              if (opt['--open']) {
                require('opener')(API + location) }
              callback(0) } }) }) } }
  else if (opt.publish) {
    return function(callback) {
      require('./read-input')(stdin, opt, function(error, input) {
        var publisher = process.env.COMMONFORM_PUBLISHER
        var password = process.env.COMMONFORM_PASSWORD
        if (!publisher || !password) {
          stderr.write(
            'Set the variables COMMONFORM_PUBLISHER and ' +
            'COMMONFORM_PASSWORD in your environment to publish.\n')
          callback(1) }
        else {
          var hash = require('commonform-normalize')(input.form).root
          require('commonform-publish')(
            publisher,
            password,
            opt.PROJECT,
            opt.EDITION,
            hash,
            function(error, location) {
              if (error) {
                stderr.write('Responded ' + error.statusCode + '\n')
                callback(1) }
              else {
                stdout.write(location)
                callback(0) } }) } }) } }
  else {
    return undefined } }
