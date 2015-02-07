var url = require('url');

var inquirer = require('inquirer');
var validate = require('commonform-validate');
var validator = require('validator');

var configuration = require('./configuration');
var libraries = configuration.get('libraries');
var libraryNames = Object.keys(libraries);
var librariesLength = libraryNames.length;

var splitAuth = function(url) {
  var split = url.auth.split(':');
  url.auth = {user: split[0], password: split[1]};
  return url;
};

module.exports = function(options, callback) {
  var library;
  var name = options['--library'];
  if (name) {
    if (libraries.hasOwnProperty(name)) {
      library = url.parse(libraries[name]);
      callback(splitAuth(library));
    } else {
      console.error('Unknown library, "' + name + '"');
      process.exit(1);
    }
  } else if (librariesLength === 1) {
    callback(
      splitAuth(url.parse(libraries[libraryNames[0]]))
    );
  } else if (librariesLength === 0) {
    inquirer.prompt([
      {
        message: 'Enter a library URL',
        name: 'hostname',
        validate: function(argument) {
          return validator.isFQDN(argument) || validator.isIP(argument);
        }
      },
      {
        message: 'User name',
        name: 'user',
        validate: validate.userName.bind(validate)
      },
      {
        message: 'Password',
        name: 'password',
        type: 'password',
        validate: validate.password.bind(validate)
      },
    ], function(answers) {
      callback(url.format({
        auth: {
          user: answers.user,
          password: answers.password
        },
        protocol: 'https:',
        port: answers.port,
        hostname: answers.hostname
      }));
    });
  } else {
    inquirer.prompt([{
      choices: libraryNames,
      default: 0,
      message: 'Which library would you like to use?',
      name: 'library',
      type: 'list'
    }], function(answers) {
      callback(
        splitAuth(url.parse(libraries[answers.library]))
      );
    });
  }
};
