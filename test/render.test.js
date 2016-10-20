var fs = require('fs')
var test = require('tape')
var fixture = require('./helpers/fixture')
var invoke = require('./helpers/invoke')
var cli = require('..')

test('render < simple.json', function(test) {
  var inputs = {
    argv: [ 'render' ],
    stdin: function() {
      return fs.createReadStream(fixture('simple.json')) }}
  invoke(cli, inputs, function(outputs) {
    test.equal(
      outputs.stdout,
      fs.readFileSync(fixture('simple.ansi')).toString(),
      'render < simple.json ' +
      'writes ANSI to standard output')
    test.equal(
      outputs.status, 0,
      'render < simple.json ' +
      'exits with status 0')
    test.end() }) })

test('render --format terminal', function(test) {
  var inputs = {
    argv: [ 'render', '--format', 'terminal' ],
    stdin: function() {
      return fs.createReadStream(fixture('simple.json')) }}
  invoke(cli, inputs, function(outputs) {
    test.equal(
      outputs.stdout,
      fs.readFileSync(fixture('simple.ansi')).toString(),
      'render --format terminal ' +
      'writes ANSI to standard output')
    test.equal(
      outputs.status, 0,
      'render --format terminal ' +
      'exits with status 0')
    test.end() }) })

test('render --format terminal --blanks', function(test) {
  var inputs = {
    argv: [
      'render',
      '--format', 'terminal',
      '--blanks', fixture('blanks.json') ],
    stdin: function() {
      return fs.createReadStream(fixture('simple.commonform')) }}
  invoke(cli, inputs, function(outputs) {
    test.equal(
      outputs.stdout.indexOf('NewCo') > -1, true,
      'render --format terminal --blanks ' +
      'writes blank values to standard output')
    test.equal(
      outputs.status, 0,
      'render --format terminal --blanks ' +
      'exits with status 0')
    test.end() }) })

test('render --format terminal --blanks (object)', function(test) {
  var inputs = {
    argv: [
      'render',
      '--format', 'terminal',
      '--blanks', fixture('blanks-object.json') ],
    stdin: function() {
      return fs.createReadStream(
        fixture('simple-with-directions.commonform')) }}
  invoke(cli, inputs, function(outputs) {
    test.equal(
      outputs.stdout.indexOf('NewCo') > -1, true,
      'render --format terminal --blanks (object) ' +
      'writes blank values to standard output')
    test.equal(
      outputs.status, 0,
      'render --format terminal --blanks (object) ' +
      'exits with status 0')
    test.end() }) })

test('render --format latex', function(test) {
  var inputs = {
    argv: [ 'render', '--format', 'latex' ],
    stdin: function() {
      return fs.createReadStream(fixture('simple.json')) }}
  invoke(cli, inputs, function(outputs) {
    test.equal(
      outputs.stdout.indexOf('\\parindent') > -1, true,
      'render --format latex ' +
      'writes latex to standard output')
    test.equal(
      outputs.status, 0,
      'render --format latex ' +
      'exits with status 0')
    test.end() }) })

test('render --format latex --blanks', function(test) {
  var inputs = {
    argv: [
      'render',
      '--format', 'latex',
      '--blanks', fixture('blanks.json') ],
    stdin: function() {
      return fs.createReadStream(fixture('simple.commonform')) }}
  invoke(cli, inputs, function(outputs) {
    test.equal(
      outputs.stdout.indexOf('NewCo') > -1, true,
      'render --format latex --blanks ' +
      'writes blank values to standard output')
    test.equal(
      outputs.status, 0,
      'render --format latex --blanks ' +
      'exits with status 0')
    test.end() }) })

test('render --format markup', function(test) {
  var inputs = {
    argv: [ 'render', '--format', 'markup' ],
    stdin: function() {
      return fs.createReadStream(fixture('simple.json')) }}
  invoke(cli, inputs, function(outputs) {
    test.equal(
      outputs.stdout,
      fs.readFileSync(fixture('simple.commonform')).toString(),
      'render --format markup ' +
      'writes markup to standard output')
    test.equal(
      outputs.status, 0,
      'render --format markup ' +
      'exits with status 0')
    test.end() }) })

test('render --format native', function(test) {
  var inputs = {
    argv: [ 'render', '--format', 'native' ],
    stdin: function() {
      return fs.createReadStream(fixture('simple.json')) }}
  invoke(cli, inputs, function(outputs) {
    test.equal(
      outputs.stdout,
      JSON.stringify(
        JSON.parse(
          fs.readFileSync(fixture('simple.json')))).toString(),
      'render --format native ' +
      'writes JSON to standard output')
    test.equal(
      outputs.status, 0,
      'render --format native ' +
      'exits with status 0')
    test.end() }) })

