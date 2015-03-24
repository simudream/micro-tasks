(function () {

	"use strict";

	var repositories = angular.module("app.repositories", ["ngResource"]);

	repositories.service("dbProvider", function ($resource, yuidocDataPath) {
		return {
			getDataset: function () {

				var paramDefaults = {},
					actions = {
						cache: true
					};

				return $resource(yuidocDataPath, paramDefaults, actions)
					.get()
					.$promise;
			}
		};
	});

	repositories.service("projectRepository", function (dbProvider) {
		return {
			get: function () {
				return dbProvider.getDataset().then(
					function (dataset) {
						return dataset.project;
					}
				);
			}
		};
	});

	repositories.service("modulesRepository", function (dbProvider) {
		return {
			all: function () {
				return dbProvider.getDataset().then(
					function (dataset) {
						return dataset.modules;
					}
				);
			}
		};
	});

	repositories.service("classesRepository", function (dbProvider, querifySync) {

		var cachedClasses;

		return {
			all: function () {
				if (cachedClasses === undefined) {
					return dbProvider.getDataset().then(
						function (dataset) {
							cachedClasses = dataset.classes;
							return cachedClasses;
						}
					);
				}
				return cachedClasses;
			},
			extract: function (query) {
				return querifySync.extract(cachedClasses, query);
			}
		};
	});

	repositories.service("classitemsRepository", function (dbProvider, querifySync) {

		var cachedClassItems;

		return {
			all: function () {
				if (cachedClassItems === undefined) {
					return dbProvider.getDataset().then(
						function (dataset) {
							cachedClassItems = dataset.classitems;
							return cachedClassItems;
						}
					);
				}
				return cachedClassItems;
			},
			filter: function (query) {
				return querifySync.filter(cachedClassItems, query);
			}
		};
	});

}());
