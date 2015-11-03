var fs = require('fs')
var test = require('tape')
var fixture = require('./helpers/fixture')
var invoke = require('./helpers/invoke')
var cli = require('..')

test('critique < archaic.json', function(test) {
  var inputs = {
    argv: [ 'critique' ],
    stdin: function() {
      return fs.createReadStream(fixture('archaic.json')) }}
  invoke(cli, inputs, function(outputs) {
    test.equal(
      outputs.stdout.indexOf('"to wit"') > -1, true,
      'critique < archaic.json reports an archaic phrase')
    test.equal(
      outputs.status, 1,
      'critique < archaic.json exits with status 1')
    test.end() }) })

test('critique < clean.json', function(test) {
  var inputs = {
    argv: [ 'critique' ],
    stdin: function() {
      return fs.createReadStream(fixture('clean.json')) }}
  invoke(cli, inputs, function(outputs) {
    test.equal(
      outputs.stdout, false,
      'critique < clean.json reports no errors')
    test.equal(
      outputs.status, 0,
      'critique < clean.json exits with status 0')
    test.end() }) })
