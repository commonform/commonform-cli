/* jshint mocha: true */
var expect = require('chai').expect;
var cli = require('..');

var streambuffers = require('stream-buffers');
var WritableStreamBuffer = streambuffers.WritableStreamBuffer;

var emptyEnv = {};
var noArgs = [];

describe('Usage', function() {
  describe('commonform (without arguments)', function() {
    it('shows usage', function(done) {
      var output = new WritableStreamBuffer();
      cli(null, output, null, emptyEnv, noArgs, function(exitCode) {
        expect(exitCode)
          .to.equal(0);
        expect(output.getContentsAsString('utf8'))
          .to.include('Usage:');
        done();
      });
    });
  });

  describe('commonform (with bogus arguments)', function() {
    it('shows usage on stderr', function(done) {
      var error = new WritableStreamBuffer();
      var args = ['bogus'];
      cli(null, null, error, emptyEnv, args, function(exitCode) {
        expect(exitCode)
          .to.equal(1);
        expect(error.getContentsAsString('utf8'))
          .to.include('Usage:');
        done();
      });
    });
  });
});
