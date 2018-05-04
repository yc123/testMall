define([ 'ngResource' ], function() {
	angular.module('Charge', [ 'ngResource' ]).factory('Charge', ['$resource', function($resource) {
		return $resource('trade/charge/:id', {}, {
			refuse: {
				url : 'trade/charge/refuse',
				method : 'PUT'
			},
			accept: {
				url : 'trade/charge/accept',
				method : 'PUT'
			},
			findCharges: {
				url : 'trade/charge/individual',
				method : 'GET'
			}
		});
	}]);
});