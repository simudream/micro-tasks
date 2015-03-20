module.exports = function(config) {

  "use strict";

  return config.set({
    basePath: '../',
    port: 9876,
    frameworks: ['mocha', 'chai'],
    reporters: ['dots'],
    log: 'karma/karma.log',
    colors: true,
    plugins: [
      'karma-chrome-launcher',
      'karma-ie-launcher',
      'karma-firefox-launcher',
      'karma-script-launcher',
	  'karma-mocha',
      'karma-chai',
      'karma-coverage'
    ],
    //preprocessors: {
    //    'src/**/*.js': ['coverage']
    //},
    //coverageReporter: {
    //    type: 'html',
    //    dir: 'karma/coverage/'
    //},
    files: [
      '../out/micro-task-queue.js',
      'src/unit/*.js'
    ],
    browsers: ['Chrome'],
    singleRun: false
  });

};
