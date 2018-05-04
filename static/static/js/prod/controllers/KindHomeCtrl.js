define([ 'app/app' ], function(app) {
	'use strict';
	app.register.controller('KindHomeCtrl', ['$scope', 'KindAPI', '$stateParams', '$modal', 'toaster', 'SmoothScroll',function($scope, KindAPI, $stateParams, $modal, toaster, SmoothScroll) {
		// 滚动至指定Id的
		$scope.scrollTo = function(el) {
			SmoothScroll.scrollTo(null, el, 35);
		};
		
		KindAPI.getAllChildren({
			parentId: 0
		}, function(data) {
			$scope.kinds = data;
			angular.forEach($scope.kinds, function(kind){
				kind.namelength = kind.nameCn.length;
			});
		}, function(response) {
			toaster.pop('error', '获取类目信息失败', response);
		});
		
	}]);
	
});