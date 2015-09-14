var fs = require('fs');
var test = require('tape');
var fixture = require('./helpers/fixture');
var invoke = require('./helpers/invoke');
var cli = require('..');

test('references', function(test) {
  var input = {
    argv: ['references'],
    stdin: function() {
      return fs.createReadStream(fixture('simple.json'));
    }};
  invoke(cli, input, function(outputs) {
    test.equal(
      outputs.stdout,
      ['Purchasers' ].join('\n') + '\n',
      'references < example.json writes referenced headings to output');
    test.equal(
      outputs.status, 0,
      'references < example.json exits with status 0');
    test.end();
  });
});
