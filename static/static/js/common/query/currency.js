define([ 'ngResource' ], function() {
	angular.module('currencyService', [ 'ngResource' ]).factory('Currency', ['$resource', function($resource) {
		//获取ComponentSubmit的分页数据
		return $resource('trade/currency', {}, {
			//未审核
			getAllName : {
				url : 'trade/currency/name',
				method : 'GET',
				isArray : true
			}
		});
	}]);
});