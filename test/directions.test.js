var fs = require('fs')
var test = require('tape')
var fixture = require('./helpers/fixture')
var invoke = require('./helpers/invoke')
var cli = require('..')

test('directions < simple-with-directions.commonform', function (test) {
  var inputs = {
    argv: ['directions'],
    stdin: function () {
      return fs.createReadStream(
        fixture('simple-with-directions.commonform'))
    }
  }
  invoke(cli, inputs, function (outputs) {
    test.deepEqual(
      JSON.parse(outputs.stdout),
      [
        {
          identifier: 'Company\'s Name',
          path: ['content', 9]
        }, {
          identifier: 'Company\'s Form of Organization',
          path: ['content', 11]
        }
      ],
      'directions reports an archaic phrase'
    )
    test.equal(
      outputs.status, 0,
      'directions exits with status 1'
    )
    test.end()
  })
})
