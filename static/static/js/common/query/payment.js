define([ 'ngResource' ], function() {
	angular.module('PaymentService', [ 'ngResource' ]).factory('Ysepay', ['$resource', 'BaseService', function($resource, BaseService) {

		var rootPath = BaseService.getRootPath();
		return $resource('payment', {}, {
			// 支付宝生成签名和签名方式，然后返回支付宝的请求参数数组
			paymentSign: {
				url : 'api/payment/ysepaySign',
				method : 'POST'
			},	
			accountSign: {
				url : 'api/payment/accountSign',
				method : 'POST'
			},
			refundSign: {
				url : 'api/payment/refundSign',
				method : 'POST'
			},
			orderQuerySign: {
				url : 'api/payment/orderQuerySign',
				method : 'POST'
			},
			refundQuerySign: {
				url : 'api/payment/refundQuerySign',
				method : 'POST'
			},
			findTradeRecordChart: {
				url : 'api/payment/findTradeRecordChart',
				method : 'GET'
			},
			findTradeRecordChartOfUser : {
				url : rootPath + '/trade/payment/findTradeRecordChartOfUser',
				method : 'GET'
			}
		});
	}]).factory('TradeRecordChart', ['$resource', function($resource) {
		return $resource('api/payment/findTradeRecordChart', {}, {
			// 按已付款或已退款得到交易明细表
			payment : {
				url : 'api/payment/findTradeRecordChart/payment',
				method : 'GET'
			},
			refund : {
				url : 'api/payment/findTradeRecordChart/refund',
				method : 'GET'
			},
		});
	}]).factory('Payment', ['$resource', function($resource) {
		return $resource('/trade/payment', {}, {
			findByRequestId: {
				url : 'trade/payment/detail/:requestId',
				method : 'GET'
			},
			findPurchaseDetails : {
				url : 'trade/payment/purchaseDetail/:details',
				method : 'GET',
				isArray: true
			},
		})
	}]);
});