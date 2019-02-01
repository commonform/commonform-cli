var test = require('tape')
var invoke = require('./helpers/invoke')
var cli = require('..')

test('--help', function (test) {
  invoke(cli, { argv: ['--help'] }, function (outputs) {
    test.equal(
      outputs.stdout.indexOf('Usage:') > -1, true,
      '--help ' +
      'writes usage to standard output'
    )
    test.equal(
      outputs.status, 0,
      '--help ' +
      'exits with status 0'
    )
    test.end()
  })
})

test('-h', function (test) {
  invoke(cli, { argv: ['-h'] }, function (outputs) {
    test.equal(
      outputs.stdout.indexOf('Usage:') > -1, true,
      '-h ' +
      'writes usage to standard output'
    )
    test.equal(
      outputs.status, 0,
      '-h ' +
      'exits with status 0'
    )
    test.end()
  })
})

test('--usage', function (test) {
  invoke(cli, { argv: ['--usage'] }, function (outputs) {
    test.equal(
      outputs.stdout.indexOf('Usage:') > -1, true,
      '--usage ' +
      'writes usage to standard output'
    )
    test.equal(
      outputs.status, 0,
      '--usage ' +
      'exits with status 0'
    )
    test.end()
  })
})

test('(without arguments)', function (test) {
  invoke(cli, {}, function (outputs) {
    test.equal(
      outputs.stdout.indexOf('Usage:') > -1, true,
      '(without arguments) ' +
      'writes usage to standard output')
    test.equal(
      outputs.status, 0,
      '(without arguments) ' +
      'exits with status 0')
    test.end()
  })
})

test('(with bogus arguments)', function (test) {
  invoke(cli, { argv: ['bogus'] }, function (outputs) {
    test.equal(
      outputs.stderr.indexOf('Usage:') > -1, true,
      '(with bogus arguments) ' +
      'writes usage on standard error'
    )
    test.equal(
      outputs.status, 1,
      '(with bogus arguments) ' +
      'exits with status 1'
    )
    test.end()
  })
})
