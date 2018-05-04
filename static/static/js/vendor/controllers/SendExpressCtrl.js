define(['app/app'], function(app) {
	'use strict';
	app.register.controller('SendExpressCtrl', ['$scope', 'toaster', '$stateParams', 'Express', 'BaseService', function($scope, toaster, $stateParams, Express, BaseService) {
		BaseService.scrollBackToTop();
	}]);
	
});