var inquirer = require('inquirer');

module.exports = function(values, callback) {
  var questions = values.map(function(field) {
    return {
      type: 'input',
      name: field,
      message: field,
      filter: function(value) {
        return value.length < 1 ? undefined : value;
      }
    };
  });
  inquirer.prompt(questions, function(answers) {
    callback(Object.keys(answers).reduce(function(values, name) {
      if (answers[name] !== undefined) {
        values[name] = answers[name];
      }
      return values;
    }, {}));
  });
};
