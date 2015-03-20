module.exports = function(grunt) {
  return {
    options: {
      configFile: '<%=env.TEST_DIR%>/karma/default-config.js'
    },
    chrome: {
      browsers: ['Chrome'],
      singleRun: false
    },
    firefox: {
      browsers: ['Firefox'],
      singleRun: false
    },
    ie: {
      browsers: ['IE'],
      singleRun: false
    },
    singleRunFirefox: {
      browsers: ['Firefox'],
      singleRun: true
    },
    all: {
      browsers: ['Chrome', 'Firefox', 'IE']
    }
  };
};
