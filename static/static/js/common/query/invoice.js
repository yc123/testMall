define([ 'ngResource' ], function() {
	angular.module('invoiceServices', [ 'ngResource' ]).factory('InvoiceFPurchase', ['$resource', function($resource) {

		return $resource('trade/inFpu/:inFpuid', {}, {
			/**
			 * 平台查看
			 */
			//平台查看待出货详情
			tobeshippedByInvoiceid : {
				url : 'trade/inFpu/tobeshipped/:ids',
				method : 'GET',
				isArray : true
			},
			//平台根据状态查看出货单
			getAdminInFpu : {
				url : 'trade/inFpu/admin',
				method : 'GET'	
			},
			
			/**
			 * 企业卖家查看
			 */
			//企业卖家根据状态查看单据
			getBusinessInvoice : {
				url : 'trade/inFpu/business',
				method : 'GET'
			},
			
			//卖家出货
			send : {
				url : 'trade/inFpu/:inid/send',
				method : 'PUT'
			},
			/*
			 * 根据id查看发货单
			 */
			getInvoiceFOrder : {
				url : 'trade/inFor/:inid/find',
				method : 'GET'
			},
			//平台收货
			ensurereceipt : {
				url : 'trade/purchase/:invoiceid/ensurereceipt',
				method : 'PUT'
			},
			batchEnsureAccept : {
				url : 'trade/purchase/:invoiceids/batchEnsureReceipt',
				method : 'PUT'
			},
			//根据出货单号获取出货单
			getInvoiceFPurc : {
				url : 'trade/inFpu/:invoiceid/find',
				method : 'GET'
			},
			//根据批次号获取标准元器件信息 
			getComponentActive : {
				url : 'trade/inFpu/:batchCode/componentActive',
				method: 'GET'
			},
			
			saveInvoiceFPurchase : {
				url : 'trade/inFpu/save',
				method : 'POST'
			},
			// 根据出货单id获取出货单
			getInvoiceFPu : {
				url : 'trade/inFpu/:id/getIn',
				method : 'GET'
			}
		});
	}]).factory('InvoiceFOrder', ['$resource', function($resource) {
		return $resource('trade/inFor/:inForid', {}, {
			/**
			 * 平台查看
			 */
			//平台根据状态查看平台出货单
			getAdminInFor : {
				url : 'trade/inFor/admin',
				method : 'GET'	
			},
			//平台出货
			send : {
				url : 'trade/inFor/:inid/send',
				method : 'PUT'
			},
			//平台单个出货和批量出货共用方法
			batchSend : {
				url : 'trade/inFor/batch/send',
				method : 'PUT'
			},
			//根据出货单号查看出货单
			getInvoiceFOrder: {
				url : 'trade/inFor/:invoiceid/code',
				method : 'GET'
			},
			// 根据批次号获取标准元器件信息 
			getComponentActive : {
				url : 'trade/inFor/:batchCode/componentActive',
				method: 'GET'
			}			
		});
	}]).factory('Invoice', ['$resource', function($resource) {
		return $resource('trade/invoice/:invoiceid', {}, {
			getBusinessInvoice : {
				url : 'trade/invoice/business',
				method : 'GET'
			},
			
			//平台查看待出货
			tobeshipped : {
				url : 'trade/invoice/tobeshipped',
				method : 'GET'
			},
			//平台查看待收货
			inbound : {
				url : 'trade/invoice/inbound',
				method : 'GET'
			},
			//平台查看已出货
			received : {
				url : 'trade/invoice/received',
				method : 'GET'
			},
			//平台查看待收款
			toreceivemoney : {
				url : 'trade/invoice/toreceivemoney',
				method : 'GET'
			},
			//供应商发货
			sendinFch : {
				url : 'trade/invoice/inFch/send',
				method : 'POST',
				params : { _role : 'vendor'}
			},
			//平台收货
			ensurereceipt : {
				url : 'trade/invoice/:inid/ensurereceipt',
				method : 'PUT',
				params : { _role : 'vendor'}
			},
			//平台根据状态查看出货单
			getAdminInFch : {
				url : 'trade/invoice/inFch/admin',
				method : 'GET',
				params : { _role : 'vendor'}
			},
			getAdminInFchToB2c : {
				url : 'trade/invoice/inFch/admin',
				method : 'GET',
				params : { _role : 'b2c'}
			},
			//平台出货单发货（来源换货）
			ensureSend : {
				url : 'trade/invoice/inFch/ensuresend',
				method : 'POST',
				params : { _role : 'b2c'}
			},
			findByinvoiceIds : {
				url : 'trade/invoice/inFch/tobeshipped/:ids',
				method : 'GET',
				params : { _role : 'vendor'},
				isArray : true
			},
			// 平台查看单张换货出货单(含供应商换货出货单、平台换货出货单)
			getVendorByinvoiceid : {
				url: 'trade/invoice/change/admin/:invoiceid',
				method: 'GET'
			},
			// 买家根据换货单号获取商城针对买家换货单发货给买家的出货单
			getInvoiceBySourceid: {
				url : 'trade/invoice/getInvoiceBySourceid/:changeId',
				method : 'GET'
			}
		})
	}]);
});