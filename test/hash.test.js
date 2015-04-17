/* jshint mocha: true */
var expect = require('chai').expect;
var invoke = require('./helpers/invoke');
var fs = require('fs');
var fixture = require('./helpers/fixture');
var cli = require('..');

describe('Hash', function() {
  var jsonFile = fixture('simple.json');
  var digest =
    'e1be8b23320e37f7e4feb58293f5262139bbea2850ad507ce0ac72671aa19a75';

  describe('hash < example.json', function() {
    var inputs = {
      argv:['hash'],
      stdin: fs.createReadStream.bind(fs, jsonFile)
    };

    it('writes the digest to standard output', function(done) {
      invoke(cli, inputs, function(outputs) {
        expect(outputs.stdout).to.equal(digest + '\n');
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
