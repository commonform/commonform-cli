/* jshint mocha: true */
var expect = require('chai').expect;
var invoke = require('./helpers/invoke');
var fs = require('fs');
var fixture = require('./helpers/fixture');
var cli = require('..');

describe('Render', function() {
  var jsonFile = fixture('simple.json');
  var markupFile = fixture('simple.commonform');
  var markup = fs.readFileSync(markupFile).toString();

  var terminalANSI = fs.readFileSync(fixture('simple.ansi'))
    .toString();

  describe('render < simple.json', function() {
    var inputs = {
      argv:['render'],
      stdin: fs.createReadStream.bind(fs, jsonFile)
    };

    it('writes ANSI codes to standard output', function(done) {
      invoke(cli, inputs, function(outputs) {
        expect(outputs.stdout).to.equal(terminalANSI);
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

  describe('render --format terminal < simple.json', function() {
    var inputs = {
      argv:['render', '--format', 'terminal'],
      stdin: fs.createReadStream.bind(fs, jsonFile)
    };

    it('writes ANSI codes to standard output', function(done) {
      invoke(cli, inputs, function(outputs) {
        expect(outputs.stdout).to.equal(terminalANSI);
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

  describe('render --format markup < simple.json', function() {
    var inputs = {
      argv:['render', '--format', 'markup'],
      stdin: fs.createReadStream.bind(fs, jsonFile)
    };

    it('writes markup to standard output', function(done) {
      invoke(cli, inputs, function(outputs) {
        expect(outputs.stdout).to.equal(markup);
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

  describe('render --format native < simple.json', function() {
    var jsonString = fs.readFileSync(jsonFile);
    var roundTrippedJSON = JSON.stringify(JSON.parse(jsonString));

    var inputs = {
      argv:['render', '--format', 'native'],
      stdin: fs.createReadStream.bind(fs, jsonFile)
    };

    it('writes JSON to standard output', function(done) {
      invoke(cli, inputs, function(outputs) {
        expect(outputs.stdout).to.equal(roundTrippedJSON);
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

  describe('render --format invalid < simple.json', function() {
    var inputs = {
      argv:['render', '--format', 'invalid'],
      stdin: fs.createReadStream.bind(fs, jsonFile)
    };

    it('lists valid formats to standard output', function(done) {
      invoke(cli, inputs, function(outputs) {
        expect(outputs.stderr).to.include('formats');
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

  describe('render --format markup < simple.commonform', function() {
    var inputs = {
      argv:['render', '--format', 'markup'],
      stdin: fs.createReadStream.bind(fs, markupFile)
    };

    it('writes the markup to standard output', function(done) {
      invoke(cli, inputs, function(outputs) {
        expect(outputs.stdout).to.equal(markup);
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
