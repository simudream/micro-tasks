module.exports = function (grunt) {
  return {
    "nodeWithNativesTest": {
      command: "node --allow-natives-syntax <%=env.TEST_DIR%>/src/optimisation-test-runner.js",
      options: {
        stdout: true,
        stderr: true,
        failOnError: true,
        execOptions: {
          cwd: "<%=env.PROJECT_DIR%>"
        }
      }
    },
    "projectz": {
      command: "projectz --path <%=env.PROJECT_DIR%> compile",
      options: {
        stdout: true,
        stderr: true,
        failOnError: true,
        execOptions: {
          cwd: "<%=env.PROJECT_DIR%>/node_modules/.bin"
        }
      }
    }
  };
};
