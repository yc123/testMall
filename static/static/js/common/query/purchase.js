define([ 'ngResource' ], function() {
	angular.module('purchaseServices', [ 'ngResource' ]).factory('Purchase', ['$resource', 'BaseService', function($resource, BaseService) {

		var rootPath = BaseService.getRootPath();
		return $resource('trade/purchase/:purchaseid', {}, {
			/*
			 * get,获取purchaseid对应采购单
			 */
			get : {
				url : 'trade/purchase/purchaseId/:purchaseId',
				method : 'GET'
			},

			/**
			 * 管理员查看
			 */
			//管理员查看采购单
			getAdminPurchases : {
				url : 'trade/purchase/admin',
				method : 'GET'
			},
			//根据采购单号获取订单单号
			getOrderIdByPurchaseId : {
				url : 'trade/purchase/orderId/:purchaseId',
				method : 'GET'
			},
			//平台管理员根据快递单id查快递单
			getLogistics : {
				url : 'trade/purchase/:lgtid/logistics',
				method : 'GET'
			},
			/**
			 * 企业查看
			 */
			// 企业查看待出货
			EntTobeshipped : {
				url : 'trade/purchase/enterprise/tobeshipped',
				method : 'GET'
			},
			// 企业查看待收货
			EntInbound : {
				url : 'trade/purchase/enterprise/InBound',
				method : 'GET'
			},
			// 企业查看已收货
			EntReceived : {
				url : 'trade/purchase/enterprise/received',
				method : 'GET'
			},
			// 企业查看待收款
			EntToreceivemoney : {
				url : 'trade/purchase/enterprise/toreceivemoney',
				method : 'GET'
			},
			// 企业查看已付款
			EntPaid : {
				url : 'trade/purchase/enterprise/paid',
				method : 'GET'
			},
			// 企业查看采购单
			EntPurchaseDetail : {
				url : 'trade/purchase/enterprise/:purchaseid',
				method : 'GET'
			},
			// 供应商确认收款
			ensureReceivedMoney : {
				url : 'trade/purchase/ensurereceived/:ids',
				method : 'PUT',
				params : { _status : 'ensurereceived'}
			},
			//平台确认付款
			ensurePaid: {
				url : 'trade/purchase/:id/ensurePaid',
				method : 'PUT'
			},
			/*
			 * 根据采购单号id获取采购单信息 
			 */
			getPurchase : {
				url : 'trade/purchase/:puid/all',
				method : 'GET'
			},
			/*
			 * 根据id获取采购单信息 
			 */
			getPurchaseById : {
				url : 'trade/purchase/:id/find',
				method : 'GET'
			},
			/*
			 * 根据采购单号获取采购单信息 
			 */
			getPurchaseDetail : {
				url : 'trade/purchase/:purchaseid/admin',
				method : 'GET'  
			},
			/**
			 * 根据批次号获取标准元器件信息 
			 */
			getComponentActive : {
				url : 'trade/purchase/:batchCode/componentActive',
				method: 'GET'
			},
			getByStatus: {
				url : 'trade/purchase/status',
				method: 'GET'
			},
			changeShowTip : {
				url : 'trade/purchase/showTip/:purchaseid',
				method: 'POST'
			},
			changePurchaseUsed : {
				url : 'trade/purchase/used/:purchaseid',
				method: 'POST'
			},
			/**
			 * 根据采购生成时间和状态获取采购单信息列表
			 */
			getByStatusAndInternal: {
				url : 'trade/purchase/status/createtime',
				method: 'GET'
			},
			/**
			 * 根据状态和关键字分页获取企业信息
			 */
			getEnterByStatus : {
				url : 'trade/settlement/page/enterprise',
				method : 'GET'
			},
			/**
			 * 分页获取待结算采购单信息
			 */
			getPurchaseDetailByEnuu : {
				url : 'trade/settlement/page/purchaseDet',
				method : 'GET'
			},
			/**
			 * 批量申请付款
			 */
			batchRequestPay : {
				url : 'trade/settlement/requestpay/:ids',
				method : 'PUT'
			},
			/**
			 * 根据requestId获得BankTransfer对象
			 */
			findBankTransfer : {
				url : 'trade/settlement/transfer/:requestId',
				method : 'GET'
			},
			/**
			 * 分页获取付款申请单信息
			 */
			getRequestPayBypage : {
				url : 'trade/settlement/page/payments',
				method : 'GET'
			},
			/**
			 * 分页获取企业的付款申请单信息
			 */
			getEnterRequestPayBypage : {
				url : '/trade/settlement/page/enterpayments',
				method : 'GET',
				params : { _type : 'enterprise'}
			},
			/**
			 * 确认付款申请已付款
			 */
			ensurePayment : {
				url : 'trade/settlement/ensurepay/:id',
				method : 'POST'
			},
			getPurchaseBillByStatus: {
				url : 'trade/purchase/bill/status',
				method : 'GET'
			},
			getPurchaseBillByStatusAndVendor: {
				url : 'trade/purchase/bill/status/vendor',
				method : 'GET'
			},
			//暂时停用，现在周克竞要求简单点写
			makeOutBill: {
				url : 'trade/purchase/bill/makeout',
				method : 'POST'
			},
			confirmBill: {
				url :  'trade/purchase/bill/confirm',
				method : 'POST'
			},
			refusePurDetail: {
				url :  'trade/purchase/detail/refuse/:ids',
				method : 'GET'
			},
			orderTakeDetail: {
				url :  'trade/purchase/detail/orderTake/:ids',
				method : 'GET'
			},
			//采购单转出货单
			tobeshiped: {
				url : 'trade/purchase/vendor/tobeshiped/:id',
				method : 'GET'
			},
			// 根据订单状态获取订单数
			getAllStatusCounts: {
				url : 'trade/purchase/vendor/counts',
				method : 'GET'
			},
			//开发票
			drawBill: {
				url : 'trade/purchase/draw/bill/:id',
				method : 'POST'
			},
			// 根据采购单编号purchaseId获取当前卖家采购单信息
			findPurchaseByPurchaseId : {
				url : rootPath + '/trade/purchase/purchaseId/:purchaseId',
				method : 'GET'
			},
			findPurchaseByOrder : {
				url : 'trade/purchase/orderid/:orderid',
				method : 'GET'
			},
			// 保存改价信息
			savePurchasePrice:{
				url: 'trade/purchase/save/changePrice',
				method : 'POST'
			},
			getPurchaseByOrder : {
				url : 'trade/purchase/orderid/:orderid',
				method : 'GET'
			},
			// 确认收款
			confirmPaymentInstallment : {
				url : rootPath +'/trade/purchase/:id/ensurePaid',
				method : 'PUT'
			},
			// 取消订单
			sellerCancelOrder : {
				url : rootPath +'/trade/purchase/simpleinfo/ones/:purchaseId/release',
				method : 'PUT'
			}
		});
	}]);
});