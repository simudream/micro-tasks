module.exports = function (grunt, gruntRootPath) {
  var config,
    env = {},
    outFilename,
    pathUtil = require("path");

  env.PROJECT_DIR = process.cwd();
  env.WINDOWS = process.platform.indexOf('win') === 0;
  env.NODE_PATH = process.execPath;
  env.NODE = pathUtil.basename(env.NODE_PATH);
  env.NPM = (env.WINDOWS ? env.NODE_PATH.replace('node.exe', 'npm.cmd') : 'npm');
  env.EXT = (env.WINDOWS ? '.cmd' : '');
  env.EXTD_PATH = pathUtil.join(env.PROJECT_DIR, ".cake");
  env.PACKAGE_PATH = pathUtil.join(env.PROJECT_DIR, "package.json");
  env.PACKAGE_DATA = require(env.PACKAGE_PATH);
  env.SRC_RELATIVE_DIR = "./src";
  env.SRC_DIR = pathUtil.join(env.PROJECT_DIR, env.SRC_RELATIVE_DIR);
  env.OUT_RELATIVE_DIR = "./out";
  env.OUT_DIR = pathUtil.join(env.PROJECT_DIR, env.OUT_RELATIVE_DIR);
  env.MODULES_DIR = pathUtil.join(env.PROJECT_DIR, "node_modules");
  env.BOWER_DIR = pathUtil.join(env.PROJECT_DIR, "bower_components");
  env.BIN_DIR = pathUtil.join(env.MODULES_DIR, ".bin");
  env.COFFEE = pathUtil.join(env.BIN_DIR, "coffee" + env.EXT);
  env.TEST_DIR = pathUtil.join(env.PROJECT_DIR, "test");
  env.TEST_SRC_DIR = pathUtil.join(env.TEST_DIR, "src");

  env.TEST_OUT_RELATIVE_DIR = "./test/out";
  env.TEST_OUT_DIR = pathUtil.join(env.TEST_DIR, "out");
  env.DIST_DIR = pathUtil.join(env.PROJECT_DIR, "dist");

  outFilename = pathUtil.basename(process.cwd());
  if (outFilename.substring(outFilename.length - 2) === 'js')
    outFilename = outFilename.substring(0, outFilename.length - 2);

  env.SRC_FILE = pathUtil.join(env.SRC_DIR, outFilename + ".js");
  env.OUT_BUNDLE_FILE = outFilename + ".js";
  env.OUT_TEST_BUNDLE_FILE = outFilename + "-tests.js";
  env.OUT_MIN_FILE = outFilename + ".min.js";
  env.OUT_BUNDLE_MIN_FILE = outFilename + ".all.min.js";
  env.CLEAN_FOLDERS = ["dist", "out", "log"];
  config = {
    env: env,
    pkg: grunt.file.readJSON("package.json")
  };
  return config;
};
