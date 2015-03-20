module.exports = function (grunt) {
  var pathUtil = require("path");

  require('load-grunt-config')(grunt, {
    configPath: pathUtil.join(process.cwd(), 'grunt'),
    config: require("./grunt/environment")(grunt, __dirname)
  });

  require("./grunt/custom/register-karma-runner")(grunt);
};