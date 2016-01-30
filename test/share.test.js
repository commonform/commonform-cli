var fs = require('fs')
var test = require('tape')
var fixture = require('./helpers/fixture')
var invoke = require('./helpers/invoke')
var cli = require('..')

test('share < simple.json', function(test) {
  var inputs = {
    argv: [ 'share' ],
    stdin: function() {
      return fs.createReadStream(fixture('simple.json')) }}
  invoke(cli, inputs, function(outputs) {
    var re = /^https:\/\/api.commonform.org\/forms\/.{64}$/
    test.assert(
      re.test(outputs.stdout.trim()),
      'share < simple.json reports form location')
    test.equal(
      outputs.status, 0,
      'share < simple.json exits with status 0')
    test.end() }) })

test('share < malformed.json', function(test) {
  var inputs = {
    argv: [ 'share' ],
    stdin: function() {
      return fs.createReadStream(fixture('malformed.json')) }}
  invoke(cli, inputs, function(outputs) {
    test.equal(
      outputs.stderr.trim(), 'api.commonform.org responded 400',
      'share < malformed.json reports status code')
    test.equal(
      outputs.status, 1,
      'share < malformed.json exits with status 1')
    test.end() }) })
