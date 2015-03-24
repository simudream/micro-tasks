(function () {

	'use strict';

	var filters = angular.module("app.filters", []);

	filters.filter('idEncode', function () {
		return function (inValue) {
			if (inValue === undefined || inValue.length === 0)
				return inValue;
			else
				return inValue.replace(/[$]/g, "dollar_");
		};
	});

	filters.filter('objectFilter', function () {
		return function (items, filter) {
			if (!filter) {
				return items;
			}
			var result = {};
			angular.forEach(filter, function (filterVal, filterKey) {
				angular.forEach(items, function (item, key) {
					var fieldVal = item[filterKey];
					if (fieldVal && fieldVal.toLowerCase().indexOf(filterVal.toLowerCase()) > -1) {
						result[key] = item;
					}
				});
			});
			return result;
		};
	});

}());