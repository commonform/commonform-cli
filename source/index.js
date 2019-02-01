var docopt = require('docopt')
var route = require('./route')
var usage = require('./usage')

module.exports = function (stdin, stdout, stderr, env, argv, next) {
  var options
  try {
    options = docopt.docopt(usage, {
      argv: argv,
      help: false,
      exit: false
    })
  } catch (error) {
    stderr.write(error.message)
    next(1)
    return
  }

  var handler = route(stdin, stdout, stderr, env, options)
  if (handler) {
    handler(next)
  } else {
    stdout.write(usage)
    next(0)
  }
}
