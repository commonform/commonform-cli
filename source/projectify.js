var validate = require('commonform-validate');

module.exports = function(object) {
  if (validate.nestedForm(object)) {
    return {
      commonform: validate.version,
      metadata: {title: 'Untitled'},
      preferences: {},
      values: {},
      form: object
    };
  } else if (validate.project(object)) {
    return object;
  } else {
    process.stderr.write('Unable to format the result');
    process.exit(1);
  }
};
