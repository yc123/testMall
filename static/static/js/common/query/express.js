define([ 'ngResource' ], function() {
	angular.module('expressServices', [ 'ngResource' ]).factory('Express', ['$resource', function($resource) {
		//获取ComponentSubmit的分页数据
		return $resource('', {}, {
			
		});
	}]);
});