
define([ 'angularAMD', 'ui.router', 'ui-bootstrap', 'ngLocal', 'ngTable', 'common/services', 'common/directives','common/query/kind', 'common/query/brand', 'common/query/component', 'common/query/order', 'common/query/cart', 'common/query/goods', 'common/query/return' ,'angular-toaster', 'common/query/urlencryption', 'ui-jquery', 'common/query/bankTransfer', 'common/query/bankInfo', 'common/query/change', 'common/query/rate', 'common/query/logistics', 'common/query/address' ,'angular-toaster','common/query/collection', 'common/query/proofing', 'common/query/bill', 'common/query/user','file-upload', 'file-upload-shim', 'common/query/bankInfo' , 'common/query/responseLogistics', 'common/query/payment', 'common/query/afterSale', 'common/query/messageBoard', 'common/query/importDeclaration', 'common/query/enterprise', 'common/query/invoice', 'common/query/refund', 'common/query/recommendation', 'common/query/logisticsPort', 'common/query/storeInfo', 'common/query/tradeMessageNotice', 'common/query/tradeBasicProperties', 'common/query/browsingHistory', 'common/query/internalMessage', 'common/module/chat_web_module', 'angular-filter', 'common/query/vendor','common/query/seekPurchase', 'common/query/search'], function(angularAMD) {
	'use strict';
	var app = angular.module('myApp', [ 'ui.router', 'ui.bootstrap', 'ng.local', 'ngTable', 'common.services', 'common.directives', 'tool.directives', 'common.query.kind', 'brandServices', 'componentServices', 'orderServices', 'cartServices', 'goodsServices', 'returnServices' , 'toaster', 'urlencryptionServices', 'ui.jquery', 'bankTransfer', 'bankInfo', 'changeServices','rateServices', 'logisticsServices', 'addressServices', 'toaster','collection','proofingServices', 'billServices', 'common.query.user', 'angularFileUpload', 'bankInfo', 'responseLogisticsService', 'PaymentService', 'afterSaleService', 'messageBoardServices', 'table.directives', 'importDeclaration', 'common.query.enterprise', 'invoiceServices', 'refundModule', 'recommendation','logisticsPortService', 'storeInfoServices', 'tradeMessageNoticeModule', 'tradeBasicPropertiesServices', 'BrowsingHistory', 'internalMessageServices', 'WebChatModule', 'angular.filter', 'vendorServices','seekPurchaseServices', 'searchService']);
	app.init = function() {
		angularAMD.bootstrap(app);
	};

	// yangckTODO 提交时注释掉这段代码
	// 清除模板缓存，仅用于测试
	// app.run(function($rootScope, $templateCache) {
	// 	$rootScope.$on('$viewContentLoaded', function() {
	// 		$templateCache.removeAll();
	// 	});
	// });


	if (!Array.prototype.last){
		Array.prototype.last = function(){
			return this.length > 0 ? this[this.length - 1] : null;
		};
	}
    if (!Array.prototype.first){
        Array.prototype.first = function(){
            return this.length > 0 ? this[0] : null;
        };
    }


	// ui-router 路由配置
	app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
		$urlRouterProvider.otherwise("/home");
		$stateProvider.state('home', angularAMD.route({
			url: '/home',
			templateUrl: 'static/view/usercenter/forstore/home_center.html',
			controller : 'homeCtrl',
			controllerUrl : 'app/controllers/forstore/buyer_home_ctrl'
		})).state('buyer_order', angularAMD.route({
			url: '/order',
			templateUrl: 'static/view/usercenter/forstore/buyer_order.html',
			controller: 'orderCtrl',
			controllerUrl: 'app/controllers/forstore/buyer_order_ctrl'
		})).state('messagePersonal', angularAMD.route({
			url: '/messagePersonal',
			templateUrl: 'static/view/usercenter/forstore/messagePersonal.html',
			controller: 'MessagePersonalCtrl',
			controllerUrl: 'app/controllers/forstore/messagePersonalCtrl'
		})).state('messagePublic', angularAMD.route({
			url: '/messagePublic',
			templateUrl: 'static/view/usercenter/forstore/messagePublic.html',
			controller: 'MessagePublicCtrl',
			controllerUrl: 'app/controllers/forstore/messagePublicCtrl'
		})).state('browsing-history', angularAMD.route({
			url: '/browsing-history',
			templateUrl: 'static/view/usercenter/forstore/browsing-history.html',
			controller: 'BrowsingHistoryCtrl',
			controllerUrl: 'app/controllers/forstore/browsingHistoryCtrl'
		})).state('my_wallet', angularAMD.route({
			url: '/wallet',
			templateUrl: 'static/view/usercenter/forstore/wallet.html',
			controller: 'walletCtrl',
			controllerUrl: 'app/controllers/forstore/buyer_wallet_ctrl'
		})).state('buyer_invoice', angularAMD.route({
			url: '/invoice',
			templateUrl: 'static/view/usercenter/forstore/buyer_invoice.html',
			controller: 'invoiceCtrl',
			controllerUrl: 'app/controllers/forstore/buyer_invoice_ctrl'
		})).state('buyer_no_invoice', angularAMD.route({
			url: '/noInvoice',
			title: '未开票',
			templateUrl: 'static/view/usercenter/forstore/buyer_no_invoice.html',
			controller: 'NoInvoiceCtrl',
			controllerUrl: 'app/controllers/forstore/buyer_no_invoice_ctrl'
		})).state('buyer_invoice-record', angularAMD.route({
			url: '/invoiceRecord',
			title: '开票记录',
			templateUrl: 'static/view/usercenter/forstore/buyer_invoice_record.html',
			controller: 'buyerInvoiceRecordCtrl',
			controllerUrl: 'app/controllers/forstore/buyer_invoice_record_ctrl'
		})).state('pay_center', angularAMD.route({
			url: '/payCenter',
			templateUrl: 'static/view/usercenter/forstore/pay_center.html',
			controller: 'payCenterCtrl',
			controllerUrl: 'app/controllers/forstore/pay_center_ctrl'
		}))
		/*	.state('my_seek_purchase', angularAMD.route({
			url: '/seekPurchase',
			templateUrl: 'static/view/usercenter/forstore/seek_purchase.html',
			controller: 'seekPurchaseCtrl',
			controllerUrl: 'app/controllers/forstore/seek_purchase_ctrl'
		}))*/
			.state('buyer_logistics', angularAMD.route({
			url: '/buyerLogistics/:orderid',
			templateUrl: 'static/view/usercenter/forstore/buyer_logistics.html',
			controller: 'buyerLogisticsCtrl',
			controllerUrl: 'app/controllers/forstore/buyer_logistics_ctrl'
		})).state('buyerQueryLogistics', angularAMD.route({
            url: '/buyerQueryLogistics/:orderid',
            templateUrl: 'static/view/usercenter/forstore/query_logistics.html',
            controller: 'buyerQueryLogisticsCtrl',
            controllerUrl: 'app/controllers/forstore/query_logistics_ctrl'
        })).state('after_sale', angularAMD.route({
			url: '/afterSale',
			title: '申请售后',
			templateUrl: 'static/view/usercenter/forstore/after_sale.html',
			controller: 'afterSaleCtrl',
			controllerUrl: 'app/controllers/forstore/after_sale_ctrl'
		})).state('store_focus', angularAMD.route({
			url: '/storeFocus',
			title : '店铺关注',
			templateUrl : 'static/view/usercenter/forstore/store_focus.html',
			controller : 'storeFocusCtrl',
			controllerUrl : 'app/controllers/forstore/store_focus_ctrl'
		})).state('browsing_history', angularAMD.route({
            url: '/browsingHistory',
            title : '浏览历史',
            templateUrl : 'static/view/usercenter/forstore/browsing_history.html',
            controller : 'browsingHistoryCtrl',
            controllerUrl : 'app/controllers/forstore/browsing_history'
        })).state('account_manager', angularAMD.route({
			url: '/accountManager/:op',
			title: '账户管理',
			templateUrl: 'static/view/usercenter/forstore/account_manager.html',
			controller: 'accountManagerCtrl',
			controllerUrl: 'app/controllers/forstore/account_manager_ctrl'
		})).state('order_detail', angularAMD.route({
			url: '/order/detail/:orderid',
			title: '订单详情',
			templateUrl: 'static/view/usercenter/forstore/order_detail.html',
			controller: 'orderDetailCtrl',
			controllerUrl: 'app/controllers/forstore/order_detail_ctrl'
		})).state('buyer_cart', angularAMD.route({
			url: '/cart',
			title: '购物车',
			templateUrl: 'static/view/usercenter/forstore/buyer_cart.html',
			controller: 'buyerCartCtrl',
			controllerUrl: 'app/controllers/forstore/buyer_cart_ctrl'
		})).state('order_pay', angularAMD.route({
			url: '/order/pay/:orderid',
			title: '订单付款界面',
			templateUrl: 'static/view/usercenter/forstore/order_pay.html',
			controller: 'orderPayCtrl',
			controllerUrl: 'app/controllers/forstore/order_pay_ctrl'
		})).state('order_transfer', angularAMD.route({
			//bank transfer
			url : '/transfer/:orderid',
			templateUrl : 'static/view/usercenter/forstore/buyer_transfer.html',
			controllerUrl : 'app/controllers/forstore/buyer_transfer_ctrl',
			controller : 'buyerTransferCtrl'
		}))//之前的是为了店铺新增的，加于03月21日
			.state('index', angularAMD.route({
			// 个人中心首页
			url: '/home',
			templateUrl : 'static/view/usercenter/home.html',
			controller : 'UserCenterHomeCtrl',
			controllerUrl : 'app/controllers/UserCenterHomeCtrl'
		}))
		// 	.state('myOrder_todo', angularAMD.route({
		// 	// 我的未完成订单
		// 	url: '/home/myOrder_todo?state',
		// 	templateUrl : 'static/view/usercenter/myOrder_todo.html',
		// 	controller : 'MyOrderToDoCtrl',
		// 	controllerUrl : 'app/controllers/MyOrderToDoCtrl'
		// }))
			.state('myOrder_done', angularAMD.route({
			// 我的已完成订单
			url: '/home/myOrder_done',
			templateUrl : 'static/view/usercenter/myOrder_done.html',
			controller : 'MyOrderDoneCtrl',
			controllerUrl : 'app/controllers/MyOrderDoneCtrl'
		})).state('myOrderDetail', angularAMD.route({
			// 我的已完成订单详情
			url: '/home/myOrder/:orderid',
			templateUrl : 'static/view/usercenter/myOrderDetail.html',
			controller : 'MyOrderDetailCtrl',
			controllerUrl : 'app/controllers/MyOrderDetailCtrl'
		})).state('buyerOrderDetail', angularAMD.route({
			// 订单详情
			url: '/home/order/:orderid',
			templateUrl : 'static/view/usercenter/order_detail.html',
			controller : 'OrderDetailCtrl',
			controllerUrl : 'app/controllers/OrderDetailCtrl'
		})).state('myAfter_sales',angularAMD.route({
			//退、换货服务
			url: '/home/myAfter_sales/:orderid',
			templateUrl : 'static/view/usercenter/myAfter_sales.html',
			controller : 'AfterSaleCtrl',
			controllerUrl : 'app/controllers/AfterSaleCtrl'
		})).state('myReturn_done',angularAMD.route({
			//我的退货单
			url: '/home/myReturn_done',
			templateUrl : 'static/view/usercenter/myReturn_done.html',
			controller : 'MyReturnDoneCtrl',
			controllerUrl : 'app/controllers/MyReturnDoneCtrl'
		})).state('myReturn_done_detail', angularAMD.route({
			//退货单详情
			url: '/home/myReturn_done/:returnid',
			templateUrl : 'static/view/usercenter/myReturn_done_detail.html',
			controller : 'MyReturnDoneDetailCtrl',
			controllerUrl : 'app/controllers/MyReturnDoneDetailCtrl'
		})).state('myChange_done',angularAMD.route({
			//我的换货单
			url: '/home/myChange_done',
			templateUrl : 'static/view/usercenter/myChange_done.html',
			controller : 'MyChangeDoneCtrl',
			controllerUrl : 'app/controllers/MyChangeDoneCtrl'
		})).state('myChange_done_detail', angularAMD.route({
			//换货单详情
			url: '/home/myChange_done/:changeid',
			templateUrl : 'static/view/usercenter/myChange_done_detail.html',
			controller : 'MyChangeDoneDetailCtrl',
			controllerUrl : 'app/controllers/MyChangeDoneDetailCtrl'
		})).state('myRefund_done',angularAMD.route({
			title: '我的退款单',
			url: '/home/myRefund_done',
			templateUrl : 'static/view/usercenter/myRefund_done.html',
			controller : 'MyRefundDoneCtrl',
			controllerUrl : 'app/controllers/MyRefundDoneCtrl'
		})).state('myRefund_done_detail', angularAMD.route({
			title: '退款单详情',
			url: '/home/myRefund_done/:refundId',
			templateUrl : 'static/view/usercenter/myRefund_done_detail.html',
			controller : 'MyRefundDoneDetailCtrl',
			controllerUrl : 'app/controllers/MyRefundDoneDetailCtrl'
		})).state('myTest_done',angularAMD.route({
			//Test
			url: '/home/myTest_done',
			templateUrl : 'static/view/usercenter/Test.html',
			controller : 'MyTestDoneCtrl',
			controllerUrl : 'app/controllers/MyTestDoneCtrl'
		})).state('ship', angularAMD.route({
			title: '换货出货',
			url: '/ship/:id',
			templateUrl: 'static/view/usercenter/shipped.html',
			controllerUrl: 'app/controllers/ShippedCtrl',
			controller: 'ShippedCtrl'
		})).state('shipFreturn', angularAMD.route({
			title: '退货出货',
			url: '/shipFreturn/:id',
			templateUrl: 'static/view/usercenter/shippedFreturn.html',
			controllerUrl: 'app/controllers/ShippedForReturnCtrl',
			controller: 'ShippedForReturnCtrl'
		}))

			.state('histTransfer', angularAMD.route({
			url : '/home/historyTransfer',
			templateUrl :  'static/view/usercenter/histTransfer.html',
			controllerUrl : 'app/controllers/HistoryTransferCtrl',
			controller : 'HistoryTransferCtrl'
		})).state('brandCol', angularAMD.route({
			// 品牌收藏
			url : '/home/brancol',
			templateUrl: 'static/view/usercenter/brandStore.html',
			controllerUrl: 'app/controllers/BrandStoreCtrl',
			controller: 'BrandStoreCtrl'
		})).state('componentCol',angularAMD.route({
			// 器件收藏
			url : '/home/componentcol',
			templateUrl : 'static/view/usercenter/componentStore.html',
			controllerUrl : 'app/controllers/ComponentStoreCtrl',
			controller : 'ComponentStoreCtrl'
		})).state('shopping_cart', angularAMD.route({
			// 我的购物车
			//暂时弃用，现在直接通过连接的形式跳转到购物车界面
			url: '/product#/cart',
			templateUrl : 'static/view/usercenter/shopping_cart.html',
			controller : 'CartCtrl',
			controllerUrl : 'app/controllers/CartCtrl',
			title: '我的购物车'
		})).state('ship_address', angularAMD.route({
			//收货地址管理
			url : '/home/shipAddress',
			templateUrl : 'static/view/usercenter/addressAdmin.html',
			controller : 'adressAdminCtrl',
			controllerUrl : 'app/controllers/addressAdminCtrl'
		})).state('credit_card', angularAMD.route({
			url : '/home/creditCard',
			templateUrl : 'static/view/usercenter/creditCardAdmin.html',
			controller : 'creditCardAdminCtrl',
			controllerUrl : 'app/controllers/creditCardAdminCtrl'
		}))
		// 	.state('myProofing', angularAMD.route({
		// 	// 我的送样申请单
		// 	url: '/home/myProofing',
		// 	templateUrl : 'static/view/usercenter/myProofing.html',
		// 	controller : 'MyProofingCtrl',
		// 	controllerUrl : 'app/controllers/MyProofingCtrl'
		// }))
		// 	.state('unProofing', angularAMD.route({
		// 	// 我的送样申请单
		// 	url: '/home/unProofing',
		// 	templateUrl : 'static/view/usercenter/unProofing.html',
		// 	controller : 'UnProofingCtrl',
		// 	controllerUrl : 'app/controllers/UnProofingCtrl'
		// }))
			.state('bill_admin', angularAMD.route({
			//发票管理
			url : '/home/billAdmin',
			templateUrl : 'static/view/usercenter/billAdmin.html',
			controller : 'BillAdminCtrl',
			controllerUrl : 'app/controllers/BillAdminCtrl'
		})).state('bill_input', angularAMD.route({
			url : '/home/billInput/revise/:id',
			templateUrl : 'static/view/usercenter/billInput.html',
			controller : 'BillInputCtrl',
			controllerUrl : 'app/controllers/BillInputCtrl',
			resolve: {
				isNormal: function() {return 1207;}
			}
		})).state('bill_input_normal', angularAMD.route({
			url : '/home/billInput/normal',
			templateUrl : 'static/view/usercenter/billInput.html',
			controller : 'BillInputCtrl',
			controllerUrl : 'app/controllers/BillInputCtrl',
			resolve: {
				isNormal: function() {return 1206;}
			}
		})).state('bill_input_special', angularAMD.route({
			url : '/home/billInput/special',
			templateUrl : 'static/view/usercenter/billInput.html',
			controller : 'BillInputCtrl',
			controllerUrl : 'app/controllers/BillInputCtrl',
			resolve: {
				isNormal: function() {return 1205;}
			}
		})).state('bill_notice', angularAMD.route({
			url : '/home/billNotice',
			templateUrl : 'static/view/usercenter/billNotice.html'
		}))
		// 	.state('myOrder_bill', angularAMD.route({
		// 	url : 'myOrderBill',
		// 	templateUrl : 'static/view/usercenter/myOrderBill.html',
		// 	controller : 'myOrderBill',
		// 	controllerUrl : 'app/controllers/myOrderBill'
		// }))
		// 	.state('exception_processing', angularAMD.route({
		// 	// 异常申请
		// 	url : '/home/ex/exceptionProcessing/:orderid',
		// 	templateUrl : 'static/view/usercenter/exceptionProcessing.html',
		// 	controller : 'exceptionProcessingCtrl',
		// 	controllerUrl : 'app/controllers/exceptionProcessingCtrl'
		// }))
		// 	.state('exception_processing_detail', angularAMD.route({
		// 	// 异常申请详情
		// 	url : '/home/ex/exceptionProcessingDetail/:orderid',
		// 	templateUrl : 'static/view/usercenter/exceptionProcessingDetail.html',
		// 	controller : 'exceptionProcessingDetailCtrl',
		// 	controllerUrl : 'app/controllers/exceptionProcessingDetailCtrl'
		// }))
		// 	.state('exceptionNotify', angularAMD.route({
		// 	// 异常通知详情
		// 	url : '/home/ex/exceptionNotify/:applyId',
		// 	templateUrl : 'static/view/usercenter/exceptionNotify.html',
		// 	controller : 'exceptionNotifyCtrl',
		// 	controllerUrl : 'app/controllers/exceptionNotifyCtrl'
		// }))
		// 	.state('refund', angularAMD.route({
		// 	// 申请客服页面
		// 	url : '/home/myOrder_todo/refund',
		// 	templateUrl : 'static/view/usercenter/myOrderRefund.html'
		// }))
		// 	.state('returnGoods', angularAMD.route({
		// 	// 申请客服页面
		// 	url : '/home/myOrder_todo/returnGoods',
		// 	templateUrl : 'static/view/usercenter/myOrderReturnGoods.html'
		// }))
		// 	.state('import_declaration', angularAMD.route({
		// 	// 进口报关列表
		// 	url : '/home/import_declaration',
		// 	templateUrl : 'static/view/usercenter/import_declaration.html',
		// 	controller : 'importDeclarationCtrl',
		// 	controllerUrl : 'app/controllers/importDeclarationCtrl'
		// }))
		// 	.state('new_import_declaration', angularAMD.route({
		// 	//新增进口报关
		// 	url : '/home/new_import_declaration',
		// 	templateUrl : 'static/view/usercenter/new_import_declaration.html',
		// 	controller : 'newImportDeclarationCtrl',
		// 	controllerUrl : 'app/controllers/importDeclarationCtrl'
		// }))
		// 	.state('edtitAccount', angularAMD.route({
		// 	//新增进口报关
		// 	url : '/home/editAccount',
		// 	templateUrl : 'static/view/usercenter/editAccount.html',
		// 	controller : 'EditAccountCtrl',
		// 	controllerUrl : 'app/controllers/EditAccountCtrl'
		// }))
			.state('editShippingAddress', angularAMD.route({
			// 买家收货地址编辑页面
			url : '/shippingAddress/edit',
			templateUrl : 'static/view/usercenter/forstore/shipping_address_edit.html',
			controller : 'ShippingAddressEditCtrl',
			controllerUrl : 'app/controllers/forstore/shipping_address_edit_ctrl'
		})).state('firstRate', angularAMD.route({
			// 初次评价
			url : '/rate/firstRate/:orderid',
			templateUrl : 'static/view/usercenter/forstore/first_rate.html',
			controller : 'firstRateCtrl',
			controllerUrl : 'app/controllers/forstore/first_rate_ctrl'
		})).state('addRate', angularAMD.route({
			// 追加评价
			url : '/rate/addRate/:orderid',
			templateUrl : 'static/view/usercenter/forstore/add_rate.html',
			controller : 'addRateCtrl',
			controllerUrl : 'app/controllers/forstore/add_rate_ctrl'
		})).state('showRate', angularAMD.route({
			// 查看评价
			url : '/rate/showRate/:orderid',
			templateUrl : 'static/view/usercenter/forstore/show_rate.html',
			controller : 'showRateCtrl',
			controllerUrl : 'app/controllers/forstore/show_rate_ctrl'
		})).state('downPayment', angularAMD.route({
			// 线下付款
			url : '/downPayment/:orderid',
			templateUrl : 'static/view/usercenter/forstore/buyer_down_payment.html',
			controller : 'downPaymentCtrl',
			controllerUrl : 'app/controllers/forstore/buyer_down_payment_ctrl'
		})).state('buyerSeekPurchase', angularAMD.route({
			url: '/seekPurchase?type',
			templateUrl: 'static/view/usercenter/forstore/seekPurchase.html',
			controller: 'seekPurchaseCtrl',
			controllerUrl: 'app/controllers/forstore/seek_purchase_ctrl'
		})).state('buyerBomDetail', angularAMD.route({
			url: '/bomDetail/:id',
			templateUrl: 'static/view/usercenter/forstore/bomDetail.html',
			controller: 'bomDetailCtrl',
			controllerUrl: 'app/controllers/forstore/bom_detail_ctrl'
		}));
	}]);

	// 状态码  -> 描述
	app.filter('status', function(){
		var statusConfig = {
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

	// 状态码  -> 快递
	app.filter('logisticsCompany', function(){
		var logisticsCompanyConfig = {
			'aae': 'AAE快递',
			'aramex': 'Aramex快递',
			'auspost': '澳大利亚邮政',
			'annengwuliu': '安能物流快递',
			'bht': 'BHT快递',
			'baifudongfang': '百福东方物流',
			'bangsongwuliu': '邦送物流',
			'huitongkuaidi': '百世汇通快递',
			'idada': '百成大达物流',
			'coe': 'COE（东方快递）',
			'city100': '城市100',
			'chuanxiwuliu': '传喜物流',
			'depx': 'DPEX',
			'disifang': '递四方',
			'dsukuaidi': 'D速物流',
			'debangwuliu': '德邦物流',
			'datianwuliu': '大田物流',
			'dhl': 'DHL国际快递',
			'dhlen': 'DHL（国际件）',
			'dhlde': 'DHL（德国件）',
			'dhlpoland': 'DHL（波兰件）',
			'ems': 'EMS快递',
			'emsguoji': 'EMS国际',
			'fedex': 'FedEx（国际）',
			'fedexus': 'FedEx（美国）',
			'rufengda': '凡客如风大',
			'feikangda': '飞康达物流',
			'feibaokuaidi': '飞豹快递',
			'fardarww': 'Fardar Worldwide',
			'fandaguoji': '颿达国际',
			'fedexuk': 'FedEx（英国件）',
			'gangzhongnengda': '港中能达物流',
			'gongsuda': '共速达',
			'guotongkuaidi': '国通快递',
			'gls': 'GLS',
			'tiandihuayu': '华宇物流',
			'hengluwuliu': '恒路物流',
			'huaxialongwuliu': '华夏龙物流',
			'hebeijianhua': '河北建华',
			'jiajiwuliu': '佳吉物流',
			'jiayiwuliu': '佳怡物流',
			'jiayunmeiwuliu': '加运美快递',
			'jixianda': '急先达物流',
			'jinguangsudikuaijian': '京广速递快件',
			'jinyuekuaidi': '晋越快递',
			'jialidatong': '嘉里大通',
			'jietekuaidi': '捷特快递',
			'jd': '京东快递',
			'jindawuliu': '金大物流',
			'kuaijiesudi': '快捷快递',
			'kangliwuliu': '康力物流',
			'kuayue': '跨越物流',
			'lianhaowuliu': '联昊通物流',
			'longbangwuliu': '龙邦速递',
			'lianbangkuaidi': '联邦快递',
			'lejiedi': '乐捷递',
			'lijisong': '立即送',
			'minghangkuaidi': '民航快递',
			'meiguokuaidi': '美国快递',
			'menduimen': '门对门',
			'mingliangwuliu': '明亮物流',
			'ganzhongnengda': '能达速递',
			'ocs': 'OCS',
			'ontrac': 'OnTrac',
			'pingandatengfei': '平安达腾飞',
			'peixingwuliu': '陪行物流',
			'quanfengkuaidi': '全峰快递',
			'quanyikuaidi': '全一快递',
			'quanritongkuaidi': '全日通快递',
			'quanchenkuaidi': '全晨快递',
			'sevendays': '7天连锁物流',
			'shentong': '申通快递',
			'shunfeng': '顺丰速运',
			'suer': '速尔快递',
			'haihongwangsong': '山东海红',
			'shenghuiwuliu': '盛辉物流',
			'shengfengwuliu': '盛丰物流',
			'shangda': '上大物流',
			'santaisudi': '三态速递',
			'saiaodi': '赛澳递',
			'shenganwuliu': '圣安物流',
			'sxhongmajia': '山西红马甲',
			'suijiawuliu': '穗佳物流',
			'syjiahuier': '沈阳佳惠尔',
			'tnt': 'TNT快递',
			'tiantian': '天天快递',
			'tonghetianxia': '通和天下',
			'tianzong': '天纵物流',
			'tntuk': 'TNT（英国件）',
			'ups': 'UPS国际快递',
			'wanxiangwuliu': '万象物流',
			'weitepai': '微特派',
			'wanjiawuliu': '万家物流',
			'xinbangwuliu': '新邦物流',
			'xinfengwuliu': '信丰物流',
			'neweggozzo': '新蛋物流',
			'hkpost': '香港邮政',
			'xianglongyuntong': '祥龙运通物流',
			'xianchengliansudi': '西安城联速递',
			'yuantong': '圆通速递',
			'yunda': '韵达快运',
			'yuntongkuaidi': '运通快递',
			'youzhengguonei': '邮政国内',
			'youzhengguoji': '邮政国际',
			'yuanchengwuliu': '远成物流',
			'yafengsudi': '亚风速递',
			'youshuwuliu': '优速快递',
			'yuananda': '源安达快递',
			'yuanfeihangwuliu': '原飞航物流',
			'yuefengwuliu': '越丰物流',
			'zhongtong': '中通快递',
			'zhaijisong': '宅急送',
			'zhongtiewuliu': '中铁快运',
			'ztky': '中铁物流',
			'zhongyouwuliu': '中邮物流',
			'zhongtianwanyun': '中天万运',
			'zhengzhoujianhua': '郑州建华',
			'zhimakaimen': '芝麻开门'
		};
		return function(data) {
			return logisticsCompanyConfig[data];
		}
	});

	app.run(['$rootScope', 'BaseService', function($rootScope, BaseService) {
		$rootScope.rootPath = BaseService.getRootPath();
		$rootScope.page = 'user';// 导航栏状态，'个人中心'状态激活
	}]);

	// 个人中心左侧导航，这里只是读取rootScopt进行隐藏的控制
	app.controller('LeftMenuCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {

	}]);

	app.controller('UserCenterHeaderCtrl', ['$scope', /*'$rootScope', 'InternalMessage', '$q',*/ function ($scope/*, $rootScope, InternalMessage, $q*/) {
		$scope.homeUrl = window.location.pathname.replace('/user', '');
		// 获取未读消息数量
		//根据用户的信息
		/*InternalMessage.getUnReadCount({recRole: 'BUYER'}, function (data) {
			$scope.unReadMessage = data.count;
		}, function (responge) {

		})*/
	}]);

	app.controller('CollectCtrl', ['$scope', 'collectionService', 'toaster', '$rootScope', '$modal', function ($scope, collectionService, toaster, $rootScope, $modal) {
		$scope.collect = function (id) {
			var obj = {'componentid': id, 'kind': 2};
			collectionService.saveEntity({}, obj, function(data) {
				// 打开莫模态框
				$modal.open({
					 templateUrl : $rootScope.rootPath + '/static/view/usercenter/modal/collectModel.html',
					 controller : 'CollectModelCtrl',
					 size : 'sm',
					 resolve : {
						haveAdd : function(){
							if (data.data == "success"){
								return true;
							} else{
								return false;
							}
						}
					 }
				});
				$rootScope.componentCount++;
			}, function(error) {
				toaster.pop('error', '收藏失败', error);
			});
		}
			
	}]);
	
	app.controller('CollectModelCtrl', ['$scope', '$modalInstance', 'haveAdd', function($scope, $modalInstance, haveAdd){
		$scope.haveAdd = haveAdd;
		$scope.cancel = function() {
			$modalInstance.dismiss();
		};
	}])

	app.controller('BankFeedBackCtrl', ['$scope','$modalInstance', function($scope, $modalInstance) {
		$scope.confirm = function() {
			$modalInstance.close();
		};
		$scope.dismiss = function() {
			$modalInstance.dismiss();
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

	app.filter('emailSymbol', function() {
		return function(email) {
			if(typeof(email) == 'undefined') {
				email = '';
			} else {
				const index = email.indexOf('@');
				email = email[0] + '***' + email.substring(index, email.length);
			}
			return email;
		}
	});

	app.filter('telPhoneSymbol', function() {
		return function(telPhone) {
			if(typeof(telPhone) == 'undefined') {
				telPhone = '';
			} else {
				telPhone = telPhone.substring(0, 3) + '****' + telPhone.substring(telPhone.length - 4, telPhone.length);
			}
			return telPhone;
		}
	});

	app.filter('billTypeFilter', function() {
		return function(type) {
			var kindStr;
			switch(type) {
				case 1205 :
					kindStr = "增值税(专用)发票";break;
				case '1205' :
					kindStr = "增值税(专用)发票";break;
				case 1206 :
					kindStr = "增值税普通发票"; break;
				default:
					kindStr = "增值税普通发票"; break;
			}
			return kindStr;
		}
	});

	/**
	 * 采购单状态
	 */
	app.filter('orderStatus', function() {
		return function(status) {
			if (!status || status == '') {
				status = 501;
			}
			if (status == 501 || status == 503 || status == 504 || status == 524 || status == 525) {
				return '待付款';
			} else if (status == 505 || status == 406 || status == 407 || status == 403 || status == 408) {
				return '待发货';
			} else if (status == 404) {
				return '待收货';
			} else if (status == 405) {
				return '待收款';
			} else if (status == 520){
				return '交易完成';
			} else {
				return '已取消';
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