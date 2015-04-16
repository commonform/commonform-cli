/* jshint mocha: true */
var expect = require('chai').expect;
var invoke = require('./helpers/invoke');
var version = require('../package.json').version;
var cli = require('..');

describe('Version', function() {
  describe('commonform --version', function() {
    var inputs = {args:['--version']};

    it('writes the package version to standard output', function(done) {
      invoke(cli, inputs, function(outputs) {
        expect(outputs.stdout).to.equal(version + '\n');
        done();
      });
    });

    it('exits with code 0', function(done) {
      invoke(cli, inputs, function(outputs) {
        expect(outputs.status).to.equal(0);
        done();
      });
    });
  });

  describe('commonform -v', function() {
    var inputs = {args:['-v']};

    it('writes the package version to standard output', function(done) {
      invoke(cli, inputs, function(outputs) {
        expect(outputs.stdout).to.equal(version + '\n');
        done();
      });
    });

    it('exits with code 0', function(done) {
      invoke(cli, inputs, function(outputs) {
        expect(outputs.status).to.equal(0);
        done();
      });
    });
  });
});
