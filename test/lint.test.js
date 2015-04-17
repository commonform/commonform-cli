/* jshint mocha: true */
var expect = require('chai').expect;
var invoke = require('./helpers/invoke');
var fixture = require('./helpers/fixture');
var fs = require('fs');
var cli = require('..');

describe('Lint', function() {
  var jsonFile = fixture('problematic.json');

  describe('lint < problematic.json', function() {
    var inputs = {
      argv:['lint'],
      stdin: fs.createReadStream.bind(fs, jsonFile)
    };

    it('reports undefined terms', function(done) {
      invoke(cli, inputs, function(outputs) {
        expect(outputs.stdout).to.include('"Not a Defined Term"');
        done();
      });
    });

    it('reports broken cross-refrences', function(done) {
      invoke(cli, inputs, function(outputs) {
        expect(outputs.stdout).to.include('"Nonexistent Heading"');
        done();
      });
    });

    it('exits with status 1', function(done) {
      invoke(cli, inputs, function(outputs) {
        expect(outputs.status).to.equal(1);
        done();
      });
    });
  });

  describe('lint < clean.json', function() {
    var jsonFile = fixture('clean.json');
    var inputs = {
      argv:['lint'],
      stdin: fs.createReadStream.bind(fs, jsonFile)
    };

    it('reports no errors', function(done) {
      invoke(cli, inputs, function(outputs) {
        expect(outputs.stdout).to.equal(false);
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
