var expect = require('chai').expect;
var assign = require('object-assign');
var streambuffers = require('stream-buffers');
var WritableStreamBuffer = streambuffers.WritableStreamBuffer;
var ReadableStreamBuffer = streambuffers.ReadableStreamBuffer;

var streams = ['stdin', 'stdout', 'stderr'];

module.exports = function(cli, customInputs, callback) {
  var inputs = {
    stdin: new ReadableStreamBuffer(),
    stdout: new WritableStreamBuffer(),
    stderr: new WritableStreamBuffer(),
    env: {},
    argv: []
  };
  assign(inputs, customInputs);
  streams.forEach(function(key) {
    if (typeof inputs[key] === 'function') {
      inputs[key] = inputs[key]();
    }
    inputs[key].end = function() {
      expect.fail(0, 1, '.end() was called on ' + key);
    };
  });
  cli(
    inputs.stdin,
    inputs.stdout,
    inputs.stderr,
    inputs.env,
    inputs.argv,
    function(status) {
      callback({
        status: status,
        stdout: inputs.stdout.getContentsAsString('utf8'),
        stderr: inputs.stderr.getContentsAsString('utf8')
      });
    }
  );
};
