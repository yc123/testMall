define([ 'ngResource' ], function() {
	angular.module('changeServices', [ 'ngResource' ]).factory('Change', ['$resource', function($resource) {
		return $resource('trade/return', {}, {
			/**
			 * 确认换货
			 */
			ensureChange: {
				url : 'trade/change/ensurechange',
				method : 'POST'
			}, 
			/**
			 * 平台审核客户退货单
			 */
			auditChange: {
				url : 'trade/change/admin/audit',
				method : 'POST'
			},
			/**
			 * 平台确认收货
			 */
			ensureAccept: {
				url: 'trade/change/ensureaccept/:changeid',
				method: 'PUT'
			},
			/**
			 * 查询申请中（客户）
			 */
//			unauditFcust: {
//				url: 'trade/change/unaudit',
//				method: 'GET'
//			},
			/**
			 * 查询已审核（客户）
			 */
//			auditedFcust : {
//				url: 'trade/change/audited',
//				method: 'GET'
//			},
			/**
			 * 查询验货中（客户）
			 */
//			inspectingFcust: {
//				url: 'trade/change/inspecting',
//				method: 'GET'
//			},
			/**
			 * 查询已验货（客户）
			 */
//			inspectedFcust: {
//				url: 'trade/change/inspected',
//				method: 'GET'
//			},
			/**
			 * 查询已出货（客户）
			 */
//			shippedFcust: {
//				url: 'trade/change/shipped',
//				method: 'GET'
//			},
			/**
			 * 查询待收货（客户）refunded
			 */
//			inboundFcust: {
//				url: 'trade/change/inbound',
//				method: 'GET'
//			},
			/**
			 * 查询待回寄（平台）
			 */
//			tobeshippedbackFb2c: {
//				url: 'trade/change/b2c/tobeshippedback',
//				method: 'GET'
//			},
			/**
			 * 查询验货中（平台）
			 */
//			inspectingFb2c: {
//				url: 'trade/change/b2c/inspecting',
//				method: 'GET'
//			},
			/**
			 * 查询已收货（平台）
			 */
//			receivedFb2c: {
//				url: 'trade/change/b2c/received',
//				method: 'GET'
//			},
			/**
			 * 查询申请中退货单（客户查看）
			 */
			getOnesUnaudit: {
				url: 'trade/change/ones/unaudit',
				method: 'GET',
				isArray: true
			},
			
			/**
			 * 查询待回寄退货单（客户查看）
			 */
			getOnesTobeshippedback: {
				url: 'trade/change/ones/tobeshippedback',
				method: 'GET',
				isArray: true
			},
			/**
			 * 查询待退款退货单（客户查看）
			 */
			getOnesToreceivemoney: {
				url: 'trade/change/ones/toreceivemoney',
				method: 'GET',
				isArray: true
			},
			/**
			 * 查询已退款退货单（客户查看）
			 */
			getOnesMoneyreceived: {
				url: 'trade/change/ones/moneyreceived',
				method: 'GET',
				isArray: true
			},
			/**
			 * 客户发换货单
			 */
			sendChange: {
				url: 'trade/change/ones/sendchange',
				method: 'POST'
			},
			/**
			 * 平台向卖家发货
			 */
			sendForVender: {
				url: 'trade/change/sendForVender/:changeid',
				method: 'PUT'
			},
			/**
			 *  平台向卖家发货（批量）
			 */
			batchSendForVender: {
				url: 'trade/change/batchSendForVender',
				method: 'POST'
			},
			/**
			 * 供应商确认收货
			 */
			venderAccept: {
				url: 'trade/change/venderaccept/:changeid',
				method: 'PUT'
			},
			/**
			 * 供应商根据采购单编号确认收退换货
			 */
			venderAcceptByPurchase: {
				url: 'trade/change/venderAcceptByPurchase/:purchaseId',
				method: 'GET'
			},
			/**
			 * 判断是否有换货单
			 */
			hasChanges: {
				url: 'trade/change/haschanges',
				method: 'GET'
			},
			ensureSend :{
				url : 'trade/change/create/:changeid',
				method : 'PUT'
			},
			/**
			 * 平台查看
			 */
			// 查询客户换货单
			getIndividualfcust : {
				url : 'trade/change/b2c/individualfcust',
				method : 'GET'
			},
			// 查询平台换货单
			getIndividualfb2c : {
				url : 'trade/change/b2c/individualfb2c',
				method : 'GET'
			},
			/**
			 * 个人中心
			 */
			// 查询换货单
			getIndividualTodoChange : {
				url : 'trade/change/individual',
				method : 'GET'
			},
			//客户确认收货
			custAccept: {
				url:'trade/change/ones/ensureaccept/:changeid',
				method : 'PUT'
			},
			//通过订单号查看某一个订单
			findByChangeId: {
				url : 'trade/change/findOne/:changeid',
				method : 'GET'
			},
			/**
			 * 供应商
			 */
			// 查询换货单
			getIndividualVender : {
				url : 'trade/change/enterprise/individual',
				method : 'GET'
			},
			// 查询换货单明细
			EntChangeDetail : {
				url : 'trade/change/enterprise/:changeid',
				method : 'GET'
			},
			/**
			 * 管理平台
			 */
			// 查询单张客户换货单（平台）
			getFCAdmin : {
				url: 'trade/change/cust/admin/:changeid',
				method: 'GET'
			},
			getFB2CAdmin : {
				url: 'trade/change/b2c/admin/:changeid',
				method: 'GET'
			}
		});
	}]);
});