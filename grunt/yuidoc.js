module.exports = function(grunt) {
  return {
    generateJSON: {
      name: '<%= package.name %>',
      description: '<%= package.description %>',
      version: '<%= package.version %>',
      url: '<%= package.homepage %>',
      options: {
        paths: "<%=env.SRC_RELATIVE_DIR%>",
        outdir: "./dist/doc",
        markdown: "true",
        attributesEmit: "true",
        linkNatives: "true",
        nocode: "true",
        parseOnly: "true"
      }
    }
  };
};
