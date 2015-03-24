(function () {
	"use strict";

	var controllers = angular.module("app.controllers", ["app.services", "ngSanitize"]);

	controllers.controller("appController",
		function appController($scope, docService, marked) {

			$scope.beforeAnim = function(e, animationContext) {

				//console.log(e, animationContext);
				animationContext.run();
			};
			//
			//$scope.afterAnim = function(e, animationContext) {
			//
			//	console.log(e, animationContext);
			//
			//	animationContext.nodeHelper.removeClass(e.target, animationContext.behavior);
			//};


			$scope.marked = marked;

			// fetch the data
			docService.getProject()
				.then(function (project) {
					$scope.project = project;
				})
				.then(docService.getModules)
				.then(function (modules) {
					$scope.modules = modules;
				})
				.then(docService.getClasses)
				.then(function (classes) {
					$scope.classes = classes;
				})
				.then(docService.getClassItems)
				.then(function (classItems) {
					$scope.classItems = classItems;
				})
				.then(docService.getGlobalClasses)
				.then(function (globalClasses) {
					$scope.globalClasses = globalClasses;
				})
				.then(function () {
					AniJS.run();
				})
				.catch(function (error) {
					console.error(error);
				});

			$scope.getClassesByModuleName = docService.getClassesByModuleName;
			$scope.getClassItemsByModuleAndClassName = docService.getClassItemsByModuleAndClassName;

		}
	);

	controllers.controller("sidebarController",
		function sidebarController($scope) {
			$scope.allSidebarFilterText = "";
			$scope.classesSidebarFilterText = "";
			$scope.modulesSidebarFilterText = "";
			$scope.methodsSidebarFilterText = "";
			$scope.propertiesSidebarFilterText = "";
		}
	);

	controllers.controller("iconSidebarController",
		function iconSidebarController($scope, elementService, iconSidebarService) {

			function setupPopovers() {

				var bsPopoverOpts = {
					delay: {"show": 1, "hide": 1},
					trigger: 'hover',
					viewport: 'body',
					container: 'body'
				};

				$(".iconSidebar .btn-pill")
					.popover(bsPopoverOpts)
					.click(function (event) {

						if (elementService.isElementActive(event.currentTarget)) {
							iconSidebarService.closeSidebar(event.currentTarget);
						} else {
							iconSidebarService.closeOpenSidebars();
							iconSidebarService.openSidebar(event.currentTarget);
						}

					});

			}

			setupPopovers();
		}
	);

}());