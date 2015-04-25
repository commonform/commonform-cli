/* jshint mocha: true */
var expect = require('chai').expect;
var fs = require('fs');

var invoke = require('./helpers/invoke');
var fixture = require('./helpers/fixture');
var cli = require('..');

describe('Critique', function() {
  var jsonFile = fixture('archaic.json');

  describe('critique < archaic.json', function() {
    var inputs = {
      argv:['critique'],
      stdin: fs.createReadStream.bind(fs, jsonFile)
    };

    it('reports an archaic phrase', function(done) {
      invoke(cli, inputs, function(outputs) {
        expect(outputs.stdout).to.include('"to wit"');
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

  describe('critique < clean.json', function() {
    var jsonFile = fixture('clean.json');
    var inputs = {
      argv:['critique'],
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
