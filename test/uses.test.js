var fs = require('fs');
var test = require('tape');
var fixture = require('./helpers/fixture');
var invoke = require('./helpers/invoke');
var cli = require('..');

test('uses', function(test) {
  var input = {
    argv: ['uses'],
    stdin: function() {
      return fs.createReadStream(fixture('simple.json'));
    }};
  invoke(cli, input, function(outputs) {
    test.equal(
      outputs.stdout,
      ['Agreement', 'Party'].join('\n') + '\n',
      'uses < example.json writes used terms to output');
    test.equal(
      outputs.status, 0,
      'uses < example.json exits with status 0');
    test.end();
  });
});
