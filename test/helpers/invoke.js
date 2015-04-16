var assign = require('object-assign');
var streambuffers = require('stream-buffers');
var WritableStreamBuffer = streambuffers.WritableStreamBuffer;
var ReadableStreamBuffer = streambuffers.ReadableStreamBuffer;

module.exports = function(cli, customInputs, callback) {
  var inputs = {
    stdin: new ReadableStreamBuffer(),
    stdout: new WritableStreamBuffer(),
    stderr: new WritableStreamBuffer(),
    env: {},
    argv: []
  };
  assign(inputs, customInputs);
  cli(
    inputs.stdin,
    inputs.stdout,
    inputs.stderr,
    inputs.env,
    inputs.argv,
    function(status) {
      inputs.stdout.end();
      inputs.stderr.end();
      callback({
        status: status,
        stdout: inputs.stdout.getContentsAsString('utf8'),
        stderr: inputs.stderr.getContentsAsString('utf8')
      });
    }
  );
};
