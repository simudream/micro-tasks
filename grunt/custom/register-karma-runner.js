module.exports = function(grunt) {
	var taskName = 'karmaRunner';
	return grunt.task.registerMultiTask(taskName, '', function() {
		return grunt.task.run([
			"clean:testArtifacts",
			"compile",
			"karma:" + this.target
		]);
	});
};
