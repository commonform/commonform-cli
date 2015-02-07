var url = require('url');

var inquirer = require('inquirer');
var validate = require('commonform-validate');
var validator = require('validator');

var configuration = require('./configuration');

module.exports = function(options, callback) {
  var servers = Object.keys(configuration.servers).map(function(key) {
    return configuration.servers[key];
  });
  if (options['--server']) {
    callback(url.parse(options['--server']));
  } else if (servers.length === 1) {
    callback(url.parse(servers[0]));
  } else if (servers.length === 0) {
    inquirer.prompt([
      {
        message: 'Enter a server URL',
        name: 'hostname',
        validate: function(argument) {
          return validator.isFQDN(argument) || validator.isIP(argument);
        }
      },
      {
        message: 'User name',
        name: 'user',
        // TODO: Change to commonform.userName
        validate: validate.term.bind(validate)
      },
      {
        message: 'Password',
        name: 'password',
        type: 'password',
        validate: validate.password.bind(validate)
      },
    ], function(answers) {
      callback(url.format({
        auth: answers.user + ':' + answers.password,
        port: answers.port,
        hostname: answers.hostname
      }));
    });
  } else {
    inquirer.prompt([{
      choices: servers,
      default: 0,
      message: 'Which server?',
      name: 'server',
      type: 'list'
    }], function(answers) {
      callback(url.parse(answers.server));
    });
  }
};
