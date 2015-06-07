var assert = require('assert');
var assign = require('object-assign');
var streambuffers = require('stream-buffers');
var WritableStreamBuffer = streambuffers.WritableStreamBuffer;
var ReadableStreamBuffer = streambuffers.ReadableStreamBuffer;

var streams = ['stdin', 'stdout', 'stderr'];

module.exports = function(cli, customInputs, callback) {
  var defaultInput = new ReadableStreamBuffer();
  var inputs = {
    stdin: defaultInput,
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
      assert.ifError(new Error('.end() was called on ' + key));
    };
  });
  defaultInput.destroySoon();
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
