define([ 'ngResource' ], function() {
	angular.module('billServices', [ 'ngResource' ]).factory('Bill', ['$resource', function($resource) {
		//获取ComponentSubmit的分页数据
		return $resource('trade/bill', {}, {
			findBills : {
				url : 'trade/bill/all',
				method : 'GET'
			},
			save : {
				url : 'trade/bill/save',
				method : 'POST'
			},
			saveAdmin : {
				url : 'trade/bill/save/admin',
				method : 'POST'
			},
			getListPersonal : {
				url : 'trade/bill/list/personal',
				method : 'GET',
				isArray : 'true'
			},
			getListAdmin : {
				url : 'trade/bill/list/admin',
				method : 'GET',
				isArray : 'true'
			},
			getBillById :{
				url : 'trade/bill/:id',
				method : 'GET'
			},
			deleteById : {
				url : 'trade/bill/delete/:id',
				method : 'DELETE'
			},
			getPersonalSpecial : {
				url : 'trade/bill/personal',
				method : 'GET',
				params : {
					'type' : 'special'
				}
			}
		});
	}]).factory('BillSubmit', ['$resource', function($resource) {
			//获取ComponentSubmit的分页数据
		return $resource('trade/billSubmit', {}, {
			submitBillApply : {
				url : ' trade/billSubmit',
				method : 'POST',
				isArray: true
			},
			getSubmitBillApply : {
				url : ' trade/billSubmit',
				method : 'GET'
			},
			sureBillApply : {
				url : 'trade/billSubmit/:ids',
				method : 'PUT',
				isArray : 'true'
			}

		});
	}]);
});