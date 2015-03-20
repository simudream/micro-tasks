module.exports = function(grunt) {
  return {
    options: {
      filepaths: ['package.json', 'bower.json'],
      syncVersions: true,
      commit: false,
      tag: false
    }
  };
};
