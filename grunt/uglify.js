module.exports = function(grunt) {
  var pathUtil = require("path");

  return {
    // bundle to out
    compile: {
      options: {
        beautify: true,
        enclose: true,
        mangle: false,
        compress: false,
        indentLevel: 2
      },
      src: "<%=pkg.bundle%>",
      dest: pathUtil.join("<%=env.OUT_DIR%>", "<%=env.OUT_BUNDLE_FILE%>")
    },
    compress: {
      options: {
        sourceMap: true,
        beautify: false
      },
      src: [pathUtil.join("<%=env.DIST_DIR%>", "<%=env.OUT_BUNDLE_FILE%>")],
      dest: "<%=env.DIST_DIR%>/<%=env.OUT_MIN_FILE%>"
    },
    compressWithDeps: {
      options: {
        sourceMap: true,
        beautify: false
      },
      src: [
        "<%=env.APP_DIR%>/bower_components/promise-extras/dist/promise-extras.min.js",
        pathUtil.join("<%=env.DIST_DIR%>", "<%=env.OUT_BUNDLE_FILE%>")
      ],
      dest: "<%=env.DIST_DIR%>/<%=env.OUT_BUNDLE_MIN_FILE%>"
    }
  };
};
