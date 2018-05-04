define([ 'ngResource' ], function() {
	angular.module('saleServices', [ 'ngResource' ]).factory('Customers', function($resource, Actions) {
		return $resource('sale/customers/:custId', {}, Actions.extend({
			queryByUU : {
				url : 'sale/customers/customer/:custUU',
				method : 'GET',
				params : {
					custUU : 'custUU'
				},
				isArray : true
			}
		}));
	}).factory('Orders', function($resource) {
		return $resource('sale/customers/:orderId', {}, {
			query : {
				method : 'GET',
				params : {
					orderId : 'orderId'
				},
				isArray : true
			}
		});
	}).factory('Actions', function() {
		var actions = {
			saveAll : {
				method : 'POST',
				isArray : true
			},
			audit : {
				method : 'PUT',
				params : {
					_method : 'audit'
				},
				isArray : true
			},
			unaudit : {
				method : 'PUT',
				params : {
					_method : 'unaudit'
				},
				isArray : true
			}
		};
		return {
			copy : function() {
				return angular.copy(actions);
			},
			extend : function(obj) {
				return angular.extend(angular.copy(actions), obj);
			}
		};
	});
});