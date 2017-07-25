var fs = require('fs')
var test = require('tape')
var fixture = require('./helpers/fixture')
var invoke = require('./helpers/invoke')
var cli = require('..')

test('blanks', function (test) {
  var input = {
    argv: ['blanks'],
    stdin: function () {
      return fs.createReadStream(fixture('simple-with-directions.commonform'))
    }
  }
  invoke(cli, input, function (outputs) {
    test.equal(
      outputs.stdout,
      'Company\'s Form of Organization\nCompany\'s Name\n',
      'blank simple-with-directions.commonform writes expected blanks to output'
    )
    test.equal(
      outputs.status, 0,
      'headings < example.json exits with status 0'
    )
    test.end()
  })
})
