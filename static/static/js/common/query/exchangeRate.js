define([ 'ngResource' ], function() {
	angular.module('exchangeRateModule', [ 'ngResource' ]).factory('exchangeRateService', ['$resource', function($resource) {
		return $resource('trade/ExchangeRate', {}, {
			save: {
				url : 'trade/ExchangeRate/save',
				method : 'POST'
			},
			getUSD: {
				url : 'trade/ExchangeRate/get',
				method : 'GET',
				params : {
					type : 'USD'
				}
			}
		})
	}]);
});