define([ 'ngResource' ], function() {
	angular.module('receiptServices', [ 'ngResource' ]).factory('Receipt', ['$resource', function($resource) {
		return $resource('trade/receipt/:receiptid', {}, {
			/*
			 * get,
			 */
			//平台查看有效入库单
			available : {
				url : 'trade/receipt/available',
				method : 'GET'
			},
			//平台查看无效入库单
			unavailable : {
				url : 'trade/receipt/unavailable',
				method : 'GET'
			},
			//获取入库单详情
			getReceipt : {
				url : 'trade/receipt/:receiptid',
				method : 'GET'
			},
			//获取和平台有交易的企业信息
			getReceiptByuu : {
				url : 'trade/receipt/findReceipt',
				method : 'GET'
			},
			//获取和平台有交易的企业信息(分页)
			getEnterByStatus : {
				url : 'trade/receipt/getEntersByStatus',
				method : 'GET'
			},
			// 计算交易金额
			settleReceipt : {
				url : 'trade/receipt/settle/:ids',
				method : 'PUT'
			}
		});
	}]).factory('ReceiptVendor', ['$resource', function($resource) {
		return $resource('trade/receipt/vendor', {}, {
			// 获取供应商有效入库单
			settled : {
				url : 'trade/receipt/vendor/settled',
				method : 'GET'
			},
			notsettled : {
				url : 'trade/receipt/vendor/notsettled',
				method : 'GET'
			},
			// 获取供应商无效入库单
			unavailable : {
				url : 'trade/receipt/vendor/unavailable',
				method : 'GET'
			}
		});
	}]);
});