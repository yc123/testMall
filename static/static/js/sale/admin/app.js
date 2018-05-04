define([ 'angular', 'ui-bootstrap' ], function(angular) {
	'use strict';
	var app = angular.module('myApp', [ 'ui.bootstrap' ]);
	app.init = function() {
		angular.bootstrap(document, [ 'myApp' ]);
	};
	app.controller('SearchCtrl', function($scope) {
		// 搜索类型=综合搜索
		$scope.searchType = '0';
		// 关键字
		$scope.hotwords = [ 'PCB', 'IC', '变压器', '光敏电阻', '传感器', '电感', '电容' ];
	});
	return app;
});