var fs = require('fs');
var test = require('tape');
var fixture = require('./helpers/fixture');
var invoke = require('./helpers/invoke');
var cli = require('..');

test('definitions', function(test) {
  var input = {
    argv: ['definitions'],
    stdin: function() {
      return fs.createReadStream(fixture('simple.json'));
    }};
  invoke(cli, input, function(outputs) {
    test.equal(
      outputs.stdout,
      [
        'Agreement',
        'Company',
        'Effective Date',
        'Party',
        'Purchasers'
      ].join('\n') + '\n',
      'definitions < example.json writes defined tersm to output');
    test.equal(
      outputs.status, 0,
      'definitions < example.json exits with status 0');
    test.end();
  });
});
