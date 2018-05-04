/**
 * 店铺SPA 模块
 *
 * history:
 * Created by huxz on 2017-3-22 16:56:45
 */
define([ 'angularAMD', 'bootstrap', 'ui.router', 'ui-bootstrap', 'ngLocal', 'ngTable', 'common/services', 'common/controllers', 'common/directives', 'angular-toaster', 'common/query/collection', 'common/query/storeInfo', 'common/query/commodity', 'common/query/storeCms', 'common/query/cart', 'common/query/messageBoard', 'common/query/order', 'common/query/urlencryption', 'common/query/collection', 'common/query/browsingHistory', 'common/module/store_recommend_product', 'common/module/chat_web_module' ], function(angularAMD) {
	'use strict';
	var app = angular.module('myApp', [ 'ui.router', 'ui.bootstrap', 'ng.local', 'ngTable', 'tool.directives', 'common.services', 'common.directives', 'toaster', 'collection', 'storeInfoServices', 'commodityServices', 'StoreCmsServices', 'cartServices', 'messageBoardServices', 'orderServices', 'urlencryptionServices', 'collection', 'BrowsingHistory', 'StoreCmsModule', 'WebChatModule']);
	app.init = function() {
		angularAMD.bootstrap(app);
	};

	/**
	 * 初始化，获取店铺信息并保存到RootScope中
	 */
	app.run(['$rootScope', '$location', 'BaseService', 'toaster', 'StoreInfo', function($rootScope, $location, BaseService, toaster, StoreInfo) {
		// 保存上下文路径
		$rootScope.rootPath = BaseService.getRootPath();

		var url = $location.absUrl();
		var index = url.indexOf('#');
		// 获取去除锚点的实际URL路径
		url = index > 0 ? url.substring(0, index) : url;
		// 获取店铺的UUID信息
		var paths = url.split('/');
		var uuid = paths[paths.length - 1];
		var param = { uuid : uuid };
		$rootScope.storeInfoPromise = StoreInfo.findByUuid(param, function (result) {
			if (result) {
				$rootScope.storeInfo = result;
			} else {
				toaster.pop('error', '店铺信息获取失败');
			}
			return $rootScope.storeInfo;
		}).$promise;
	}]);

	/**
	 * 配置路由信息
	 */
	app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise("/home");
		$stateProvider.state("home", angularAMD.route({
			// 店铺首页页面
			url : '/home',
			templateUrl : 'static/view/store/default/store-index.html',
			controller : 'StoreHomeCtrl',
			controllerUrl : 'app/controllers/default/StoreHomeCtrl'
		})).state("description", angularAMD.route({
			// 店铺首页页面
			url : '/description',
			templateUrl : 'static/view/store/default/store-info.html',
			controller : 'StoreDescriptionCtrl',
			controllerUrl : 'app/controllers/default/StoreDescriptionCtrl'
		})).state("batchInfo", angularAMD.route({
			// 店铺首页页面
			url : '/batchInfo/:batchCode',
			templateUrl : 'static/view/store/default/store-batch-info.html',
			controller : 'StoreBatchInfoCtrl',
			controllerUrl : 'app/controllers/default/StoreBatchInfoCtrl'
		}));
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

	return app;
});
