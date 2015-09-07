var test = require('tape');
var invoke = require('./helpers/invoke');
var meta = require('../package.json');
var cli = require('..');
var version = meta.name + ' ' + meta.version;

test('--version', function(test) {
  invoke(cli, {argv: ['--version']}, function(outputs) {
    test.equal(
      outputs.stdout, version + '\n',
      '--version writes the package version to standard output');
    test.equal(
      outputs.status, 0,
      '--version exits with status 0');
    test.end();
  });
});

test.test('-v', function(test) {
  invoke(cli, {argv: ['-v']}, function(outputs) {
    test.equal(
      outputs.stdout, version + '\n',
      '-v writes the package version to standard output');
    test.equal(
      outputs.status, 0,
      '-v exits with status 0');
    test.end();
  });
});
