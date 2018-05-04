define([ 'ngResource'], function() {
	angular.module('tradeDeliveryDelayTimeModule', [ 'ngResource']).factory('tradeDeliveryDelayTimeServices', ['$resource' , function($resource) {
		return $resource('trade/tradeDeliveryDelayTime/get', {}, {
			save: {
				url : 'trade/tradeDeliveryDelayTime/save',
				method : 'POST',
				isArray : 'true'
			},
			get: {
				url : 'trade/tradeDeliveryDelayTime/get',
				method : 'GET',
				isArray : 'true'
			},
		});
	}]);
});