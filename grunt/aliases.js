module.exports = {

  "default": [
    "compile"
  ],

  "compile": [
    "clean:srcArtifacts",
    "uglify:compile"
  ],

  "publish:patch": [
    "test",
    "bump:patch",
    "dist"
  ],

  "publish:minor": [
    "test",
    "bump:minor",
    "dist"
  ],

  "publish:major": [
    "test",
    "bump:major",
    "dist"
  ],

  "dist": [
    "compile",
    "copy:outToDist",
    "uglify:compress",
    "yuidoc:generateJSON"
  ],

  "test": [
    "karmaRunner:singleRunFirefox"
  ],

  "testOpt": [
    "compile",
    "shell:nodeWithNativesTest"
  ]

};
