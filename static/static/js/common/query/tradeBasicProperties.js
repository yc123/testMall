define([ 'ngResource'], function() {
	angular.module('tradeBasicPropertiesServices', [ 'ngResource']).factory('tradeBasicProperties', ['$resource' , function($resource) {
		return $resource('trade/tradebasicproperties/get', {}, {
			save: {
				url : 'trade/tradebasicproperties/save',
				method : 'POST'
			},
			get: {
				url : 'trade/tradebasicproperties/get/:type',
				method : 'GET'
			},
			getB2CPayTime: {
				url : 'trade/tradebasicproperties/get/buyer/paytime',
				method : 'GET'
			},
            saveBuyer: {
                url : 'trade/tradebasicproperties/saveBuyer',
                method : 'GET'
            }
		});
	}]);
});