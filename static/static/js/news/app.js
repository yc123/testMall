/**
 * 优软资讯
 *
 */
define([ 'angularAMD', 'ui.router', 'ui-bootstrap', 'ngLocal', 'ngTable', 'common/services', 'common/directives', 'angular-toaster', 'common/query/cms', 'common/query/storeInfo', 'common/query/commonCount', 'common/query/collection', 'common/query/cart','common/query/messageBoard', 'ngSanitize', 'common/module/chat_web_module' ], function(angularAMD) {
	'use strict';
	var app = angular.module('myApp', [ 'ui.router', 'ui.bootstrap', 'ng.local', 'ngTable', 'common.services', 'common.directives', 'toaster', 'cmsService', 'storeInfoServices', 'commonCountServices', 'collection', 'cartServices', 'ngSanitize' ,'messageBoardServices', 'WebChatModule']);
	app.init = function() {
		angularAMD.bootstrap(app);
	};
	app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise("/home");
		$stateProvider.state("home", angularAMD.route({
			// 新闻资讯
			url : '/home',
			title : '资讯列表',
			templateUrl : 'static/view/news/news.html',
			controller : 'newsCtrl',
			controllerUrl : 'app/controllers/newsCtrl'
		})).state("newsDetail", angularAMD.route({
			url : '/detail/:id',
			title : '资讯详情',
			templateUrl : 'static/view/news/newsDetail.html',
			controller : 'newsDetailCtrl',
			controllerUrl : 'app/controllers/newsDetailCtrl'
		}));
	}]);

	app.run(['$rootScope', 'BaseService', 'StoreInfo', function($rootScope, BaseService, StoreInfo) {
		$rootScope.rootPath = BaseService.getRootPath();
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

	app.controller('hotNewsCtrl', ['$scope', 'News', function ($scope, News) {
		News.getNewsListOrderByViewCount({}, {}, function (data) {
			$scope.news = data.content;
		}, function (error) {
			console.log(error);
		});
	}]);

	return app;
});
