 define([ 'angularAMD', 'ui.router', 'ui-bootstrap', 'ui-form', 'ngLocal', 'ngTable', 'ngSanitize', 'ngDraggable', 'common/services', 'common/directives', 'common/query/brand', 'common/query/address', 'common/query/return' , 'common/query/change' ,'common/query/component', 'common/query/order', 'common/query/purchase', 'common/query/invoice', 'common/query/property', 'common/query/kind', 'common/query/property', 'common/query/receipt', 'common/query/logistics' ,'angular-toaster', 'ui-jquery', 'jquery-uploadify','common/query/dateParse' , 'common/query/bankTransfer' ,'common/query/bankInfo', 'common/query/urlencryption', 'common/query/bill', 'common/query/makerDemand', 'common/query/goods', 'common/query/validtime', 'file-upload','file-upload-shim', 'common/query/slideImage', 'common/query/kindAdvice', 'common/query/responseLogistics', 'common/query/search','common/directives/dynamicInput', 'common/query/auditorMail', 'common/query/tradeBasicProperties', 'common/query/exchangeRate', 'common/query/tradeDeliveryDelayTime', 'common/query/payment', 'common/query/kindContrast', 'common/query/crawlTask', 'common/query/afterSale', 'common/query/refund', 'common/query/messageBoard', 'common/query/logisticsPort', 'common/query/storeInfo', 'common/query/cms', 'common/query/help', 'common/query/commonCount', 'common/module/store_admin_violations_module', 'common/query/internalMessage','common/query/user','common/query/secQuestion','common/query/keyWord','common/query/logUsage','common/query/seekQualityBuyer','common/query/loanApply', 'common/query/seekSalesman'], function(angularAMD) {
	'use strict';

	 /**
	  * 获取数组的最后一个元素
	  */
	 Array.prototype.last = function() {
		 return this.length > 0 ? this[this.length - 1] : null;
	 };

	var app = angular.module('myApp', [ 'ui.router', 'ui.bootstrap', 'ui.form', 'ng.local', 'ngTable', 'ngSanitize', 'ngDraggable', 'common.services', 'common.directives', 'brandServices', 'addressServices', 'returnServices', 'changeServices', 'componentServices', 'orderServices', 'purchaseServices', 'invoiceServices', 'propertyServices', 'receiptServices', 'logisticsServices', 'common.query.kind', 'toaster','ui.jquery' ,'dateparseServices', 'bankInfo' , 'bankTransfer', 'urlencryptionServices', 'billServices', 'makerDemand', 'goodsServices', 'validtimeServices', 'angularFileUpload', 'slideImageService', 'common.query.kindAdvice', 'responseLogisticsService', 'searchService', 'ngDynamicInput', 'ReviewerEmailInfoService', 'tradeBasicPropertiesServices', 'exchangeRateModule', 'tradeDeliveryDelayTimeModule', 'PaymentService', 'kindContrastServices', 'crawlTaskServices', 'afterSaleService', 'refundModule', 'messageBoardServices', 'logisticsPortService', 'storeInfoServices', 'cmsService', 'helpServices', 'commonCountServices', 'tool.directives', 'StoreAdminViolationsModule', 'internalMessageServices','common.query.user','secQuestionServices','keyWordServices','logUsageServices','seekQualityBuyerServices', 'loanApplyService', 'seekSalesmanServices']);
	app.init = function() {
		angularAMD.bootstrap(app);
	};
	
	// ui-router 路由配置
	app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider){
		$urlRouterProvider.otherwise("/index");
		$stateProvider.state('index', {
			// 管理首页
			url: '/index',
			templateUrl : 'static/view/admin/index.html',
			controller : '',
			controllerUrl : ''
		}).state('trade_purchase', angularAMD.route({
			// 采购单管理
			url: '/trade/purchase',
			templateUrl : 'static/view/admin/trade/trade_purchase.html',
			controller : 'TradePurchaseCtrl',
			controllerUrl : 'app/controllers/trade/TradePurchaseCtrl'
		})).state('trade_buyerOrder', angularAMD.route({
			// 卖家销售单跟踪
			url: '/trade/buyerOrder',
			templateUrl : 'static/view/admin/trade/trade_buyer_order.html',
			controller : 'BuyerOrderCtrl',
			controllerUrl : 'app/controllers/trade/BuyerOrderCtrl'
		})).state('trade_purchase_detail', angularAMD.route({
			// 采购单详情
			url: '/trade/purchase/:purchaseid',
			templateUrl : 'static/view/admin/trade/trade_purchase_detail.html',
			controller : 'TradePurchaseDetailCtrl',
			controllerUrl : 'app/controllers/trade/TradePurchaseDetailCtrl'
		})).state('trade_payment_detail', angularAMD.route({
			//付款申请单详情
			url: '/trade/payment/:requestId',
			templateUrl : 'static/view/admin/trade/trade_payment_detail.html',
			controller : 'TradePaymentDetailCtrl',
			controllerUrl : 'app/controllers/trade/TradePaymentDetailCtrl'
		})).state('trade_order', angularAMD.route({
			// 订单管理
			url: '/trade/order',
			templateUrl : 'static/view/admin/trade/trade_order.html',
			controller : 'TradeOrderCtrl',
			controllerUrl : 'app/controllers/trade/TradeOrderCtrl'
		})).state('trade_ordersearch', angularAMD.route({
			// 订单查询接口
			url: '/trade/ordersearch',
			templateUrl : 'static/view/admin/trade/trade_ordersearch.html',
			controller : 'TradeOrderSearchCtrl',
			controllerUrl : 'app/controllers/trade/TradeOrderSearchCtrl'
		})).state('trade_invoicefrompurc', angularAMD.route({
			// 卖家出货单管理
			url: '/trade/invoicefrompurc',
			templateUrl : 'static/view/admin/trade/trade_invoicefrompurc.html',
			controller : 'InvoicefromPurcCtrl',
			controllerUrl : 'app/controllers/trade/InvoicefromPurcCtrl'
		})).state('trade_invoicefrompurc_detail', angularAMD.route({
			// 卖家出货单详情页
			url: '/trade/invoicefrompurc/:invoiceid',
			templateUrl : 'static/view/admin/trade/trade_invoicefrompurc_detail.html',
			controller : 'InvoicefromPurcDetailCtrl',
			controllerUrl : 'app/controllers/trade/InvoicefromPurcDetailCtrl'
		})).state('trade_record_chart', angularAMD.route({
			// 交易记录表
			url: '/trade/record_chart',
			templateUrl : 'static/view/admin/trade/trade_record_chart.html',
			controller : 'TradeRecordChartCtrl',
			controllerUrl : 'app/controllers/trade/TradeRecordChartCtrl'
		})).state('buyerExProcess', angularAMD.route({
			// 买家异常处理
			url: '/trade/buyerExProcess',
			templateUrl : 'static/view/admin/trade/trade-afSaleApplyProcessing.html',
			controller : 'AfSaleApplyProcessingCtrl',
			controllerUrl : 'app/controllers/trade/AfSaleApplyProcessingCtrl'
		})).state('tradeAfSaleApplyDetails', angularAMD.route({
			// 售后申请详情
			url: '/trade/afSaleApplyDetails/:applyId',
			templateUrl : 'static/view/admin/trade/trade-afSaleApplyDetails.html',
			controller : 'AfSaleApplyDetailsCtrl',
			controllerUrl : 'app/controllers/trade/AfSaleApplyDetailsCtrl'
		})).state('supExProcess', angularAMD.route({
			// 卖家异常处理
			url: '/trade/supExProcess',
			templateUrl : 'static/view/admin/trade/trade-supExProcess.html',
			controller : 'supExProcessCtrl',
			controllerUrl : 'app/controllers/trade/supExProcessCtrl'
		})).state('supExProcessDetails', angularAMD.route({
			// 卖家异常处理
			url: '/trade/supExProcessDetails/:applyId',
			templateUrl : 'static/view/admin/trade/trade-supExProcessDetails.html',
			controller : 'supExProcessDetailsCtrl',
			controllerUrl : 'app/controllers/trade/supExProcessDetailsCtrl'
		})).state('trade_returnfromb2c', angularAMD.route({
			// 平台退货单管理
			url: '/trade/returnfromb2c',
			templateUrl : 'static/view/admin/trade/trade_returnfromb2c.html',
			controller : 'Returnfromb2cCtrl',
			controllerUrl : 'app/controllers/trade/Returnfromb2cCtrl'
		})).state('trade_returnfromb2c_detail', angularAMD.route({
			// 平台退货单详情
			url: '/trade/returnfromb2c/:returnid',
			templateUrl : 'static/view/admin/trade/trade_returnfromb2c_detail.html',
			controller : 'ReturnFromB2CDetailCtrl',
			controllerUrl : 'app/controllers/trade/ReturnFromB2CDetailCtrl'
		})).state('trade_returnfromcust', angularAMD.route({
			// 客户退货单管理
			url: '/trade/returnfromcust',
			templateUrl : 'static/view/admin/trade/trade_returnfromcust.html',
			controller : 'ReturnfromcustCtrl',
			controllerUrl : 'app/controllers/trade/ReturnfromcustCtrl'
		})).state('trade_returnfromcust_detail', angularAMD.route({
			// 客户退货单详情
			url: '/trade/returnfromcust/:returnid',
			templateUrl : 'static/view/admin/trade/trade_returnfromcust_detail.html',
			controller : 'ReturnFromCustDetailCtrl',
			controllerUrl : 'app/controllers/trade/ReturnFromCustDetailCtrl'
		})).state('trade_changefromb2c', angularAMD.route({
			// 平台换货单管理
			url: '/trade/changefromb2c',
			templateUrl : 'static/view/admin/trade/trade_changefromb2c.html',
			controller : 'Changefromb2cCtrl',
			controllerUrl : 'app/controllers/trade/Changefromb2cCtrl'
		})).state('trade_changefromb2c_detail', angularAMD.route({
			// 平台换货单详情
			url: '/trade/changefromb2c/:changeid',
			templateUrl : 'static/view/admin/trade/trade_changefromb2c_detail.html',
			controller : 'ChangeFromB2CDetailCtrl',
			controllerUrl : 'app/controllers/trade/ChangeFromB2CDetailCtrl'
		})).state('trade_changefromcust', angularAMD.route({
			// 客户换货单管理
			url: '/trade/changefromcust',
			templateUrl : 'static/view/admin/trade/trade_changefromcust.html',
			controller : 'ChangefromcustCtrl',
			controllerUrl : 'app/controllers/trade/ChangefromcustCtrl'
		})).state('trade_changefromcust_detail', angularAMD.route({
			// 客户换货单详情
			url: '/trade/changefromcust/:changeid',
			templateUrl : 'static/view/admin/trade/trade_changefromcust_detail.html',
			controller : 'ChangeFromCustDetailCtrl',
			controllerUrl : 'app/controllers/trade/ChangeFromCustDetailCtrl'
		})).state('trade_invoicevenderchange', angularAMD.route({
			// 供应商换货出货单管理
			url: '/trade/invoicevenderchange',
			templateUrl : 'static/view/admin/trade/trade_invoicevenderchange.html',
			controller : 'InvoicevenderchangeCtrl',
			controllerUrl : 'app/controllers/trade/InvoicevenderchangeCtrl'
		})).state('trade_invoicevenderchange_detail', angularAMD.route({
			// 供应商换货出货单详情
			url: '/trade/invoicevenderchange/:invoiceid',
			templateUrl : 'static/view/admin/trade/trade_invoicevenderchange_detail.html',
			controller : 'InvoicevenderchangeDetailCtrl',
			controllerUrl : 'app/controllers/trade/InvoicevenderchangeDetailCtrl'
		})).state('trade_invoiceb2cchange', angularAMD.route({
			// 平台换货出货单管理
			url: '/trade/invoiceb2cchange',
			templateUrl : 'static/view/admin/trade/trade_invoiceb2cchange.html',
			controller : 'Invoiceb2cchangeCtrl',
			controllerUrl : 'app/controllers/trade/Invoiceb2cchangeCtrl'
		})).state('trade_invoiceb2cchange_detail', angularAMD.route({
			// 平台换货出货单详情
			url: '/trade/invoiceb2cchange/:invoiceid',
			templateUrl : 'static/view/admin/trade/trade_invoiceb2cchange_detail.html',
			controller : 'Invoiceb2cchangeCtrlDetail',
			controllerUrl : 'app/controllers/trade/Invoiceb2cchangeCtrlDetail'
		})).state('trade_invoicefromorder', angularAMD.route({
			// 平台出货单管理
			url: '/trade/invoicefromorder',
			templateUrl : 'static/view/admin/trade/trade_invoicefromorder.html',
			controller : 'InvoicefromOrderCtrl',
			controllerUrl : 'app/controllers/trade/InvoicefromOrderCtrl'
		})).state('trade_invoicefromorder_detail', angularAMD.route({
			// 平台出货单详情
			url: '/trade/invoicefromorder/:invoiceid',
			templateUrl : 'static/view/admin/trade/trade_invoicefromorder_detail.html',
			controller : 'InvoicefromOrderDetailCtrl',
			controllerUrl : 'app/controllers/trade/InvoicefromOrderDetailCtrl'
		})).state('trade_order_detail', angularAMD.route({
			// 订单详情界面
			url: '/trade/order/:orderid',
			templateUrl : 'static/view/admin/trade/trade_order_detail.html',
			controller : 'TradeOrderDetailCtrl',
			controllerUrl : 'app/controllers/trade/TradeOrderDetailCtrl'
		})).state('trade_receipt', angularAMD.route({
			// 平台入库单管理
			url: '/trade/receipt',
			templateUrl : 'static/view/admin/trade/trade_receipt.html',
			controller : 'ReceiptCtrl',
			controllerUrl : 'app/controllers/trade/ReceiptCtrl'
		})).state('trade_receipt_detail', angularAMD.route({
			// 平台入库单详情
			url: '/trade/receipt/:receiptid',
			templateUrl : 'static/view/admin/trade/trade_receipt_detail.html',
			controller : 'ReceiptDetailCtrl',
			controllerUrl : 'app/controllers/trade/ReceiptDetailCtrl'
		})).state('check_vender', angularAMD.route({
			// 结算中心管理
			url: '/check/check_vender',
			templateUrl : 'static/view/admin/checkMoney/check_money.html',
			controller : 'CheckVenderCtrl',
			controllerUrl : 'app/controllers/CheckVenderCtrl'
		})).state('ensure_checkmoney', angularAMD.route({
			// 结算中心 结算出入库单
			url: '/check/check_vender/:uu',
			templateUrl : 'static/view/admin/checkMoney/ensure_checkmoney.html',
			controller : 'EnsureCheckMoneyCtrl',
			controllerUrl : 'app/controllers/EnsureCheckMoneyCtrl'
		})).state('request_payment', angularAMD.route({
			// 结算中心 付款申请
			url: '/check/request_pay/:uu',
			templateUrl : 'static/view/admin/checkMoney/request_pay.html',
			controller : 'RequestPayCtrl',
			controllerUrl : 'app/controllers/RequestPayCtrl'
		})).state('fiance_settle', angularAMD.route({
			// 结算中心 财务结算
			url: '/check/settlement',
			templateUrl : 'static/view/admin/checkMoney/Settlement.html',
			controller : 'SettlementCtrl',
			controllerUrl : 'app/controllers/checkMoney/SettlementCtrl'
		})).state('histTransfer', angularAMD.route({
			// 结算中心 查询历史转账
			url: '/check/histTransfer',
			templateUrl : 'static/view/admin/checkMoney/histTransfer.html',
			controller : 'HistTransferCtrl',
			controllerUrl : 'app/controllers/HistTransferCtrl'
		})).state('accountQuery', angularAMD.route({
			// 结算中心 账户查询
			url: '/check/accountQuery',
			templateUrl : 'static/view/admin/checkMoney/accountQuery.html',
			controller : 'accountQueryCtrl',
			controllerUrl : 'app/controllers/checkMoney/accountQueryCtrl'
		})).state('refund', angularAMD.route({
			// 退款单管理
			url: '/check/refund',
			templateUrl : 'static/view/admin/checkMoney/refund.html',
			controller : 'refundCtrl',
			controllerUrl : 'app/controllers/checkMoney/refund'
		})).state('audit_brand', angularAMD.route({
			// 品牌审批
			url: '/audit/brand',
			templateUrl : 'static/view/admin/audit_brand.html',
			controller : 'AuditBrandCtrl',
			controllerUrl : 'app/controllers/AuditBrandCtrl'
		})).state('audit_brand_detail', angularAMD.route({
			// 品牌审批详细页面
			url: '/audit/brand/:id',
			templateUrl : 'static/view/admin/audit_brand_detail.html',
			controller : 'AuditBrandDetailCtrl',
			controllerUrl : 'app/controllers/AuditBrandDetailCtrl'
		})).state('brand_maintenance', angularAMD.route({
			// 品牌维护
			url: '/brandmaintenance',
			templateUrl : 'static/view/admin/brand_maintenance.html',
			controller : 'BrandMaintenanceCtrl',
			controllerUrl : 'app/controllers/BrandMaintenanceCtrl'
		})).state('brand_map', angularAMD.route({
			// 品牌映射维护
			url: '/brand/map',
			templateUrl : 'static/view/admin/product/brand_map.html',
			controller : 'BrandMapCtrl',
			controllerUrl : 'app/controllers/product/brandMapCtrl'
		})).state('store_company_list', angularAMD.route({
			// 寄售管理
			url: '/store/company',
			templateUrl : 'static/view/admin/store/store_company_list.html',
			controller : 'StoreCompanyListCtrl',
			controllerUrl : 'app/controllers/store/StoreCompanyListCtrl'
		})).state('store_company_detail', angularAMD.route({
			// 寄售管理-详情
			url: '/store/company/:enUU/detail',
			templateUrl : 'static/view/admin/store/store_company_detail.html',
			controller : 'StoreCompanyDetailCtrl',
			controllerUrl : 'app/controllers/store/StoreCompanyDetailCtrl'
		})).state('store_application_maintenance', angularAMD.route({
			// 店铺申请
			url: '/store/application',
			templateUrl : 'static/view/admin/store_application_maintenance.html',
			controller : 'StoreApplicationCtrl',
			controllerUrl : 'app/controllers/StoreApplicationCtrl'
		})).state('store_qualification_auth', angularAMD.route({
			// 资质审核
			url: '/store/qualification/:applyUuid',
			templateUrl : 'static/view/admin/store_qualification_maintenance.html',
			controller : 'StoreQualificationCtrl',
			controllerUrl : 'app/controllers/StoreQualificationCtrl'
		})).state('store_info_list', angularAMD.route({
			// 店铺列表
			url: '/store/list',
			templateUrl : 'static/view/admin/store_info_list.html',
			controller : 'StoreInfoListCtrl',
			controllerUrl : 'app/controllers/StoreInfoListCtrl'
		})).state('store_info_detail', angularAMD.route({
			// 店铺详情，违规处理页面
			url: '/store/:uuid/detail/:type',
			templateUrl : 'static/view/admin/store/store_info_detail.html',
			controller : 'StoreInfoDetailCtrl',
			controllerUrl : 'app/controllers/store/StoreInfoDetailCtrl'
		})).state('brand_maintenance_detail', angularAMD.route({
			// 品牌维护详情、更新
			url: '/brandmaintenance/:uuid',
			templateUrl : 'static/view/admin/brand_maintenance_detail.html',
			controller : 'BrandMaintenanceDetailCtrl',
			controllerUrl : 'app/controllers/BrandMaintenanceDetailCtrl'
		})).state('mgr', angularAMD.route({
			// 类目审批
			url: '/audit/kind',
			templateUrl : 'static/view/admin/',
			controller : '',
			controllerUrl : ''
		})).state('audit_component', angularAMD.route({
			// 标准器件审批
			url: '/audit/component',
			templateUrl : 'static/view/admin/audit_component.html',
			controller : 'AuditComponentCtrl',
			controllerUrl : 'app/controllers/AuditComponentCtrl'
		})).state('audit_component_detail', angularAMD.route({
			// 品牌审批详细页面
			url: '/audit/component/:id',
			templateUrl : 'static/view/admin/audit_component_detail.html',
			controller : 'AuditComponentDetailCtrl',
			controllerUrl : 'app/controllers/AuditComponentDetailCtrl'
		})).state('audit_componentMaintenance', angularAMD.route({
			// 标准器件维护
			url: '/audit/componentMaintenance',
			templateUrl : 'static/view/admin/audit_componentMaintenance.html',
			controller : 'AuditComponentMaintenanceCtrl',
			controllerUrl : 'app/controllers/AuditComponentMaintenanceCtrl'
		})).state('audit_componentBatchMaintenance', angularAMD.route({
			// 审核标准器件批量建档申请
			url: '/audit/componentBatchMaintenance',
			templateUrl : 'static/view/admin/audit_componentBatchMaintenance.html',
			controller : 'AuditComponentBatchMaintenanceCtrl',
			controllerUrl : 'app/controllers/AuditComponentBatchMaintenanceCtrl'
		})).state('audit_componentBatchMaintenance_detail', angularAMD.route({
			// 审核标准器件批量建档申请详情
			url: '/audit/componentBatchMaintenance/detail/:submitId',
			templateUrl : 'static/view/admin/audit_componentSubmitBatch_detail.html',
			controller : 'AuditComponentSubmitBatchDtCtrl',
			controllerUrl : 'app/controllers/AuditComponentSubmitBatchDtCtrl'
		})).state('audit_componentSubmitBatch_detail_list', angularAMD.route({
			// 标准器件批量建档申请详情列表
			url: '/audit/componentSubmitBatch/detail/list',
			templateUrl : 'static/view/admin/componentSubmitBatch_detail_list.html',
			controller : 'ComponentSubmitBatchDetailListCtrl',
			controllerUrl : 'app/controllers/ComponentSubmitBatchDetailListCtrl'
		})).state('audit_kindCompare', angularAMD.route({
			// 属性对应关系维护
			url: '/audit/kindContrast',
			templateUrl : 'static/view/admin/product/kindContrast.html',
			controller : 'KindContrastCtrl',
			controllerUrl : 'app/controllers/product/KindContrastCtrl'
		})).state('audit_kindCompare_detail', angularAMD.route({
			// 属性对应关系维护详情页
			url: '/audit/kindContrast/:id',
			templateUrl : 'static/view/admin/product/kindContrast_detail.html',
			controller : 'KindContrastDetailCtrl',
			controllerUrl : 'app/controllers/product/KindContrastDetailCtrl'
		})).state('crawl_task', angularAMD.route({
			// 数据爬取任务
			url: '/audit/crawlTask',
			templateUrl : 'static/view/admin/product/crawl_task.html',
			controller : 'CrawlTaskCtrl',
			controllerUrl : 'app/controllers/product/CrawlTaskCtrl'
		})).state('crawl_task_detail', angularAMD.route({
			// 数据爬取任务详情页
			url: '/audit/crawlTask/:id',
			templateUrl : 'static/view/admin/product/crawl_task_detail.html',
			controller : 'CrawlTaskDetailCtrl',
			controllerUrl : 'app/controllers/product/CrawlTaskDetailCtrl'
		})).state('crawl_task_component_list', angularAMD.route({
			// 数据爬取任务成功的器件展示页
			url: '/audit/crawlTask/:taskId/componentList',
			templateUrl : 'static/view/admin/product/crawl_task_component_list.html',
			controller : 'CrawlTaskCMPListCtrl',
			controllerUrl : 'app/controllers/product/CrawlTaskCMPListCtrl'
		})).state('crawl_task_component_detail', angularAMD.route({
			// 数据爬取任务成功的器件详情页
			url: '/audit/crawlTask/:taskId/component/:uuid',
			templateUrl: 'static/view/admin/product/crawl_task_component_detail.html',
			controller: 'CrawlTaskCMPDetailCtrl',
			controllerUrl: 'app/controllers/product/CrawlTaskCMPDetailCtrl'
		})).state('audit_bankinfo', angularAMD.route({
			// 银行账户信息管理
			url: '/audit/bankinfo',
			templateUrl: 'static/view/admin/bankInfo/auditBankInfo.html',
			controller: 'AuditBankInfoCtrl',
			controllerUrl: 'app/controllers/bankInfo/AuditBankInfoCtrl'
		})).state('audit_realAuth', angularAMD.route({
			// 实名认证审核
			url: '/audit/realAuth',
			templateUrl: 'static/view/admin/audit_realAuth.html',
			controller: 'AuditRealAuthCtrl',
			controllerUrl: 'app/controllers/AuditRealAuthCtrl'
		})).state('uploadComponentCrawl', angularAMD.route({
			// 上传爬取数据页面
			url: '/product/componentCrawl/upload',
			templateUrl : 'static/view/admin/product/uploadComponentCrawl.html',
			controller : 'UploadComponentCrawlCtrl',
			controllerUrl : 'app/controllers/product/UploadComponentCrawlCtrl'
		})).state('disable_brand', angularAMD.route({
			// 禁用品牌界面
			url: '/disable/brand',
			templateUrl : 'static/view/admin/disable_brand.html',
			controller : 'DisableBrandCtrl',
			controllerUrl : 'app/controllers/DisableBrandCtrl'
		})).state('disable_component', angularAMD.route({
			// 禁用标准器件界面
			url: '/disable/component',
			templateUrl : 'static/view/admin/disable_component.html',
			controller : 'DisableComponentCtrl',
			controllerUrl : 'app/controllers/DisableComponentCtrl'
		})).state('test', angularAMD.route({
			// 数据初始化界面
			url: '/test',
			templateUrl : 'static/view/admin/test.html',
			controller : 'TestCtrl',
			controllerUrl : 'app/controllers/TestCtrl'
		})).state('logistics_pickUpAddress', angularAMD.route({
			// 上门自取地址管理界面
			url: '/logistics/pickUpAddress',
			templateUrl : 'static/view/admin/logistics/logistics_pickUpAddress.html',
			controller : 'LogisticsPickUpAddressCtrl',
			controllerUrl : 'app/controllers/logistics/LogisticsPickUpAddressCtrl'
		})).state('logistics_pickUpAddressNew', angularAMD.route({
			// 新增上门自取地址
			url: '/logistics/pickUpAddress/new',
			templateUrl : 'static/view/admin/logistics/pickUpAddress_add.html',
			controller : 'PickUpAddressAddCtrl',
			controllerUrl : 'app/controllers/logistics/PickUpAddressAddCtrl'
		})).state('logistics_pickUpAddress_add', angularAMD.route({
			// 修改上门自取地址
			url: '/logistics/pickUpAddress/:id',
			templateUrl : 'static/view/admin/logistics/pickUpAddress_add.html',
			controller : 'PickUpAddressAddCtrl',
			controllerUrl : 'app/controllers/logistics/PickUpAddressAddCtrl'
		})).state('tool_test', angularAMD.route({
			// 测试类的
			url: '/tool/test',
			templateUrl : 'static/view/admin/tool/test.html',
			controller : 'ToolTestCtrl',
			controllerUrl : 'app/controllers/logistics/ToolTestCtrl'
		})).state('platform_repository', angularAMD.route({
			// 平台仓储管理
			url: '/platform/repository',
			templateUrl : 'static/view/admin/platform_repository.html',
			controller : 'PlatformRepository',
			controllerUrl : 'app/controllers/PlatformRepository',
			title : '管理平台收发货地址'
		})).state('credit_card', angularAMD.route({
			url : '/check/credit',
			templateUrl : 'static/view/admin/checkMoney/creditCardAdmin.html',
			controller : 'creditCardAdminCtrl',
			controllerUrl : 'app/controllers/checkMoney/creditCardAdminCtrl'
		})).state('orderBillAdmin', angularAMD.route({
			url : '/order/bill/admin',
			templateUrl : 'static/view/admin/checkMoney/orderBillAdmin.html',
			controller : 'orderBillAdminCtrl',
			controllerUrl : 'app/controllers/checkMoney/orderBillAdminCtrl'
		})).state('purchaseBillAdmin', angularAMD.route({
			url : '/purchase/bill/admin',
			templateUrl : 'static/view/admin/checkMoney/purchaseBillAdmin.html',
			controller : 'purchaseBillAdminCtrl',
			controllerUrl : 'app/controllers/checkMoney/purchaseBillAdminCtrl' 
		})).state('billInfoAdmin', angularAMD.route({
			url : '/billInfo/admin',
			templateUrl : 'static/view/admin/checkMoney/billInfoAdmin.html',
			controller : 'billInfoAdminCtrl',
			controllerUrl : 'app/controllers/checkMoney/billInfoAdminCtrl'
		})).state('bill_input', angularAMD.route({
			url : '/billInput/revise/:id',
			templateUrl : 'static/view/admin/checkMoney/billInput.html',
			controller : 'BillInputCtrl',
			controllerUrl : 'app/controllers/checkMoney/BillInputCtrl',
			resolve: {
				isNormal: function() {return 1207;}
			}
		})).state('bill_input_normal', angularAMD.route({
			url : '/billInput/normal',
			templateUrl : 'static/view/admin/checkMoney/billInput.html',
			controller : 'BillInputCtrl',
			controllerUrl : 'app/controllers/checkMoney/BillInputCtrl',
			resolve: {
				isNormal: function() {return 1206;}
			}
		})).state('bill_input_special', angularAMD.route({
			url : '/billInput/special',
			templateUrl : 'static/view/admin/checkMoney/billInput.html',
			controller : 'BillInputCtrl',
			controllerUrl : 'app/controllers/checkMoney/BillInputCtrl',
			resolve: {
				isNormal: function() {return 1205;}
			}
		})).state('bill_notice', angularAMD.route({
			url : '/bill/notice',
			templateUrl : 'static/view/admin/checkMoney/billNotice.html'
		})).state('makeDemand', angularAMD.route({
			url : '/makeDemand/admin',
			templateUrl : 'static/view/admin/customService/makeDemandList.html',
			controller : 'makeDemandListCtrl',
			controllerUrl : 'app/controllers/customService/makeDemandList'
		})).state('maDemandInput', angularAMD.route({
			url : '/makeDemand/:id/input/:input',
			templateUrl : 'static/view/admin/customService/makeDemandInput.html',
			controller : 'makeDemandInputCtrl',
			controllerUrl : 'app/controllers/customService/makeDemandInput'
		})).state('ReviewerEmailInfo', angularAMD.route({
			//审核人邮箱设置
			url : '/ReviewerEmailInfo/admin',
			templateUrl : 'static/view/admin/customService/ReviewerEmailInfo.html',
			controller : 'ReviewerEmailInfoCtrl',
			controllerUrl : 'app/controllers/customService/ReviewerEmailInfo'
		})).state('goodsStatistics', angularAMD.route({
			// 在售商品信息统计
			url : '/trade/goodsStatistics',
			templateUrl : 'static/view/admin/trade/trade_goods_statistics.html',
			controller : 'goodsStatisticsCtrl',
			controllerUrl : 'app/controllers/trade/goodsStatisticsCtrl'
		})).state('overtimeBatch', angularAMD.route({
			// 即将失效批次列表
			url : '/product/overtimeBatch',
			templateUrl : 'static/view/admin/product/overtimeBatch.html',
			controller : 'overtimeBatchCtrl',
			controllerUrl : 'app/controllers/product/overtimeBatchCtrl'
		})).state('validtime', angularAMD.route({
			// 批次有效期维护
			url : '/product/validtime',
			templateUrl : 'static/view/admin/product/validtime.html',
			controller : 'validtimeCtrl',
			controllerUrl : 'app/controllers/product/validtimeCtrl'
		})).state('sailingGoods', angularAMD.route({
			// 销售中的产品
			url : '/product/sailingGoods',
			templateUrl : 'static/view/admin/product/salingGoods.html',
			controller : 'sailingGoodsCtrl',
			controllerUrl : 'app/controllers/product/sailingGoodsCtrl'
		})).state('downedGoods', angularAMD.route({
			url : '/product/downedGoods',
			templateUrl : 'static/view/admin/product/downedGoods.html',
			controller : 'downedGoodsCtrl',
			controllerUrl : 'app/controllers/product/downedGoodsCtrl'
		})).state('proeprty', angularAMD.route({
			// 维护属性
			url: '/properties',
			templateUrl : 'static/view/admin/product/product_properties.html',
			controller : 'PropertiesCtrl',
			controllerUrl : 'app/controllers/product/PropertiesCtrl',
			title: '属性维护'
		})).state('kind', angularAMD.route({
			// 维护产品类目
			url: '/kinds',
			templateUrl : 'static/view/admin/product/product_kind.html',
			controller : 'KindCtrl',
			controllerUrl : 'app/controllers/product/KindCtrl',
			title: '类目维护'
		})).state('kindProperty', angularAMD.route({
			// 维护器件类目的属性
			url: '/kindProperty',
			templateUrl: 'static/view/admin/product/product_kindProperty.html',
			controller: 'KindPropertyCtrl',
			controllerUrl: 'app/controllers/product/KindPropertyCtrl',
			title: '类目属性维护'
		})).state('moveCmp', angularAMD.route({
			// 批量修改器件类目
			url: '/moveCmp',
			templateUrl: 'static/view/admin/product/moveCmp.html',
			controller: 'MoveCmpCtrl',
			controllerUrl: 'app/controllers/product/MoveCmpCtrl',
			title: '批量修改器件类目'
		})).state('kindProperty.step1', angularAMD.route({
			// 维护器件类目的属性，第一步选择类目
			url: '/1',
			templateUrl: 'static/view/admin/product/product_kindProperty_1.html',
			controller: 'KindProperty_1Ctrl',
			controllerUrl: 'app/controllers/product/KindPropertyCtrl',
			title: '选择要维护的类目'
		})).state('kindProperty.step2', angularAMD.route({
			// 维护器件类目的属性，第二步维护描述属性
			url: '/2/:kindId',
			templateUrl: 'static/view/admin/product/product_kindProperty_2.html',
			controller: 'KindProperty_2Ctrl',
			controllerUrl: 'app/controllers/product/KindPropertyCtrl',
			title: '维护类目的属性'
		})).state('kindAdvice', angularAMD.route({
			// 首页展示（轮播图片管理）
			url: '/kindAdvice',
			templateUrl: 'static/view/admin/product/kindAdvice.html',
			controller: 'KindAdviceCtrl',
			controllerUrl: 'app/controllers/product/KindAdviceCtrl',
			title: '轮播图片管理'
		})).state('logUsage', angularAMD.route({
      //用户操作日志
      url: '/logUsage',
      templateUrl: 'static/view/admin/logUsage.html',
      controller: 'LogUsageCtrl',
      controllerUrl: 'app/controllers/LogUsageCtrl',
      title: '用户操作日志'
    })).state('seekQualityBuyer', angularAMD.route({

      url: '/seekQualityBuyer',
      templateUrl: 'static/view/admin/seekQualityBuyer.html',
      controller: 'SeekQualityBuyerCtrl',
      controllerUrl: 'app/controllers/SeekQualityBuyerCtrl',
      title: '优质采购商'
    })).state('seekSalesman', angularAMD.route({
		url: '/seekSalesman',
		templateUrl: 'static/view/admin/seek_salesman.html',
		controller: 'SeekSalesmanCtrl',
		controllerUrl: 'app/controllers/SeekSalesmanCtrl',
		title: '求购-业务员分配'
	})).state('seekSalesmandetail', angularAMD.route({
		// 求购-业务员 查看详情
		url: '/seekSalesman/:uuid/:name',
		templateUrl : 'static/view/admin/seek_salesman_detail.html',
		controller : 'SeekSalesmanDetailCtrl',
		controllerUrl : 'app/controllers/SeekSalesmanDetailCtrl'
    })).state('keyWord', angularAMD.route({
      url: '/keyWord',
      templateUrl: 'static/view/admin/keyword.html',
      controller: 'KeyWordCtrl',
      controllerUrl: 'app/controllers/KeyWordCtrl',
      title: '非法关键词维护'
    })).state('slideImage', angularAMD.route({
			// 首页展示（轮播图片管理）
			url: '/operation/slideImage',
			templateUrl: 'static/view/admin/operation/slideImage.html',
			controller: 'SlideImageCtrl',
			controllerUrl: 'app/controllers/operation/SlideImageCtrl',
			title: '轮播图片管理'
		})).state('secQuestion', angularAMD.route({
			// 密保问题维护
			url: '/secQuestion',
			templateUrl: 'static/view/admin/sec_question.html',
			controller: 'SecQuestionCtrl',
			controllerUrl: 'app/controllers/SecQuestionCtrl',
			title: '密保问题维护'
    	})).state('logisticsCompany', angularAMD.route({
			// 首页展示（快递公司管理）
			url: '/logistics/company',
			templateUrl: 'static/view/admin/logistics/logistics_company.html',
			controller: 'LogisticsCompanyCtrl',
			controllerUrl: 'app/controllers/logistics/LogisticsCompanyCtrl',
			title: '快递公司管理'
		})).state('payavailable', angularAMD.route({
			//买家付款有效时间
			url: '/pay/available',
			templateUrl: 'static/view/admin/checkMoney/payAvailable.html',
			controller: 'payAvailableCtrl',
			controllerUrl: 'app/controllers/checkMoney/payAvailable',
			title: '买家付款有效时间'
		})).state('exchangerate', angularAMD.route({
			//汇率
			url: '/pay/exchangerate',
			templateUrl: 'static/view/admin/checkMoney/exchangerate.html',
			controller: 'exchangeRateCtrl',
			controllerUrl: 'app/controllers/checkMoney/exchangeRate',
			title: '汇率'
		})).state('delaytime', angularAMD.route({
			//汇率
			url: '/logistics/delaytime',
			templateUrl: 'static/view/admin/logistics/delayTime.html',
			controller: 'DelayTimeCtrl',
			controllerUrl: 'app/controllers/logistics/DelayTime',
			title: '汇率'
		})).state('exceptionApply', angularAMD.route({
			//异常申请
			url : '/trade/purchase/exceptionApply/:purchaseid',
			templateUrl: 'static/view/admin/trade/trade_exceptionProcessing.html',
			controller: 'exceptionApplyCtrl',
			controllerUrl: 'app/controllers/trade/exceptionApply',
			title: '异常申请'
		})).state('openBill', angularAMD.route({
			url : 'trade/open/bill/:id',
			templateUrl : 'static/view/admin/openBill.html',
			controller: 'openBillCtrl',
			controllerUrl: 'app/controllers/openBillCtrl',
			title: '开发票'
		})).state('messageBoard', angularAMD.route({
			// 留言板
			url : '/operation/messageBoard',
			templateUrl: 'static/view/admin/operation/messageBoard.html',
			controller: 'MessageBoardCtrl',
			controllerUrl: 'app/controllers/operation/MessageBoardCtrl',
			title: '留言板'
		})).state('messageBoardDetail', angularAMD.route({
			// 留言板详情
			url : '/operation/messageBoard/:id',
			templateUrl: 'static/view/admin/operation/messageBoard_dt.html',
			controller: 'MessageBoardDetailCtrl',
			controllerUrl: 'app/controllers/operation/MessageBoardDetailCtrl',
			title: '留言板'
		})).state('helpMaintenance', angularAMD.route({
			// 帮助中心导航维护
			url : '/help/maintenance',
			templateUrl: 'static/view/admin/help/maintenance.html',
			controller: 'HelpMaintenanceCtrl',
			controllerUrl: 'app/controllers/help/HelpMaintenanceCtrl',
			title: '帮助中心导航维护'
		})).state('helpPublish', angularAMD.route({
			// 帮助中心发布
			url : '/help/publish',
			templateUrl: 'static/view/admin/help/publish.html',
			controller: 'HelpPublishCtrl',
			controllerUrl: 'app/controllers/help/HelpPublishCtrl',
			title: '帮助中心发布'
		})).state('helpEdit', angularAMD.route({
			// 帮助中心文章编辑
			url : '/help/edit',
			templateUrl: 'static/view/admin/help/edit.html',
			controller: 'HelpEditCtrl',
			controllerUrl: 'app/controllers/help/HelpEditCtrl',
			title: '帮助中心文章编辑'
		})).state('helpDetail', angularAMD.route({
			// 帮助中心文章详情
			url : '/help/issue/:id',
			templateUrl: 'static/view/admin/help/detail.html',
			controller: 'HelpDetailCtrl',
			controllerUrl: 'app/controllers/help/HelpDetailCtrl',
			title: '帮助中心文章详情'
		})).state('notifyShipTime', angularAMD.route({
			// 买家提醒发货时间条件
			url : '/buyer/notifyShip',
			templateUrl: 'static/view/admin/notifyShipTime.html',
			controller: 'HotifyShipTimeCtrl',
			controllerUrl: 'app/controllers/HotifyShipTime',
			title: '买家提醒发货时间条件'
		})).state('automaticReceiving', angularAMD.route({
            // 买家提醒发货时间条件
            url : '/buyer/automaticReceiving',
            templateUrl: 'static/view/admin/automaticReceiving.html',
            controller: 'AutomaticReceivingCtrl',
            controllerUrl: 'app/controllers/AutomaticReceiving',
            title: '买家提醒发货时间条件'
        })).state('downAllGoodsByEnterprise', angularAMD.route({
            //下架该公司所有的商品
            url : '/product/downAllGoodsByEnterprise',
            templateUrl: 'static/view/admin/product/downGoodsByEnterprise.html',
            controller: 'downGoodsByEnterpriseCtrl',
            controllerUrl: 'app/controllers/product/downGoodsByEnterprise',
            title: '下架公司产品'
        })).state('adsBrand', angularAMD.route({
            //品牌推广
            url : '/ads/brand',
            templateUrl: 'static/view/admin/ads/ads_brand.html',
            controller: 'adsBrandCtrl',
            controllerUrl: 'app/controllers/ads/ads_brand',
            title: '品牌推广'
        })).state('adsComponent', angularAMD.route({
            //品牌推广
            url : '/ads/component',
            templateUrl: 'static/view/admin/ads/ads_component.html',
            controller: 'adsComponentCtrl',
            controllerUrl: 'app/controllers/ads/ads_component',
            title: '器件推广'
        })).state('searchSee', angularAMD.route({
            //搜索预览
            url : '/search/see',
            templateUrl: 'static/view/admin/search/search_See.html',
            controller: 'SearchSeeBrandCtrl',
            controllerUrl: 'app/controllers/search/search_See',
            title: '搜索预览'
        })).state('internalMessage', angularAMD.route({
			// 消息列表
			url: '/internalMessages',
			templateUrl: 'static/view/admin/common/message/internalMessageList.html',
			controller: 'internalMessageListCtrl',
			controllerUrl: 'app/controllers/common/message/internalMessageListCtrl',
			title: '消息列表'
		})).state('loanApplyList', angularAMD.route({
            // 消息列表
            url: '/fa/loanApply',
            templateUrl: 'static/view/admin/fa/loanApplyList.html',
            controller: 'LoanApplyListCtrl',
            controllerUrl: 'app/controllers/fa/LoanApplyListCtrl',
            title: '贷款申请列表'
        }));
		
		$httpProvider.interceptors.push(['Loading', '$q', function(Loading, $q) {
			return {
				request: function(cfg){
					Loading.show();
					return cfg;
				},
				requestError: function(rejection) {
					Loading.hide();
					return $q.reject(rejection);
				},
				response: function(res) {
					Loading.hide();
					return res;
				},
				responseError: function(rejection) {
					Loading.hide();
					return $q.reject(rejection);
				}
			}
		}]);
	}]);

	 app.run(['$rootScope', 'BaseService', function($rootScope, BaseService) {
		 $rootScope.rootPath = BaseService.getRootPath();
		 $rootScope.page = 'vendor';// 导航栏状态，'个人中心'状态激活
	 }]);
	
	// 状态码  -> 描述
	app.filter('status', function(){
		var statusConfig = {
				'100': '录入中',
				'101': '已提交',
				'102': '已审核',
				'103': '未通过',
				'104': '已通过',
				'313': '已激活', 
				'316': '已过账',
				'310': '未启用',
				'311': '待审核',
				'312': '未激活',
				'350': '未开通',
				'351': '已开通',
				'317': '已创建'
			};
		return function(data) {
			return statusConfig[data];
		}
	});

	 /**
	  * 店铺类型过滤器
	  */
	app.filter('storeType', function () {
		return function (data) {
			if (data == 'AGENCY') return '代理商';
			if (data == 'DISTRIBUTION') return '经销商';
			if (data == 'ORIGINAL_FACTORY') return '原厂';
			if (data == 'CONSIGNMENT') return '寄售';
			return '暂无类型信息'
		};
	});

	 /**
	  * 店铺状态过滤器
	  *
	  * TODO huxz 店铺状态
	  */
	app.filter('storeStatus', function () {
		return function (data) {
			if (data === 'OPENED') return '已开店';
			return '已开店';
		};
	});

	 /**
	  * 店铺编号处理过滤器
	  */
	app.filter('storeId', function () {
		return function (data) {
			if (data) {
				var len = data.toString().length;
				while(len < 8) {
					data = "0" + data;
					len++;
				}
				return data;
			}
			return '暂无信息'
		};
	});

	 /**
	  * 列表编号处理过滤器
	  */
	 app.filter('indexId', function () {
		 return function (data) {
			 if (data) {
				 var len = data.toString().length;
				 while(len < 3) {
					 data = "0" + data;
					 len++;
				 }
				 return data;
			 }
			 return '暂无信息'
		 };
	 });
	
	app.controller('AuthenticationCtrl', ['$scope', '$window', 'AuthenticationService', function($scope, $window, AuthenticationService) {
	    $scope.logout = function() {
			AuthenticationService.logout().success(function() {
				SessionService.removeCookie($rootScope.userInfo.userUU);
			});
	    };
	    //$scope.isAuthed = AuthenticationService.isLoggedIn();
	    $scope.userInfo = {};
	    AuthenticationService.getAuthentication().success(function(data){
	    	$scope.userInfo = data;
	    	if(data == null || !data.uu)
	    		$scope.isAuthed = false;
	    });
	}]);

     //币别的过滤器
     app.filter('currencySysmbol', function() {
         return function(moneyParam, currency, add) {
             if(typeof(moneyParam) == 'undefined') {
                 moneyParam = 0;
             }
             if(currency == 'RMB') {
                 return "￥" + moneyParam + (typeof(add) == "undefined" ? '' : add);
             }else if(currency == "USD"){
                 return "＄" + moneyParam;
             }else {
                 return moneyParam;
             }
         }
     });

     // 币别filter
     app.filter('currencyStr', function () {
         return function (str) {
             return typeof str == 'string' && str != 'RMB' && str != 'USD' ? str.startsWith('RMB') ? '¥' + str.substring(3, str.length) : '$' + str.substring(3, str.length) : '-';
         }
     });

	return app;
});