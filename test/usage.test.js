/* jshint mocha: true */
var expect = require('chai').expect;
var invoke = require('./helpers/invoke');
var cli = require('..');

describe('Usage', function() {
  describe('commonform --help', function() {
    var inputs = {argv:['--help']};

    it('writes usage to standard output', function(done) {
      invoke(cli, inputs, function(outputs) {
        expect(outputs.stdout).to.include('Usage:');
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

  describe('commonform -h', function() {
    var inputs = {argv:['-h']};

    it('writes usage to standard output', function(done) {
      invoke(cli, inputs, function(outputs) {
        expect(outputs.stdout).to.include('Usage:');
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

  describe('commonform --usage', function() {
    var inputs = {argv:['--usage']};

    it('writes usage to standard output', function(done) {
      invoke(cli, inputs, function(outputs) {
        expect(outputs.stdout).to.include('Usage:');
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

  describe('commonform (without arguments)', function() {
    var inputs = {};

    it('writes usage to standard output', function(done) {
      invoke(cli, inputs, function(outputs) {
        expect(outputs.stdout).to.include('Usage:');
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

  describe('commonform (with bogus arguments)', function() {
    var inputs = {argv: ['bogus']};

    it('writes usage on standard error', function(done) {
      invoke(cli, inputs, function(outputs) {
        expect(outputs.stderr).to.include('Usage:');
        done();
      });
    });

    it('exits with code 1', function(done) {
      invoke(cli, inputs, function(outputs) {
        expect(outputs.status).to.equal(1);
        done();
      });
    });
  });
});
