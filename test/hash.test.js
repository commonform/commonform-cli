var fs = require('fs');
var test = require('tape');
var fixture = require('./helpers/fixture');
var invoke = require('./helpers/invoke');
var cli = require('..');

test('hash', function(test) {
  var digest =
    'cbf7d6b15de25876d2739ef92fd07669275e631c69839cffbe70e64f69452dac'
  var input = {
    argv: ['hash'],
    stdin: function() {
      return fs.createReadStream(fixture('simple.json'));
    }};
  invoke(cli, input, function(outputs) {
    test.equal(
      outputs.stdout, digest + '\n',
      'hash < example.json writes the digest to standard output');
    test.equal(
      outputs.status, 0,
      'hash < example.json exits with status 0');
    test.end();
  });
});
