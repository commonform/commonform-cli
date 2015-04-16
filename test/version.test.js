/* jshint mocha: true */
var expect = require('chai').expect;
var cli = require('..');

var streambuffers = require('stream-buffers');
var WritableStreamBuffer = streambuffers.WritableStreamBuffer;

var meta = require('../package.json');
var emptyEnv = {};

describe('Version', function() {
  describe('commonform --version', function() {
    it('shows the package version', function(done) {
      var output = new WritableStreamBuffer();
      var args = ['--version'];
      cli(null, output, null, emptyEnv, args, function(exitCode) {
        expect(exitCode)
          .to.equal(0);
        expect(output.getContentsAsString('utf8'))
          .to.equal(meta.version + '\n');
        done();
      });
    });
  });

  describe('commonform -v', function() {
    it('shows the package version', function(done) {
      var output = new WritableStreamBuffer();
      var args = ['-v'];
      cli(null, output, null, emptyEnv, args, function(exitCode) {
        expect(exitCode)
          .to.equal(0);
        expect(output.getContentsAsString('utf8'))
          .to.equal(meta.version + '\n');
        done();
      });
    });
  });
});
