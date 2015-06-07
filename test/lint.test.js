var fs = require('fs');
var test = require('tape');
var fixture = require('./helpers/fixture');
var invoke = require('./helpers/invoke');
var cli = require('..');

test('lint < problematic.json', function(test) {
  var inputs = {
    argv:['lint'],
    stdin: function() {
      return fs.createReadStream(fixture('problematic.json'));
    }};
  invoke(cli, inputs, function(outputs) {
    test.equal(
      outputs.stdout.indexOf('"Not a Defined Term"') > -1, true,
      'lint < problematic.json reports undefined terms');
    test.equal(
      outputs.stdout.indexOf('"Nonexistent Heading"') > -1, true,
      'lint < problematic.json reports broken cross-refrences');
    test.equal(
      outputs.status, 1,
      'lint < problematic.json exits with status 1');
    test.end();
  });
});

test('lint < clean.json', function(test) {
  var inputs = {
    argv:['lint'],
    stdin: function() {
      return fs.createReadStream(fixture('clean.json'));
    }};
  invoke(cli, inputs, function(outputs) {
    test.equal(
      outputs.stdout, false,
      'lint < clean.json reports no errors');
    test.equal(
      outputs.status, 0,
      'lint < clean.json exits with status 0');
    test.end();
  });
});
