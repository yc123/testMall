/**
 * 供应商列表SPA 模块
 *
 * history:
 * Created by huxz on 2017-3-23 14:42:42
 */
define([ 'angularAMD', 'ui.router', 'ui-bootstrap', 'ngLocal', 'ngTable', 'common/services', 'common/directives', 'angular-toaster', 'common/query/cms', 'common/query/collection', 'common/query/kind', 'common/query/brand', 'common/query/messageBoard', 'common/query/cart', 'common/query/storeInfo', 'common/query/order', 'common/query/commonCount', 'big', 'common/module/chat_web_module' ], function(angularAMD) {
	'use strict';
	var app = angular.module('myApp', [ 'ui.router', 'ui.bootstrap', 'ng.local', 'ngTable', 'tool.directives', 'common.services', 'common.directives', 'toaster', 'cmsService', 'collection', 'common.query.kind', 'brandServices', 'messageBoardServices', 'cartServices', 'storeInfoServices', 'orderServices', 'commonCountServices', 'WebChatModule' ]);
	app.init = function() {
		angularAMD.bootstrap(app);
	};

	/**
	 * 初始化全局数据
	 */
	app.run(['$rootScope', '$location', 'BaseService', 'StoreInfo', function ($rootScope, $location, BaseService, StoreInfo) {
		// 保存上下文路径
		$rootScope.rootPath = BaseService.getRootPath();
		$rootScope.isProviderList = true;
		StoreInfo.getUmallStoreId({}, {}, function (result) {
			if (result.data) {
				$rootScope.umallStoreId = result.data;
			} else {
				delete $rootScope.umallStoreId;
			}
		}, function () {
			delete $rootScope.umallStoreId;
		});
	}]);

	/**
	 * 配置路由信息
	 */
	app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise("/home");
		$stateProvider.state("home", angularAMD.route({
			// 代理经销页面
			url : '/home',
			templateUrl : 'static/view/provider/provider_home.html',
			controller : 'ProviderHomeCtrl',
			controllerUrl : 'app/controllers/ProviderHomeCtrl'
		})).state("factories", angularAMD.route({
			// 原厂专区页面
			url : '/factories',
			templateUrl : 'static/view/provider/provider_factories.html',
			controller : 'ProviderFactoriesCtrl',
			controllerUrl : 'app/controllers/ProviderFactoriesCtrl'
		})).state("list", angularAMD.route({
			// 供应商列表页面
			url : '/list',
			templateUrl : 'static/view/provider/provider_list.html',
			controller : 'ProviderListCtrl',
			controllerUrl : 'app/controllers/ProviderListCtrl'
		}));
	}]);

	app.run(['$rootScope', 'BaseService', function($rootScope, BaseService) {
		$rootScope.rootPath = BaseService.getRootPath();
	}]);

	return app;
});
