var fs = require('fs')
var test = require('tape')
var fixture = require('./helpers/fixture')
var invoke = require('./helpers/invoke')
var cli = require('..')

test('headings', function (test) {
  var input = {
    argv: ['headings'],
    stdin: function () {
      return fs.createReadStream(fixture('nested.json'))
    }
  }
  invoke(cli, input, function (outputs) {
    test.equal(
      outputs.stdout,
      'Test Heading\n',
      'headings < example.json writes used headings to output'
    )
    test.equal(
      outputs.status, 0,
      'headings < example.json exits with status 0'
    )
    test.end()
  })
})
