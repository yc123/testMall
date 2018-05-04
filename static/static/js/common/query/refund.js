define(['ngResource'], function() {
	angular.module('refundModule', ['ngResource']).factory('refundService', ['$resource', function($resource) {
		return $resource('trade/refund', {}, {
			getRefundById : {
				url : 'trade/refund/:id',
				method : 'GET'
			},
			getRefundAllByB2C : {
				url : 'trade/refund/b2c/all',
				method : 'GET'
			},
			handleRefund : {
				url : 'trade/refund/:reid/refund',
				method : 'GET'
			},
			handleOfflineRefund	: {
				// 处理线下退款的转账记录
				url		: 'trade/refund/:reid/offline',
				method	: 'GET'
			},
			pageOnesRefundByKeyword : {
				// 分页获取买家的退款单信息
				url		: 'trade/refund/buyer',
				method	: 'GET'
			},
			getRefundByRefundId : {
				// 根据退款单编号ID获取退款单信息
				url		: 'trade/refund/voucher/:refundId',
				method	: 'GET'
			}
		});
	}]);
});