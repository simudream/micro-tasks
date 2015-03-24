(function () {
	"use strict";
	var app = angular.module('app', ['ngRoute', 'app.controllers', 'app.filters', 'app.directives']);

	marked.setOptions({
		highlight: function (code) {
			return hljs.highlightAuto(code).value;
		}
	});

	app.constant("marked", window.marked);
	app.constant("hljs", window.hljs);
	app.constant('yuidocDataPath', 'dist/doc/data.json');
	app.constant('querifySync', querify.sync);
//#{{module.name | idEncode}}_{{className | idEncode}}_{{classItem.name | idEncode}}
}());