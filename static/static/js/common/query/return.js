define([ 'ngResource' ], function() {
	angular.module('returnServices', [ 'ngResource' ]).factory('Return', ['$resource', function($resource) {
		return $resource('trade/return', {}, {
			/*
			 * 管理平台
			 */
			/**
			 * 供应商 
			 */
			getIndividualB2c : {
				url : 'trade/return/b2c/individual',
				method : 'GET'
			},
			// 查询退货单
			getIndividualCust : {
				url : 'trade/return/b2c/individualCust',
				method : 'GET'
			},
			/**
			 * 确认退货
			 */
			ensureReturn : {
				url : 'trade/return/ensurereturn',
				method : 'POST'
			}, 
			/**
			 * 平台审核客户退货单
			 */
			auditReturn : {
				url : 'trade/return/admin/audit/:result',
				method : 'POST'
			},
			/**
			 * 平台确认收货
			 */
			ensureAccept : {
				url: 'trade/return/ensureaccept/:returnid',
				method: 'PUT'
			},
			/**
			 * 查询平台单个退货单（平台）
			 */
			getFB2C : {
				url: 'trade/return/b2c/admin/:returnid',
				method: 'GET'
			},
			/**
			 * 查询申请中（客户）
			 */
//			unauditFcust : {
//				url: 'trade/return/unaudit',
//				method: 'GET'
//			},
			/**
			 * 查询已审核（客户）
			 */
//			auditedFcust : {
//				url: 'trade/return/audited',
//				method: 'GET'
//			},
			/**
			 * 查询验货中（客户）
			 */
//			inspectingFcust : {
//				url: 'trade/return/inspecting',
//				method: 'GET'
//			},
			/**
			 * 查询已验货（客户）
			 */
//			inspectedFcust: {
//				url: 'trade/return/inspected',
//				method: 'GET'
//			},
			/**
			 * 查询待退款（客户）
			 */
//			toberefundedFcust : {
//				url: 'trade/return/toberefunded',
//				method: 'GET'
//			},
			/**
			 * 查询已退款（客户）refunded
			 */
//			refundedFcust : {
//				url: 'trade/return/refunded',
//				method: 'GET'
//			},
			/**
			 * 查询待回寄（平台）
			 */
//			tobeshippedbackFb2c : {
//				url: 'trade/return/b2c/tobeshippedback',
//				method: 'GET'
//			},
			/**
			 * 查询验货中（平台）
			 */
//			inspectingFb2c :{
//				url: 'trade/return/b2c/inspecting',
//				method: 'GET'
//			},
			/**
			 * 查询已收货（平台）
			 */
//			receivedFb2c : {
//				url: 'trade/return/b2c/received',
//				method: 'GET'
//			},
			/**
			 * 查询申请中退货单（客户查看）
			 */
			getOnesUnaudit : {
				url: 'trade/return/ones/unaudit',
				method: 'GET',
				isArray: true
			},
			
			/**
			 * 查询待回寄退货单（客户查看）
			 */
			getOnesTobeshippedback : {
				url: 'trade/return/ones/tobeshippedback',
				method: 'GET',
				isArray: true
			},
			/**
			 * 查询待退款退货单（客户查看）
			 */
			getOnesToreceivemoney : {
				url: 'trade/return/ones/toreceivemoney',
				method: 'GET',
				isArray: true
			},
			/**
			 * 查询已退款退货单（客户查看）
			 */
			getOnesMoneyreceived : {
				url: 'trade/return/ones/moneyreceived',
				method: 'GET',
				isArray: true
			},
			/**
			 * 客户发退货
			 */
			sendReturn : {
				url: 'trade/return/ones/sendreturn',
				method: 'POST'
			},
			/**
			 * 平台向卖家发货
			 */
			batchSendForVender : {
				url: 'trade/return/batchSendForVender',
				method: 'POST'
			},
			/**
			 * 根据采购单号获取采购单号与退货单的关联映射
             */
			getReturnByPurchaseIds : {
				url: 'trade/return/getReturnByPurchaseIds',
				method: 'GET'
			},
			/**
			 * 供应商确认收货
			 */
			venderAccept : {
				url: 'trade/return/venderaccept/:returnid',
				method: 'PUT'
			},
			/**
			 * 确认付款
			 */
			ensurePaid : {
				url: 'trade/return/ensurepaid/:returnid',
				method: 'PUT'
			},
			/**
			 * 判断是否有换货单
			 */
			hasReturns : {
				url: 'trade/return/hasreturns',
				method: 'GET'
			},
			//通过订单号查看某一个订单
			findByReturnId : {
				url : 'trade/return/findOne/:returnid',
				method : 'GET'
			},
			/**
			 * 个人中心
			 */
			// 查询退货单
			getIndividualTodoReturn : {
				url : 'trade/return/individual',
				method : 'GET'
			},
			/**
			 * 供应商 
			 */
			getIndividualVender : {
				url : 'trade/return/vender/individual',
				method : 'GET'
			},
			// 查询换货单明细
			EntReturnDetail : {
				url : 'trade/return/enterprise/:returnid',
				method : 'GET'
			}
		});
	}]);
});