define(['ngResource'], function(ngResource) {
	angular.module('bankTransfer', ['ngResource']).factory('bankTransferService', ['$resource', function($resource) {
		return $resource('trade/transfer', {}, {
			saveTransfer : {
				method : 'POST'
			},
			saveTransferFvender : {
				url : 'trade/transfer/vender',
				method : 'POST'
			},
			saveTransferFreturn : {
				url : 'trade/transfer/return',
				method : 'POST'
			},
 			getHisBankTransfer : {
				url : 'trade/transfer/history',
				method : 'GET'
			},
			getAdminBankTransfer : {
				url : 'trade/transfer/admins/history',
				method : 'GET'
			},
			//统计供应商收支总体情况
			getFaInOut : {
				url : 'trade/transfer/fainout',
				method : 'GET'
			},
			// 根据转账流水单id查找转账信息（客户）
			getBankTransferWithUser : {
				url : 'trade/transfer/findOne/:banktfid',
				method : 'GET'
			},
			// 根据转账流水单id查找转账信息（客户）
			getBankTransferByid : {
				url : 'trade/transfer/findByid/:banktfid',
				method : 'GET'
			},
			// 根据转账来源订单id查找转账信息（客户）
			getBankTransferByOrid : {
				url : 'trade/transfer/findByOrid/:orderid',
				method : 'GET'
			},
			// 根据转账来源订单orderId查找转账信息（客户）
			getBankTransferByOrderid : {
				url : 'trade/transfer/findByOrderId/:orderid',
				method : 'GET'
			},
			getVendorBankTransferByMall : {
				url : 'trade/transfer/vendor/bankTransfer/page',
				method : 'GET',
				params : {
					type : 'sup'
				}
			}
		});
	}]);
})