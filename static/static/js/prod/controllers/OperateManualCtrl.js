define(['app/app'], function(app) {
	'use strict';
	app.register.controller('operateManualCtrl', ['$scope', function($scope) {
		$scope.status = 'Buyer';
		$scope.see = function(status) {
			$scope.status = status;
		}
	}]);
});