test('render --format invalid', function(test) {
  var inputs = {
    argv: [ 'render', '--format', 'invalid' ],
    stdin: function() {
      return fs.createReadStream(fixture('simple.json')) }}
  invoke(cli, inputs, function(outputs) {
    test.equal(
      outputs.stderr.indexOf('formats') > -1, true,
      'render --format invalid ' +
      'lists valid formats to standard output')
    test.equal(
      outputs.status, 1,
      'render --format invalid ' +
      'exits with status 1')
    test.end() }) })

test('render --format markup', function(test) {
  var inputs = {
    argv: [ 'render', '--format', 'markup' ],
    stdin: function() {
      return fs.createReadStream(fixture('simple.commonform')) }}
  invoke(cli, inputs, function(outputs) {
    test.equal(
      outputs.stdout,
      fs.readFileSync(fixture('simple.commonform')).toString(),
      'render --format markup ' +
      'writes the markup to standard output')
    test.equal(
      outputs.status, 0,
      'render --format markup ' +
      'exits with status 0')
    test.end() }) })

test('render --format docx', function(test) {
  var inputs = {
    argv: [ 'render', '--format', 'docx' ],
    stdin: function() {
      return fs.createReadStream(fixture('simple.commonform')) }}
  invoke(cli, inputs, function(outputs) {
    test.equal(
      outputs.stdout.length > 0, true,
      'render --format docx ' +
      'writes the markup to standard output')
    test.equal(
      outputs.status, 0,
      'render --format docx ' +
      'exits with status 0')
    test.end() }) })

test('render --format docx --title', function(test) {
  var title = 'Agreement Title'
  var inputs = {
    argv: [ 'render', '--format', 'docx', '--title', title ],
    stdin: function() {
      return fs.createReadStream(fixture('simple.commonform')) }}
  invoke(cli, inputs, function(outputs) {
    test.equal(
      outputs.stdout.indexOf(title) > -1, true,
      'render --format docx --title ' +
      'writes the markup to standard output')
    test.equal(
      outputs.status, 0,
      'render --format docx --title ' +
      'exits with status 0')
    test.end() }) })

test('render --format docx --title --left-align-title', function(test) {
  var title = 'Agreement Title'
  var inputs = {
    argv: [
      'render',
      '--format', 'docx',
      '--title', title,
      '--left-align-title'],
    stdin: function() {
      return fs.createReadStream(fixture('simple.commonform')) }}
  invoke(cli, inputs, function(outputs) {
    test.equal(
      outputs.stdout.indexOf(title) > -1, true,
      'render --format docx --title --left-align-title ' +
      'writes the markup to standard output')
    test.equal(
      outputs.status, 0,
      'render --format docx --title --left-align-title ' +
      'exits with status 0')
    test.end() }) })

test('render --format docx --blanks', function(test) {
  var inputs = {
    argv: [
      'render',
      '--format', 'docx',
      '--blanks', fixture('blanks.json') ],
    stdin: function() {
      return fs.createReadStream(fixture('simple.commonform')) }}
  invoke(cli, inputs, function(outputs) {
    test.equal(
      outputs.stdout.indexOf('Purchasers') > -1, true,
      'render --format docx --blanks ' +
      'writes the markup to standard output')
    test.equal(
      outputs.status, 0,
      'render --format docx --blanks ' +
      'exits with status 0')
    test.end() }) })

test('render --format docx --indent-margins', function(test) {
  var inputs = {
    argv: [
      'render',
      '--format', 'docx',
      '--indent-margins' ],
    stdin: function() {
      return fs.createReadStream(fixture('simple.commonform')) }}
  invoke(cli, inputs, function(outputs) {
    test.equal(
      outputs.stdout.indexOf('Purchasers') > -1, true,
      'render --format docx --indent-margins ' +
      'writes the markup to standard output')
    test.equal(
      outputs.status, 0,
      'render --format docx --indent-margins ' +
      'exits with status 0')
    test.end() }) })

test('render --format docx --blanks invalid.json', function(test) {
  var inputs = {
    argv: [
      'render',
      '--format', 'docx',
      '--blanks', fixture('invalid.json') ],
    stdin: function() {
      return fs.createReadStream(fixture('simple.commonform')) }}
  invoke(cli, inputs, function(outputs) {
    test.equal(
      outputs.status, 1,
      'render --format docx --blanks ' +
      'exits with status 1')
    test.end() }) })

test('render --format docx --signatures', function(test) {
  var inputs = {
    argv: [
      'render',
      '--format', 'docx',
      '--signatures', fixture('sigs.json') ],
    stdin: function() {
      return fs.createReadStream(fixture('simple.commonform')) }}
  invoke(cli, inputs, function(outputs) {
    test.equal(
      outputs.status, 0,
      'render --format docx --signatures ' +
      'exits with status 0')
    test.end() }) })

