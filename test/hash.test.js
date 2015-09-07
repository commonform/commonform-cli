var fs = require('fs');
var test = require('tape');
var fixture = require('./helpers/fixture');
var invoke = require('./helpers/invoke');
var cli = require('..');

test('hash', function(test) {
  var digest =
    'e1be8b23320e37f7e4feb58293f5262139bbea2850ad507ce0ac72671aa19a75';
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
