define([ 'angularAMD', 'ngLocal', 'common/services', 'common/directives', 'common/query/brand', 'common/query/kind', 'common/query/component', 'common/query/goods', 'common/query/rate','common/query/cart', 'common/query/order', 'common/query/address', 'common/query/invoice', 'common/query/property', 'common/query/kindAdvice', 'common/query/propertyAdvice', 'common/query/return' , 'common/query/change', 'common/query/logistics', 'ui.router', 'ui-bootstrap', 'ui-form', 'ui-jquery','angular-toaster', 'ngDraggable', 'angular-sanitize', 'ngTable', 'dynamicInput', 'jquery-imagezoom', 'file-upload', 'file-upload-shim', 'common/query/urlencryption' , 'common/query/purchase', 'common/query/vendor', 'common/query/goods', 'common/query/bankTransfer', 'common/query/enterprise', 'common/query/bill', 'common/query/receipt', 'common/query/collection', 'common/query/express', 'common/query/bankInfo','common/query/charge', 'common/query/statistics', 'common/query/currency', 'jquery-chart', 'common/query/responseLogistics', 'common/query/goodsPrice', 'common/query/address' , 'common/query/search', 'common/query/urlencryption', 'common/query/releaseProInfo', 'common/query/makerDemand', 'common/query/afterSale', 'common/query/messageBoard', 'common/query/logistics', 'common/query/storeInfo', 'common/query/recommendation', 'common/query/user', 'common/query/logisticsPort', 'common/query/cms', 'common/query/material', 'common/query/storeCms', 'common/query/productImport', 'common/query/stockInOut', 'common/module/store_recommend_product', 'common/module/chat_web_module', 'common/query/standardPutOnAdmin', 'common/query/storeViolations', 'common/query/internalMessage', 'common/query/installments','common/query/product','common/query/seekPurchase','common/query/UASBatchPutOnProperty'], function(angularAMD) {
	'use strict';
	/**
	 * 自定义Array对象的属性last 方法
	 * 调用获取数组的最后一个元素
	 */
	Array.prototype.last = function() {
		return this.length > 0 ? this[this.length - 1] : null;
	};

	var app = angular.module('myApp', [ 'ui.router', 'ui.bootstrap', 'ng.local', 'ui.form', 'ui.jquery', 'toaster', 'ngDraggable', 'tool.directives', 'ngSanitize', 'common.query.kind', 'common.services', 'brandServices', 'componentServices', 'goodsServices',  'rateServices','cartServices', 'orderServices', 'addressServices', 'invoiceServices', 'common.query.propertyAdvice', 'propertyServices', 'returnServices' , 'changeServices',  'logisticsServices', 'common.query.kindAdvice', 'ngTable', 'ngDynamicInput', 'common.directives', 'angularFileUpload', 'urlencryptionServices', 'purchaseServices', 'vendorServices', 'goodsServices', 'bankTransfer', 'common.query.enterprise', 'billServices', 'receiptServices', 'collection', 'expressServices', 'bankInfo','Charge', 'statisticsServices', 'currencyService', 'responseLogisticsService', 'PriceServices', 'addressServices', 'searchService', 'urlencryptionServices', 'ReleaseProductByBatchService', 'makerDemand', 'afterSaleService', 'messageBoardServices', 'logisticsServices', 'table.directives', 'storeInfoServices', 'recommendation', 'common.query.user', 'logisticsPortService', 'cmsService', 'materialServices', 'StoreCmsServices', 'productImportModule', 'stockInOutModule', 'StoreCmsModule', 'WebChatModule', 'StandardPutOnAdminModule', 'StoreViolationsServices', 'internalMessageServices', 'installmentServices','common.query.product', 'ui.tour', 'seekPurchaseServices', 'UASBatchPutOnPropertyModule']);
	//初始化，启动时载入app
	app.init = function() {
		angularAMD.bootstrap(app);
	};

	// ui-router 路由配置
	app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){

		$urlRouterProvider.otherwise("/index");

		$stateProvider.state('vendor_index', angularAMD.route({
			url: '/index',
			templateUrl: 'static/view/vendor/forstore/vendor_index.html',
			title: '卖家中心首页',
			controllerUrl: 'app/controllers/forstore/vendor_index_ctrl',
			controller: 'vendorIndexCtrl'
		})).state('message', angularAMD.route({
			url: '/message',
			templateUrl: 'static/view/vendor/forstore/messagePersonal.html',
			title: '消息',
			controller: 'MessageCtrl',
			controllerUrl: 'app/controllers/forstore/messageCtrl'
		})).state('browsing-history', angularAMD.route({
			url: '/browsing-history',
			templateUrl: 'static/view/vendor/forstore/browsing-history.html',
			title: '浏览历史',
			controller: 'BrowsingHistoryCtrl',
			controllerUrl: 'app/controllers/forstore/browsingHistoryCtrl'
		})).state('vendor_order', angularAMD.route({
			url: '/order/center',
			templateUrl: 'static/view/vendor/forstore/vendor_order.html',
			title: '订单中心',
			controllerUrl: 'app/controllers/forstore/vendor_order_ctrl',
			controller: 'vendorOrderCtrl'
		})).state('vendor_logistics', angularAMD.route({
			url: '/logistics/:purchaseid',
			templateUrl: 'static/view/vendor/forstore/vendor_logistics.html',
			title: '物流信息',
			controllerUrl: 'app/controllers/forstore/vendor_logistics_ctrl',
			controller: 'vendorLogisticsCtrl'
		})).state('seekPurchase', angularAMD.route({
			url: '/seek',
			templateUrl: 'static/view/vendor/forstore/seekPurchase.html',
			title: '求购询价',
			controllerUrl: 'app/controllers/forstore/seek_purchase_ctrl',
			controller: 'seekPurchaseCtrl'
		})).state('vendor_query_logistics', angularAMD.route({
            url: '/logistics/query/:purchaseid',
            templateUrl: 'static/view/vendor/forstore/query_logistics.html',
            title: '查询物流',
            controllerUrl: 'app/controllers/forstore/query_logistics_ctrl',
            controller: 'vendorQueryLogisticsCtrl'
        })).state('vendor_account_management', angularAMD.route({
			url: '/account/management/:op',
			templateUrl: 'static/view/vendor/forstore/vendor_account_management.html',
			title: '账户管理',
			controllerUrl: 'app/controllers/forstore/vendor_account_management_ctrl',
			controller: 'vendorAccountManagementCtrl'
		})).state('vendor_after_sale', angularAMD.route({
			url: '/after/sale',
			templateUrl: 'static/view/vendor/forstore/vendor_after_sale.html',
			title: '售后服务',
			controllerUrl: 'app/controllers/forstore/vendor_after_sale_ctrl',
			controller: 'vendorAfterSaleCtrl'
		})).state('vendor_brand_apply', angularAMD.route({
			url: '/brand/apply/:uuid',
			templateUrl: 'static/view/vendor/forstore/vendor_brand_apply.html',
			title: '品牌申请',
			controllerUrl: 'app/controllers/forstore/vendor_brand_apply_ctrl',
			controller: 'vendorBrandApplyCtrl'
		})).state('vendor_brand_reapply', angularAMD.route({
			url: '/brand/reapply/:id',
			templateUrl: 'static/view/vendor/forstore/vendor_brand_apply.html',
			title: '品牌再次申请',
			controllerUrl: 'app/controllers/forstore/vendor_brand_apply_ctrl',
			controller: 'vendorBrandApplyCtrl'
		})).state('vendor_brand_apply_list', angularAMD.route({
			url: '/brand/apply_list',
			templateUrl: 'static/view/vendor/forstore/vendor_brand_apply_list.html',
			title: '品牌申请列表',
			controllerUrl: 'app/controllers/forstore/vendor_brand_apply_list_ctrl',
			controller: 'vendorBrandApplyListCtrl'
		})).state('vendor_component_apply', angularAMD.route({
			url: '/component/apply',
			templateUrl: 'static/view/vendor/forstore/vendor_component_apply.html',
			title: '器件单个申请',
			controllerUrl: 'app/controllers/forstore/vendor_component_apply_ctrl',
			controller: 'vendorComponentApplyCtrl'
		})).state('vendor_component_batchapply', angularAMD.route({
			url: '/component/batchapply',
			templateUrl: 'static/view/vendor/forstore/vendor_component_batchapply.html',
			title: '器件申请批量',
			controllerUrl: 'app/controllers/forstore/vendor_component_batchapply_ctrl',
			controller: 'vendorComponentBatchApplyCtrl'
		})).state('vendor_component_applylist', angularAMD.route({
			url: '/component/applylist',
			templateUrl: 'static/view/vendor/forstore/vendor_component_applylist.html',
			title: '器件申请单个列表',
			controllerUrl: 'app/controllers/forstore/vendor_component_applylist_ctrl',
			controller: 'vendorComponentApplyListCtrl'
		})).state('vendor_component_batchapplylist', angularAMD.route({
			url: '/component/batchapplylist',
			templateUrl: 'static/view/vendor/forstore/vendor_component_batchapplylist.html',
			title: '器件申请批量列表',
			controllerUrl: 'app/controllers/forstore/vendor_component_batchapplylist_ctrl',
			controller: 'vendorComponentBatchApplyListCtrl'
		})).state('vendor_goods', angularAMD.route({
			url: '/goods',
			templateUrl: 'static/view/vendor/forstore/vendor_goods.html',
			title: '货品管理',
			controllerUrl: 'app/controllers/forstore/vendor_goods_ctrl',
			controller: 'vendorGoodsCtrl'
		})).state('vendor_manufacture', angularAMD.route({
			url: '/manufacture',
			templateUrl: 'static/view/vendor/forstore/vendor_manufacture.html',
			title: '原厂认证',
			controllerUrl: 'app/controllers/forstore/vendor_manufacture_ctrl',
			controller: 'vendorManufactureCtrl'
		})).state('vendor_stock_agent', angularAMD.route({
			url: '/stock/agent',
			templateUrl: 'static/view/vendor/forstore/vendor_stock_agent.html',
			title: '库存寄售',
			controllerUrl: 'app/controllers/forstore/vendor_stock_agent_ctrl',
			controller: 'vendorStockAgentCtrl'
		})).state('vendor_store_apply', angularAMD.route({
			url: '/store-apply',
			templateUrl: 'static/view/vendor/forstore/vendor_store_apply.html',
			title: '开店申请',
			controllerUrl: 'app/controllers/forstore/vendor_store_apply_ctrl',
			controller: 'vendorStoreApplyCtrl'
		})).state('vendor_store_wait', angularAMD.route({
			url: '/store-apply/wait',
			templateUrl: 'static/view/vendor/forstore/vendor_store_wait.html',
			title: '开店申请-申请中',
			controllerUrl: 'app/controllers/forstore/vendor_store_wait_ctrl',
			controller: 'vendorStoreWaitCtrl'
		})).state('vendor_store_info', angularAMD.route({
			url: '/store-apply/finish',
			templateUrl: 'static/view/vendor/forstore/vendor_store_info.html',
			title: '我的店铺-已申请',
			controllerUrl: 'app/controllers/forstore/vendor_store_info_ctrl',
			controller: 'vendorStoreInfoCtrl'
		})).state('vendor_store_maintain', angularAMD.route({
			url: '/store/maintain',
			templateUrl: 'static/view/vendor/forstore/vendor_store_maintain.html',
			title: '我的店铺-维护',
			controllerUrl: 'app/controllers/forstore/vendor_store_maintain_ctrl',
			controller: 'vendorStoreMaintainCtrl'
		})).state('vendor_store_close', angularAMD.route({
			url: '/store/close',
			templateUrl: 'static/view/vendor/forstore/vendor_store_close.html',
			title: '店铺关闭',
			controllerUrl: 'app/controllers/forstore/vendor_store_close_ctrl',
			controller: 'vendorStoreColseCtrl'
		})).state('vendor_delivery', angularAMD.route({
			url: '/delivery/:ids',
			templateUrl: 'static/view/vendor/forstore/vendor_delivery.html',
			title: '卖家发货',
			controllerUrl: 'app/controllers/forstore/vendor_delivery_ctrl',
			controller: 'vendorDeliveryCtrl'
		}))//3月24日 开始 增加店铺的功能，下面的代码是之前写得。
			.state('home', angularAMD.route({
				// 器件展示首页
				url: '/home',
				templateUrl: 'static/view/vendor/home.html',
				title: '主页',
				controllerUrl: 'app/controllers/HomeCtrl',
				controller: 'HomeCtrl'
			})).state('putOn', angularAMD.route({
			// 发布产品
			title: '发布产品',
			url: '/putOn/:prodUuid',
			templateUrl: 'static/view/vendor/putOn.html',
			controllerUrl: 'app/controllers/PutOnCtrl',
			controller: 'PutOnCtrl'
		})).state('salingGoods', angularAMD.route({
			// 销售中的产品
			title: '销售中产品',
			url: '/salingGoods',
			templateUrl: 'static/view/vendor/salingGoods.html',
			controllerUrl: 'app/controllers/SalingGoodsCtrl',
			controller: 'SalingGoodsCtrl'
		})).state('goodsDetail', angularAMD.route({
			// 产品详情
			title: '产品详情',
			url: '/goodsDetail/:batchCode',
			templateUrl: 'static/view/vendor/goods_detail.html',
			controllerUrl: 'app/controllers/GoodsDetailCtrl',
			controller: 'GoodsDetailCtrl'
		})).state('downedGoods', angularAMD.route({
			// 已下架产品
			title: '已下架产品',
			url: '/downedGoods',
			templateUrl: 'static/view/vendor/downedGoods.html',
			controllerUrl: 'app/controllers/DownedGoodsCtrl',
			controller: 'DownedGoodsCtrl'
		})).state('goodsPrice', angularAMD.route({
			// 价格库
			title: '价格库',
			url: '/goodsPrice',
			templateUrl: 'static/view/vendor/goods_price.html',
			controllerUrl: 'app/controllers/GoodsPriceCtrl',
			controller: 'GoodsPriceCtrl'
		})).state('invoice', angularAMD.route({
			// 出货单
			title: '出货单',
			url: '/invoice',
			templateUrl: 'static/view/vendor/invoice.html',
			controllerUrl: 'app/controllers/InvoiceCtrl',
			controller: 'InvoiceCtrl'
		})).state('invoice_detail', angularAMD.route({
			// 出货单详情
			title: '出货单详情',
			url: '/invoice/:invoiceid',
			templateUrl: 'static/view/vendor/invoice_detail.html',
			controllerUrl: 'app/controllers/InvoiceDetailCtrl',
			controller: 'InvoiceDetailCtrl'
		})).state('invoiceChange', angularAMD.route({
			// 出货单
			title: '换货出货单',
			url: '/invoiceChange',
			templateUrl: 'static/view/vendor/invoiceChange.html',
			controllerUrl: 'app/controllers/InvoiceChangeCtrl',
			controller: 'InvoiceChangeCtrl'
		})).state('invoiceChangeDetail', angularAMD.route({
			// 换货出货单详情
			title: '换货出货单详情页',
			url: '/invoiceChange/:invoiceChangeId',
			templateUrl: 'static/view/vendor/invoice_change_detail.html',
			controllerUrl: 'app/controllers/InvoiceChangeDetailCtrl',
			controller: 'InvoiceChangeDetailCtrl'
		})).state('return', angularAMD.route({
			// 退货管理
			title: '退货单',
			url: '/return',
			templateUrl: 'static/view/vendor/return.html',
			controllerUrl: 'app/controllers/ReturnCtrl',
			controller: 'ReturnCtrl'
		})).state('change', angularAMD.route({
			// 换货管理
			title: '换货单',
			url: '/change',
			templateUrl: 'static/view/vendor/change.html',
			controllerUrl: 'app/controllers/ChangeCtrl',
			controller: 'ChangeCtrl'
		})).state('returnDetail', angularAMD.route({
			// 退货单明细
			title: '退货单明细',
			url: '/return/:returnid',
			templateUrl: 'static/view/vendor/return_detail.html',
			controllerUrl: 'app/controllers/ReturnDetailCtrl',
			controller: 'ReturnDetailCtrl'
		})).state('changeDetail', angularAMD.route({
			// 换货单明细
			title: '换货单明细',
			url: '/change/:changeid',
			templateUrl: 'static/view/vendor/change_detail.html',
			controllerUrl: 'app/controllers/ChangeDetailCtrl',
			controller: 'ChangeDetailCtrl'
		})).state('tradeRecord', angularAMD.route({
			// 交易记录
			title: '交易记录',
			url: '/tradeRecord',
			templateUrl: 'static/view/vendor/tradeRecord.html',
			controllerUrl: 'app/controllers/TradeRecordCtrl',
			controller: 'TradeRecordCtrl'
		})).state('requestPayment', angularAMD.route({
			// 付款申请记录
			title: '交易记录',
			url: '/requestPayRecord',
			templateUrl: 'static/view/vendor/requestPayRecord.html',
			controllerUrl: 'app/controllers/RequestPayRecordCtrl',
			controller: 'RequestPayRecordCtrl'
		})).state('tradeRecordDetail', angularAMD.route({
			// 交易记录详情
			title: '交易记录详情',
			url: '/tradeRecord/:receiptid',
			templateUrl: 'static/view/vendor/trade_record_detail.html',
			controllerUrl: 'app/controllers/TradeRecordDetailCtrl',
			controller: 'TradeRecordDetailCtrl'
		})).state('brand_matenance', angularAMD.route({
			// 品牌维护
			title: '品牌维护',
			url: '/home/brandMaintenance',
			templateUrl : 'static/view/vendor/brandMaintenance.html',
			controller : 'BrandMaintenanceCtrl',
			controllerUrl : 'app/controllers/BrandMaintenanceCtrl'
		})).state('component_matenance', angularAMD.route({
			// 标准器件维护
			title: '器件维护',
			url: '/home/componentMaintenance',
			templateUrl : 'static/view/vendor/componentMaintenance.html',
			controller : 'ComponentMaintenanceCtrl',
			controllerUrl : 'app/controllers/ComponentMaintenanceCtrl'
		})).state('component_batchMatenance', angularAMD.route({
			// 标准器件批量维护
			title: '器件批量维护',
			url: '/home/componentBatchMaintenance',
			templateUrl : 'static/view/vendor/componentBatchMaintenance.html',
			controller : 'ComponentBatchMaintenanceCtrl',
			controllerUrl : 'app/controllers/ComponentBatchMaintenanceCtrl'
		})).state('component_batchMatenanceDetail', angularAMD.route({
			// 标准器件批量维护详情
			title: '器件批量维护详情',
			url: '/home/componentBatchMaintenance/detail/:submitId',
			templateUrl : 'static/view/vendor/componentBatchSubmit_dt.html',
			controller : 'ComponentBatchSubmitDtCtrl',
			controllerUrl : 'app/controllers/ComponentBatchSubmitDtCtrl'
		})).state('component_batchCreate', angularAMD.route({
			// 新增标准器件批量维护申请
			title: '新增器件批量维护',
			url: '/home/componentBatchMaintenance/create',
			templateUrl : 'static/view/vendor/component_batch_create.html',
			controller : 'ComponentBatchCreateCtrl',
			controllerUrl : 'app/controllers/ComponentBatchCreateCtrl'
		})).state('publishByBatch', angularAMD.route({
			//批量发布产品
			title: '批量发布产品',
			url: '/publishByBatch',
			templateUrl: 'static/view/vendor/publishByBatch.html',
			controllerUrl: 'app/controllers/PublishByBatchCtrl',
			controller: 'PublishByBatchCtrl'
		})).state('releaseProductByBatch', angularAMD.route({
			//批量发布产品(大量)
			title: '批量发布产品(大量)',
			url: '/releaseProductByBatch',
			templateUrl: 'static/view/vendor/releaseProductByBatch.html',
			controllerUrl: 'app/controllers/ReleaseProductByBatchCtrl',
			controller: 'ReleaseProductByBatchCtrl'
		})).state('entryCheck', angularAMD.route({
			title: '批量出货',
			url: '/entryCheck/:ids',
			templateUrl: 'static/view/vendor/entryCheck.html',
			controllerUrl: 'app/controllers/CheckSaveCtrl',
			controller: 'CheckSaveCtrl'
		})).state('shipFchange', angularAMD.route({
			title: '换货单批量出货',
			url: '/shipFchange/:ids',
			templateUrl: 'static/view/vendor/shipFchange.html',
			controllerUrl: 'app/controllers/ShipFchangeCtrl',
			controller: 'ShipFchangeCtrl'
		})).state('cusPurchase', angularAMD.route({
			title: '订单管理',
			url: '/cusPurchase',
			templateUrl: 'static/view/vendor/cusPurchase.html',
			controllerUrl: 'app/controllers/cusPurchaseCtrl',
			controller: 'cusPurchaseCtrl'
		})).state('exceptionApply', angularAMD.route({
			title: '异常申请',
			url: '/exception/exceptionApply/:purchaseId',
			templateUrl: 'static/view/vendor/exceptionApply.html',
			controllerUrl: 'app/controllers/exceptionApplyCtrl',
			controller: 'exceptionApplyCtrl'
		})).state('exceptionApplyDetails', angularAMD.route({
			title: '异常申请详情',
			url: '/exception/exceptionApplyDetails/:applyId',
			templateUrl: 'static/view/vendor/exceptionApplyDetails.html',
			controllerUrl: 'app/controllers/exceptionApplyDetailsCtrl',
			controller: 'exceptionApplyDetailsCtrl'
		})).state('exceptionNotify', angularAMD.route({
			title: '异常通知',
			url: '/exception/exceptionNotify/:applyId',
			templateUrl: 'static/view/vendor/exceptionNotify.html',
			controllerUrl: 'app/controllers/exceptionNotifyCtrl',
			controller: 'exceptionNotifyCtrl'
		})).state('cusPurchaseDetail', angularAMD.route({
			title: '订单详情',
			url: '/cusPurchase/:purchaseid',
			templateUrl: 'static/view/vendor/cusPurchase_detail.html',
			controllerUrl: 'app/controllers/cusPurchaseDetailCtrl',
			controller: 'curPurchaseDetailCtrl'
		})).state('proofing', angularAMD.route({
			// 客户送样申请单
			url: '/proofing',
			templateUrl : 'static/view/vendor/proofing.html',
			controller : 'MyProofingCtrl',
			controllerUrl : 'app/controllers/MyProofingCtrl'
		})).state('invoiceProofing', angularAMD.route({
			// 送样出货单
			url: '/invoiceProofing',
			templateUrl : 'static/view/vendor/invoiceProofing.html',
			controller : 'InvoiceProofingCtrl',
			controllerUrl : 'app/controllers/InvoiceProofingCtrl'
		})).state('faStatistics', angularAMD.route({
			title: '财务管理总体情况统计',
			url: '/faStatistics',
			templateUrl: 'static/view/vendor/faStatistics.html',
			controllerUrl: 'app/controllers/FaStatisticsCtrl',
			controller: 'FaStatisticsCtrl'
		})).state('faInOut', angularAMD.route({
			title: '财务管理收支管理',
			url: '/faInOut',
			templateUrl: 'static/view/vendor/faInOut.html',
			controllerUrl: 'app/controllers/FaInOutCtrl',
			controller: 'FaInOutCtrl'
		})).state('faBill', angularAMD.route({
			title: '财务管理发票管理',
			url: '/faBill',
			templateUrl: 'static/view/vendor/faBill.html',
			controllerUrl: 'app/controllers/FaBillCtrl',
			controller: 'FaBillCtrl'
		})).state('faBank', angularAMD.route({
			title: '财务管理账户查询',
			url: '/faBank',
			templateUrl: 'static/view/vendor/faBank.html',
			controllerUrl: 'app/controllers/FaBankCtrl',
			controller: 'FaBankCtrl'
		})).state('sendExpress', angularAMD.route({
			title: '我要寄快递',
			url: '/express/send',
			templateUrl: 'static/view/vendor/sendExpress.html',
			controllerUrl: 'app/controllers/SendExpressCtrl',
			controller: 'SendExpressCtrl'
		})).state('recordExpress', angularAMD.route({
			title: '物流服务',
			url: '/express/record',
			templateUrl: 'static/view/vendor/recordExpress.html',
			controllerUrl: 'app/controllers/RecordExpressCtrl',
			controller: 'RecordExpressCtrl'
		})).state('listExpress', angularAMD.route({
			title: '电子面单',
			url: '/express/list',
			templateUrl: 'static/view/vendor/listExpress.html',
			controllerUrl: 'app/controllers/ListExpressCtrl',
			controller: 'ListExpressCtrl'
		})).state('credit_card', angularAMD.route({
			url : '/creditCard',
			templateUrl : 'static/view/vendor/creditCardAdmin.html',
			controllerUrl : 'app/controllers/creditCardAdminCtrl',
			controller : 'creditCardAdminCtrl'
		})).state('address_admin', angularAMD.route({
			url : '/addressAdmin',
			templateUrl : 'static/view/vendor/addressAdmin.html',
			controller : 'addressAdminCtrl',
			controllerUrl : 'app/controllers/addressAdminCtrl'
		})).state('charge', angularAMD.route({
			title: '议价单管理',
			url: '/charge',
			templateUrl: 'static/view/vendor/charge.html',
			controllerUrl: 'app/controllers/ChargeCtrl',
			controller: 'ChargeCtrl'
		})).state('puchaseBillAdmin', angularAMD.route({
			title: '采购单发票管理',
			url: '/puchase/bill/admin',
			templateUrl: 'static/view/vendor/puchaseBillAdmin.html',
			controllerUrl: 'app/controllers/puchaseBillAdminCtrl',
			controller: 'puchaseBillAdminCtrl'
		})).state('openBill', angularAMD.route({
			title: '开发票',
			url: '/bill/open/:id',
			templateUrl: 'static/view/vendor/openBill.html',
			controllerUrl: 'app/controllers/openBillCtrl',
			controller: 'openBillCtrl'
		})).state('purchase_detail', angularAMD.route({
			title : '采购单详情',
			url : '/purchase/detail/:purchaseId',
			templateUrl : 'static/view/vendor/forstore/purchase_detail.html',
			controllerUrl : "app/controllers/forstore/purchase_detail",
			controller : 'purchaseDetailCtrl'
		})).state('vendor_productOn', angularAMD.route({
			title : '产品导入',
			url : '/vendor_productOn',
			// templateUrl : 'static/view/vendor/forstore/vendor_upload.html',
			// controllerUrl : "app/controllers/forstore/vendor_upload_ctrl",
			// controller : 'vendorUploadCtrl'
			// templateUrl : 'static/view/vendor/forstore/vendor_productOn.html',
			templateUrl : 'static/view/vendor/forstore/product_file.html',
			controllerUrl : "app/controllers/forstore/vendor_productOn_ctrl",
			controller : 'vendorProductOnCtrl'
		})).state('product_repository', angularAMD.route({
			title : '产品库',
			url : '/product_repository',
			// templateUrl : 'static/view/vendor/forstore/vendor_upload.html',
			// controllerUrl : "app/controllers/forstore/vendor_upload_ctrl",
			// controller : 'vendorUploadCtrl'
			templateUrl : 'static/view/vendor/forstore/vendor_proRepository.html',
			controllerUrl : "app/controllers/forstore/vendor_proRepository_ctrl",
			controller : 'vendorProductRepostoryCtrl'
		})).state('vendor_upload', angularAMD.route({
			title : '标准上架',
			url : '/vendor_upload',
			templateUrl : 'static/view/vendor/forstore/vendor_upload.html',
			controllerUrl : "app/controllers/forstore/vendor_upload_ctrl",
			controller : 'vendorUploadCtrl'
		})).state('vendor_repository', angularAMD.route({
			title : '仓库管理',
			url : '/vendor_repository',
			templateUrl : 'static/view/vendor/forstore/vendor_repository.html',
			controllerUrl : "app/controllers/forstore/vendor_repository_ctrl",
			controller : 'vendorRepositoryCtrl'
		})).state('vendor_material', angularAMD.route({
            title : '物料资料',
            url : '/vendor_material',
            templateUrl : 'static/view/vendor/forstore/vendor_material.html',
            controllerUrl : "app/controllers/forstore/vendor_materialCtrl",
            controller : 'vendor_materialCtrl'
        })).state('vendor_material_person', angularAMD.route({
            title : '个人物料资料',
            url : '/vendor_material_person',
            templateUrl : 'static/view/vendor/forstore/vendor_material_person.html',
            controllerUrl : "app/controllers/forstore/vendor_materialPersonCtrl",
            controller : 'vendor_materialPersonCtrl'
        })).state('vendor_material_erp', angularAMD.route({
			title : '可上架产品toErp',
			url : '/vendor_material_erp?standardParam',
			templateUrl : 'static/view/vendor/forstore/erp/vendor_material_erp.html',
			controllerUrl : "app/controllers/forstore/vendor_materialCtrl",
			controller : 'vendor_materialCtrl'
		})).state('vendor_material_unstandard_erp', angularAMD.route({
			title : '暂不可上架产品toErp',
			url : '/vendor_material_unstandard_erp?standardParam',
			templateUrl : 'static/view/vendor/forstore/erp/vendor_material_unstandard_erp.html',
			controllerUrl : "app/controllers/forstore/vendor_materialCtrl",
			controller : 'vendor_materialCtrl'
		})).state('vendor_onSale', angularAMD.route({
            title : '在售产品',
            url : '/vendor_onSale',
            templateUrl : 'static/view/vendor/forstore/vendor_onSale.html',
            controllerUrl : "app/controllers/forstore/vendor_onSaleCtrl",
            controller : 'vendor_onSaleCtrl'
        })).state('vendor_onSale_erp', angularAMD.route({
			title : '已上架产品toErp',
			url : '/vendor_onSale_erp',
			templateUrl : 'static/view/vendor/forstore/erp/vendor_onSale_erp.html',
			controllerUrl : "app/controllers/forstore/vendor_onSaleCtrl",
			controller : 'vendor_onSaleCtrl'
		})).state('vendor_standardPutOn', angularAMD.route({
			title : '标准上架管理',
			url : '/vendor_standardPutOn',
			templateUrl : 'static/view/vendor/forstore/vendor_standard_putOn.html',
			controllerUrl : "app/controllers/forstore/vendor_standard_putOn_ctrl",
			controller : 'vendor_standardPutOnCtrl'
		})).state('vendor_undercarriage', angularAMD.route({
			title : '下架产品',
			url : '/vendor_undercarriage',
			templateUrl : 'static/view/vendor/forstore/vendor_undercarriage.html',
			controllerUrl : "app/controllers/forstore/vendor_undercarriageCtrl",
			controller : 'vendor_undercarriageCtrl'
		})).state('vendor_undercarriage_erp', angularAMD.route({
            title : '上下架历史toErp',
            url : '/vendor_undercarriage_erp',
            templateUrl : 'static/view/vendor/forstore/erp/vendor_undercarriage_erp.html',
            controllerUrl : "app/controllers/forstore/vendor_undercarriageCtrl",
            controller : 'vendor_undercarriageCtrl'
        })).state('pay_center', angularAMD.route({
			url: '/payCenter?tab',
			templateUrl: 'static/view/vendor/forstore/pay_center.html',
			controller: 'payCenterCtrl',
			controllerUrl: 'app/controllers/forstore/pay_center_ctrl'
		})).state('vendor_deliveryRule', angularAMD.route({
			title : '配送规则',
			url: '/vendor_deliveryRule',
			templateUrl : 'static/view/vendor/forstore/vendor_delivery_rule.html',
			controller: 'vendorDeliveryRuleCtrl',
			controllerUrl: 'app/controllers/forstore/vendor_deliveryRule_ctrl'
		})).state('vendor_distributor', angularAMD.route({
			title : '配送商',
			url: '/vendor_distributor',
			templateUrl : 'static/view/vendor/forstore/vendor_distributor.html',
			controller: 'vendorDistributorCtrl',
			controllerUrl: 'app/controllers/forstore/vendor_distributor_ctrl'
		})).state('vendor_takeSelf', angularAMD.route({
			title : '自提点',
			url: '/vendor_takeSelf',
			templateUrl : 'static/view/vendor/forstore/vendor_take_self.html',
			controller: 'vendorTakeSelfCtrl',
			controllerUrl: 'app/controllers/forstore/vendor_takeSelf_ctrl'
		})).state('messagePersonal', angularAMD.route({
			url: '/messagePersonal',
			templateUrl: 'static/view/vendor/forstore/messagePersonal.html',
			controller: 'MessagePersonalCtrl',
			controllerUrl: 'app/controllers/forstore/messagePersonalCtrl'
		})).state('messagePublic', angularAMD.route({
			url: '/messagePublic',
			templateUrl: 'static/view/vendor/forstore/messagePublic.html',
			controller: 'MessagePublicCtrl',
			controllerUrl: 'app/controllers/forstore/messagePublicCtrl'
		})).state('vendorInvoice', angularAMD.route({
			url: '/vendor_invoice',
			title:'发票管理',
			templateUrl: 'static/view/vendor/forstore/vendor-invoice.html',
			controller: 'vendorInvoiceCtrl',
			controllerUrl: 'app/controllers/forstore/vendor_invoice_ctrl'
		})).state('showRate', angularAMD.route({
			url: '/showRate/:orderId/:buyEmail',
			templateUrl: 'static/view/vendor/forstore/showRate.html',
			controller: 'showRateCtrl',
			controllerUrl: 'app/controllers/forstore/show_rate_ctrl'
		})).state('vendorSeekPurchase', angularAMD.route({
			url: '/seekPurchase',
			templateUrl: 'static/view/vendor/forstore/seekPurchase.html',
			controller: 'seekPurchaseCtrl',
			controllerUrl: 'app/controllers/forstore/seek_purchase_ctrl'
		})).state('vendorPurchaseOffer', angularAMD.route({
			url: '/vendorPurchaseOffer',
			templateUrl: 'static/view/vendor/forstore/purchaseOffer.html',
			controller: 'purchaseOfferCtrl',
			controllerUrl: 'app/controllers/forstore/purchase_offer_ctrl'
		})).state('vendorPurchaseAccept', angularAMD.route({
			url: '/vendorPurchaseAccept',
			templateUrl: 'static/view/vendor/forstore/purchaseAccept.html',
			controller: 'purchaseAcceptCtrl',
			controllerUrl: 'app/controllers/forstore/purchase_accept_ctrl'
		}));
	}]);

	// 状态码  -> 描述
	app.filter('status', function(){
		var statusConfig = {
			'103': '未通过',
			'104': '已通过',
			'311': '待审核'
		};
		return function(data) {
			return statusConfig[data];
		}
	});

	app.run(['$rootScope', '$state', '$q', 'BaseService', 'StoreInfo', function($rootScope, $state, $q, BaseService, StoreInfo) {
		$rootScope.rootPath = BaseService.getRootPath();
		$rootScope.page = 'vendor';// 导航栏状态，'个人中心'状态激活

		$rootScope.$on('$stateChangeStart', function (event, toState) {

			var getToStateName = function () {
				if ($rootScope.store && (!$rootScope.store.status || $rootScope.store.status === 'OPENED')) {
					return 'vendor_store_maintain';
				} else if ($rootScope.store && $rootScope.store.status && $rootScope.store.status !== 'OPENED') {
					return 'vendor_store_close';
				} else if ($rootScope.applyStatus === 'NONE') {
					return 'vendor_store_apply';
				} else if ($rootScope.applyStatus === 'PREPARE') {
					return 'vendor_store_wait';
				} else if ($rootScope.applyStatus === 'PASS') {
					return 'vendor_store_info';
				} else {
					return 'vendor_index';
				}
			};

			// 创建店铺的Promise对象
			var deferred = $q.defer();
			StoreInfo.existStore({}, {}, function (store) {
				deferred.resolve(store);
			}, function (error) {
				deferred.reject(error);
			});
			var storePromise = deferred.promise;
			$rootScope.storePromise = storePromise;

			// 创建开店申请的Promise对象
			var deferred1 = $q.defer();
			StoreInfo.findShopOwnerApplyByNormalStatus({}, {}, function (result) {
				deferred1.resolve(result);
			}, function (error) {
				deferred1.reject(error);
			});
			var applyPromise = deferred1.promise;

			// 合并多个Promise对象
			$q.all([storePromise, applyPromise]).then(function (result) {
				$rootScope.store = result[0] && result[0].uuid ? result[0] : null;
				$rootScope.applyInfo = null;
				if (result[1] && result[1].success) {
					$rootScope.applyInfo = result[1].data;
					$rootScope.applyStatus = result[1].data ? result[1].data.status : 'NONE';
				} else {
					$rootScope.applyStatus = 'NONE';
				}

				if (toState.name === 'vendor_store_apply' && $rootScope.applyStatus !== 'NONE') {
					event.preventDefault();
					console.log('route', toState.name, getToStateName());
					$state.go(getToStateName());
					return ;
				}

				if (toState.name == 'vendor_store_wait' && $rootScope.applyStatus !== 'PREPARE') {
					event.preventDefault();
					console.log('route', toState.name, getToStateName());
					$state.go(getToStateName());
					return ;
				}

				if (toState.name == 'vendor_store_info' && ($rootScope.applyStatus !== 'PASS' || $rootScope.store)) {
					event.preventDefault();
					console.log('route', toState.name, getToStateName());
					$state.go(getToStateName());
					return ;
				}

				if (toState.name == 'vendor_store_maintain' && (!$rootScope.store || ($rootScope.store && $rootScope.store.status && $rootScope.store.status !== 'OPENED'))) {
					event.preventDefault();
					console.log('route', toState.name, getToStateName());
					$state.go(getToStateName());
					return ;
				}

				if (toState.name == 'vendor_store_close' && (!$rootScope.store || ($rootScope.store && (!$rootScope.store.status || $rootScope.store.status === 'OPENED')))) {
					event.preventDefault();
					console.log('route', toState.name, getToStateName());
					$state.go(getToStateName());
					return ;
				}
				console.log('route', toState.name);
			})['catch'](function () {
				$rootScope.store = null;
				$rootScope.applyInfo = null;
				$rootScope.applyStatus = 'NONE';
				event.preventDefault();
				console.log('route', toState.name, 'vendor_index');
				$state.go('vendor_index');
			});
		});
	}]);

	// 商品下架模态框
	app.controller('GoodsDischargeCtrl', ['$scope', 'toaster', '$modalInstance', 'goods', 'Goods', function($scope, toaster, $modalInstance, goods, Goods){
		//现在定义最大的天数为九天
		$scope.maxNumber = [1, 2, 3, 4, 5, 6, 7, 8, 9];
		$scope.goods = goods;//产品

		// 原来的库存
		$scope.goods.oldReserve = goods.reserve;
		$scope.newreserve = $scope.goods.oldReserve;

		//改变最后一个分段的数量。
		$scope.changeDisnum = function (newReserve) {
			$scope.goods.prices[$scope.goods.prices.length - 1].end = newReserve;
		}

		// 更新库存信息
		$scope.updateGoods = function(){

/*			// 日期格式化为指定格式
			var getNowFormatDate = function (date) {
                var seperator1 = "-";
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var strDate = date.getDate();
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }
                var currentdate = year + seperator1 + month + seperator1 + strDate;
                return currentdate;
            };
            $scope.goods.produceDate = getNowFormatDate($scope.goods.produceDate);*/

			$scope.goods.reserve =  $scope.newreserve;

			//更新分段信息
			if(!changeQtyPrice()) {
				return ;
			};

			//验证库存信息
			if(!$scope.checkGoodsInfo($scope.goods)) {
				return ;
			}

			Goods.updateGoods({}, $scope.goods, function(data){
				toaster.pop('success', '修改成功');
				$modalInstance.close();
			}, function(response){
				toaster.pop('error', '修改失败', response.data);
			});
		};

		/**
		 * 比较交货周期的大小
		 * @param min 本来是最小值
		 * @param max 本来是最大值
		 * @param type 2 表示当前验证的香港交期, 1表示当前验证的是大陆交期
		 * @returns {boolean} true 表示验证通过，false 表示验证失败。
		 */
		$scope.compareNum = function(min, max, type) {
			if(min < 1 || min > 9 || max < 1 || max > 9) {
				toaster.pop('warning', '交期的时间必须是1-9天之内');
			}
			if(!min || !max) {
				if(type == 1) {
					toaster.pop('warning', '大陆交期存在空值，请重新操作');
				}else if(type == 2){
					toaster.pop('warning', '香港交期存在空值，请重新操作');
				}
				return false;
			}
			if(min > max) {
				if(type == 1) {
					toaster.pop('warning', '大陆交期最短交期大于最大交期');
				}else if(type == 2){
					toaster.pop('warning', '香港交期最短交期大于最大交期');
				}
				return false;
			}
			return true;
		}

		// 下架全部产品
		$scope.dischargeAll = function(){
			$scope.goods.reserve = 0;
			$scope.goods.status = 602;
			Goods.batchDown({batchCodes : $scope.goods.batchCode}, {}, function(data){
				toaster.pop('success', '下架成功');
				$modalInstance.close();
			}, function(response){
				toaster.pop('error', '下架失败', response.data);
				$modalInstance.close();
			});
		};

		//取消模态框
		$scope.cancel = function() {
			$modalInstance.close();
		};

		// 打开日期输入框控件
		$scope.openDatePicker = function($event, openParam) {
			$event.preventDefault();
			$event.stopPropagation();
			$scope.goods[openParam] = !$scope.goods[openParam];
		};


		// 插入分段
		$scope.setMidQty = function(midQty) {
			if (midQty >= $scope.newreserve){
				toaster.pop('warning', '分段数量不可大于等于库存量');
				return ;
			} else if (midQty < $scope.goods.minBuyQty) {
				toaster.pop('warning', '分段数量不可小于最小起订量');
				return ;
			}else if($scope.goods.prices.length > 2) {
				toaster.pop('warning', '价格分段不能超过3个分段');
				return ;
			}else {
				var index = -1;
				for(var i = 0; i < $scope.goods.prices.length; i++) {
					var o = $scope.goods.prices[i];
					if(o.start < midQty && o.end > midQty) {
						index = i + 1;
						break;
					}
				}
				if(index != -1 && midQty) {
					$scope.goods.prices.splice(index, 0, {start: midQty});
					$scope.goods.prices[index].end = $scope.goods.prices[index - 1].end;
					$scope.goods.prices[index - 1].end = midQty - 1;
					$scope.midQty = null;
				}
			}
		};

		// 删除分段设置
		$scope.deleteQtyPrice = function(index, form) {
			$scope.goods.prices[index-1].end = $scope.goods.prices[index].end;
			$scope.goods.prices.splice(index, 1);
			$scope.goods.prices[$scope.goods.prices.length-1].end = $scope.goods.reserve;
			form.$dirty = true;
		};

		//下架部分产品时，分段最大数量改为库存量
		var changeQtyPrice = function() {
			var price = $scope.goods.prices;
			var previousEnd = -1;
			for(var i = 0; i < price.length; i++){
				if(price[i].start <= previousEnd) {
					toaster.pop('info', "提示", "存在上一个分段的结束值大于下一个分段的起始值");
					return false;
				}
				if(price[i].start >= price[i].end) {
					toaster.pop('info', "提示", "存在分段的起始值大于等于分段的结束值");
					return false;
				}
				if(price[i].end > $scope.newreserve){
					toaster.pop('info', "提示", "存在分段的结束值大于新库存数量");
					return false;
				}
				previousEnd = price[i].end;
			}
			$scope.goods.prices[0].start = $scope.goods.minBuyQty || 0;
			return true;
		};
	}]);

	app.controller('CollectCtrl', ['$scope', 'collectionService', 'toaster', '$rootScope', function ($scope, collectionService, toaster, $rootScope) {
		$scope.collect = function (id) {
			var obj = {'componentid': id, 'kind': 2};
			collectionService.saveEntity({}, obj, function(data) {
				toaster.pop('success', '收藏成功');
				$rootScope.componentCount++;
			}, function(error) {
				toaster.pop('error', '收藏失败', error);
			})
		}
	}]);

	//物流信息
	app.controller('listLogisticsCtrl', [ '$scope', '$modal', 'ResponseLogistics', '$modalInstance', 'lgtid', function($scope, $modal, ResponseLogistics, $modalInstance, lgtid){
		$scope.Info = [];
		$scope.getlogistics = function() {
			ResponseLogistics.get({id: lgtid}, {}, function(data) {
				$scope.Info = data;
			});
		};
		$scope.getlogistics();
		$scope.cancel = function() {
			$modalInstance.dismiss();
		};
	}]);

	/**
	 * 卖家中心头部
	 */
	app.controller('VendorCenterHeaderCtrl', ['$scope', 'BaseService'/*, 'InternalMessage'*/, function ($scope, BaseService/*, InternalMessage*/) {
		$scope.homeUrl = BaseService.getRootPath();
		// InternalMessage.getUnReadCount({recRole: 'SELLER'}, function (data) {
		// 	$scope.unReadMessage = data.count;
		// }, function (responge) {
        //
		// })
	}]);

	/**
	 * 卖家中心菜单控制器
	 */
	app.controller('VendorMenuCtrl', ['$scope', 'StoreInfo','$rootScope', function ($scope, StoreInfo, $rootScope) {
       /* //是寄售店铺
        $scope.isCONSIGNMENT = false;

        StoreInfo.findShopOwnerApplyByNormalStatus({}, {}, function (result) {
            if (!result.data) {
                $scope.isCONSIGNMENT = true;
            }else if (result.data.type == 'CONSIGNMENT' || result.data.status == 'PREPARE'){
            $scope.isCONSIGNMENT = true;
       		 }}, function (error) {

        });*/
	}]);

	/**
	 * 配送规则提示共用控制器
	 */
	app.controller('rule_tip_ctrl', ['$scope', 'toaster', '$modalInstance', 'type', 'tipModal', 'success', 'uuid', function ($scope, toaster, $modalInstance, type, tipModal, success, uuid) {
		$scope.tipModal = tipModal;
		$scope.type = type;
		$scope.success = success;
		$scope.uuid = uuid;

		$scope.cancelDelete = function () {
			$scope.tipModal = false;
			$modalInstance.dismiss();
		};

		$scope.hrefToNext = function (url) {
			$modalInstance.dismiss();
			window.location.href = url;
		};

		/**
		 * 监听点击的事件
		 */
		document.onclick = function (event) {
			if ($scope.tipModal) {
				if(event) {
					var tag = event.target;
					if(tag) {
						var attribute = tag.getAttribute("name");
						while(tag.nodeName != 'BODY') {
							if(attribute == 'rule_model' ||
								attribute == 'rule_cancel' || attribute == 'rule_href') {
								return ;
							}
							tag = tag.parentElement;
							attribute = tag.getAttribute("name");
						}
						$scope.$apply(function () {
							$scope.tipModal = false;
							$modalInstance.close();
						});

					}
				}
			}
		};
	}]);

	//币别的过滤器
	app.filter('currencySysmbol', function() {
		return function(moneyParam, currency, add) {
			if(typeof(moneyParam) == 'undefined') {
				moneyParam = 0;
			}
			if(currency == 'RMB') {
				return "￥ " + moneyParam + " " + (typeof(add) == "undefined" ? '' : add);
			}else if(currency == "USD"){
				return "$ " + moneyParam;
			}else {
				return moneyParam;
			}
		}
	});

	app.filter('firstchar', function () {
		return function (str) {
			if (str == null)
				return null;
			return str.substring(0, 1);
		};
	});

	/**
	 * 采购单状态
	 */
	app.filter('purchaseStatus', function() {
		return function(status) {
			if (!status || status == '') {
				status = 501;
			}
			if (status == 501 || status == 504 || status == 524 || status == 525) {
				return '待付款';
			} else if (status == 502 || status == 406) {
				return '待发货';
			} else if (status == 404) {
				return '待收货';
			} else if (status == 405 || status == 503 || status == 514) {
				return '待收款';
			} else if (status == 520){
				return '交易完成';
			} else {
				return '已取消';
			}
		}
	});

	app.filter('currencyStr', function () {
		return function (str) {
			return typeof str == 'string' && str != 'RMB' && str != 'USD' ? str.startsWith('RMB') ? '¥' + str.substring(3, str.length) : '$' + str.substring(3, str.length) : '-';
		}
	});

	app.controller('editPictureCtrl', ['$scope', 'pic', '$modalInstance', function ($scope, pic, $modalInstance) {
		console.log('log');
		$scope.pic = pic;
		$scope.cancel = function () {
			$modalInstance.close();
		};

		// 图片上传成功之后
		$scope.onUploadSuccess = function(data){
			$scope.pic = data.path;
		};

		$scope.confirm = function() {
			$modalInstance.close($scope.pic);
		}
	}]);

	return app;
});