test('render --format markdown', function(test) {
  var inputs = {
    argv: [ 'render', '--format', 'markdown' ],
    stdin: function() {
      return fs.createReadStream(fixture('simple.json')) }}
  invoke(cli, inputs, function(outputs) {
    test.equal(
      outputs.stdout.length > 0, true,
      'render --format markdown ' +
      'writes the markup to standard output')
    test.equal(
      outputs.status, 0,
      'render --format markdown ' +
      'exits with status 0')
    test.end() }) })

test('render --format markdown --blanks', function(test) {
  var inputs = {
    argv: [
      'render',
      '--format', 'markdown',
      '--blanks', fixture('blanks.json') ],
    stdin: function() {
      return fs.createReadStream(fixture('simple.json')) }}
  invoke(cli, inputs, function(outputs) {
    test.equal(
      outputs.stdout.indexOf('NewCo') > -1, true,
      'render --format markdown --blanks ' +
      'writes the markup to standard output')
    test.equal(
      outputs.status, 0,
      'render --format markdown --blanks ' +
      'exits with status 0')
    test.end() }) })

test('render --format html', function(test) {
  var inputs = {
    argv: [ 'render', '--format', 'html' ],
    stdin: function() {
      return fs.createReadStream(fixture('simple.json')) }}
  invoke(cli, inputs, function(outputs) {
    test.equal(
      outputs.stdout,
      fs.readFileSync(fixture('simple.html')).toString(),
      'render --format html ' +
      'writes HTML to standard output')
    test.equal(
      outputs.status, 0,
      'render --format html ' +
      'exits with status 0')
    test.end() }) })

test('render --format html --blanks', function(test) {
  var inputs = {
    argv: [
      'render',
      '--format', 'html',
      '--blanks', fixture('blanks.json') ],
    stdin: function() {
      return fs.createReadStream(fixture('simple.json')) }}
  invoke(cli, inputs, function(outputs) {
    test.equal(
      outputs.stdout,
      fs.readFileSync(fixture('simple-with-blanks.html')).toString(),
      'render --format html --blanks ' +
      'writes HTML to standard output')
    test.equal(
      outputs.status, 0,
      'render --format html --blanks ' +
      'exits with status 0')
    test.end() }) })

test('render --format html --ordered-lists', function(test) {
  var inputs = {
    argv: [
      'render',
      '--format', 'html',
      '--ordered-lists' ],
    stdin: function() {
      return fs.createReadStream(fixture('simplified-lists.json')) }}
  invoke(cli, inputs, function(outputs) {
    test.equal(
      outputs.stdout,
      fs.readFileSync(fixture('simplified-lists.html')).toString(),
      'render --format html --ordered-lists ' +
      'writes HTML to standard output')
    test.equal(
      outputs.status, 0,
      'render --format html --ordered-lists ' +
      'exits with status 0')
    test.end() }) })

test('render --format html5', function(test) {
  var inputs = {
    argv: [ 'render', '--format', 'html5' ],
    stdin: function() {
      return fs.createReadStream(fixture('simple.json')) }}
  invoke(cli, inputs, function(outputs) {
    test.equal(
      outputs.stdout,
      fs.readFileSync(fixture('simple.html5')).toString(),
      'render --format html5 ' +
      'writes HTML5 to standard output')
    test.equal(
      outputs.status, 0,
      'render --format html5 ' +
      'exits with status 0')
    test.end() }) })

test('render --format html5 --blanks', function(test) {
  var inputs = {
    argv: [
      'render',
      '--format', 'html5',
      '--blanks', fixture('blanks.json') ],
    stdin: function() {
      return fs.createReadStream(fixture('simple.json')) }}
  invoke(cli, inputs, function(outputs) {
    test.equal(
      outputs.stdout,
      fs.readFileSync(fixture('simple-with-blanks.html5')).toString(),
      'render --format html5 --blanks ' +
      'writes HTML5 to standard output')
    test.equal(
      outputs.status, 0,
      'render --format markup --blanks ' +
      'exits with status 0')
    test.end() }) })

test('render --format docx --number nonexistent', function(test) {
  var inputs = {
    argv: [ 'render', '--format', 'docx', '--number', 'nonexistent' ],
    stdin: function() {
      return fs.createReadStream(fixture('simple.json')) }}
  invoke(cli, inputs, function(outputs) {
    test.ok(
      outputs.stderr
        .indexOf('"nonexistent" is not a valid numbering style') > -1,
      'render --format docx --number nonexistent ' +
      'writes an error')
    test.equal(
      outputs.status, 1,
      'render --format docx --number nonexistent ' +
      'exits with status 1')
    test.end() }) })
