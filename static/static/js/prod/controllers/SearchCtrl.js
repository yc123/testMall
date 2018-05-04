define([ 'app/app' ], function(app) {
	'use strict';
	app.register.controller('SearchCtrl', ['$scope', 'toaster', '$stateParams', function($scope, toaster, $stateParams) {
		$scope.keywords = $stateParams.keywords;
	}]);
});