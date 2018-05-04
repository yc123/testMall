define([ 'app/app' ], function(app) {
	'use strict';
	
	app.register.controller('PageSettingCtrl', function($scope, pageConfig) {
		$scope.config = pageConfig;
	});
});