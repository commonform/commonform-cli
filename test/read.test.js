/* jshint mocha: true */
var expect = require('chai').expect;
var invoke = require('./helpers/invoke');
var fs = require('fs');
var fixture = require('./helpers/fixture');
var cli = require('..');

describe('Read', function() {
  var jsonFile = fixture('simple-form.json');
  var terminalANSI = fs.readFileSync(fixture('simple-form.ansi'))
    .toString();

  describe('read < example.json', function() {
    var inputs = {
      argv:['read'],
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

  describe('read --format terminal < example.json', function() {
    var inputs = {
      argv:['read', '--format', 'terminal'],
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

  describe('read --format markup < example.json', function() {
    var markup = fs.readFileSync(fixture('simple-form.commonform'))
      .toString();

    var inputs = {
      argv:['read', '--format', 'markup'],
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

  describe('read --format native < example.json', function() {
    var jsonString = fs.readFileSync(jsonFile);
    var roundTrippedJSON = JSON.stringify(JSON.parse(jsonString));

    var inputs = {
      argv:['read', '--format', 'native'],
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

  describe('read --format invalid < example.json', function() {
    var inputs = {
      argv:['read', '--format', 'invalid'],
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
});
