define([ 'ngResource' ], function() {
	angular.module('responseLogisticsService', [ 'ngResource' ]).factory('ResponseLogistics', ['$resource', function($resource) {
		//获取物流信息
		return $resource('trade/responseLogistics', {}, {
			get : {
				url : 'trade/responseLogistics/:id',
				method : 'GET'
			}
		});
	}]);
});