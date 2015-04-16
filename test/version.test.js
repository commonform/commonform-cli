/* jshint mocha: true */
var expect = require('chai').expect;
var invoke = require('./helpers/invoke');
var meta = require('../package.json');
var version = meta.name + ' ' + meta.version;
var cli = require('..');

describe('Version', function() {
  describe('--version', function() {
    var inputs = {argv:['--version']};

    it('writes the package version to standard output', function(done) {
      invoke(cli, inputs, function(outputs) {
        expect(outputs.stdout).to.equal(version + '\n');
        done();
      });
    });

    it('exits with status 0', function(done) {
      invoke(cli, inputs, function(outputs) {
        expect(outputs.status).to.equal(0);
        done();
      });
    });
  });

  describe('-v', function() {
    var inputs = {argv:['-v']};

    it('writes the package version to standard output', function(done) {
      invoke(cli, inputs, function(outputs) {
        expect(outputs.stdout).to.equal(version + '\n');
        done();
      });
    });

    it('exits with status 0', function(done) {
      invoke(cli, inputs, function(outputs) {
        expect(outputs.status).to.equal(0);
        done();
      });
    });
  });
});
