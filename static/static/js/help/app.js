define([ 'angularAMD', 'ui.router', 'ui-bootstrap', 'ngLocal', 'ngTable', 'angular-sanitize', 'ngAnimate', 'common/services', 'common/directives', 'angular-toaster', 'common/query/urlencryption', 'ui-jquery', 'jquery-uploadify', ,'angular-toaster','common/query/makerDemand','common/query/kind', 'common/query/brand', 'common/query/component', 'common/query/order', 'common/query/cart', 'common/query/goods','common/query/collection', 'file-upload', 'file-upload-shim', 'common/query/suDemand', 'common/query/makerDemand', 'common/query/messageBoard', 'common/query/help', 'common/module/chat_web_module'], function(angularAMD) {
	'use strict';
	var app = angular.module('myApp', [ 'ui.router', 'ui.bootstrap', 'ng.local', 'ngAnimate', 'ngSanitize', 'ngTable', 'common.services', 'tool.directives', 'common.directives', 'toaster', 'urlencryptionServices','common.query.kind', 'brandServices', 'componentServices', 'orderServices', 'cartServices', 'ui.jquery', 'makerDemand','collection', 'angularFileUpload', 'suDemandServices', 'messageBoardServices', 'helpServices', 'WebChatModule' ]);
	app.init = function() {
		angularAMD.bootstrap(app);
	};
	
	// ui-router 路由配置
	app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
		$urlRouterProvider.otherwise("/home");
		$stateProvider.state('home', angularAMD.route({
			// 帮助首页,关于搜索
			url: '/home',
			templateUrl : 'static/view/help/home.html'
		})).state('nav', angularAMD.route({
			url: '/nav/:navId',
			templateUrl: 'static/view/help/helpnav.html',
            controller: 'HelpNavCtrl',
            controllerUrl: 'app/controllers/helpNavCtrl'
		})).state('issue', angularAMD.route({
			url: '/issue/:num',
			templateUrl: 'static/view/help/issue.html',
			controller: 'IssueCtrl',
			controllerUrl: 'app/controllers/issueCtrl'
		}))/*.state('purchaseProcess', {
			// 购物流程
			url: '/purchaseProcess',
			templateUrl : 'static/view/help/purchaseProcess.html'
		}).state('sellerProcess', {
			// 购物流程
			url: '/sellerProcess',
			templateUrl : 'static/view/help/sellerProcess.html'
		}).state('changeAndReturn', {
			// 退换货说明
			url: '/changeAndReturn',
			templateUrl : 'static/view/help/changeAndReturn.html'
		}).state('bankTransfer', {
			// 银行转账
			url: '/bankTransfer',
			templateUrl : 'static/view/help/bankTransfer.html'
		}).state('faBill', {
			// 发票说明
			url: '/faBill',
			templateUrl : 'static/view/help/faBill.html'
		}).state('deliveryByLogistic', {
			//第三方物流
			url: '/deliveryByLogistic',
			templateUrl : 'static/view/help/deliveryByLogistic.html'
		}).state('deliverySelf', {
			// 上门自取
			url: '/deliverySelf',
			templateUrl : 'static/view/help/deliverySelf.html'
		}).state('market', {
			// 关于UU商城
			url: '/market',
			templateUrl : 'static/view/help/market.html'
		}).state('cultureAndValue', {
			// 企业文化和价值
			url: '/cultureAndValue',
			templateUrl : 'static/view/help/cultureAndValue.html'
		}).state('make_demand', angularAMD.route({
			// 创客需求
			url: '/maker/demand',
			templateUrl : 'static/view/help/makerDemand.html',
			controller: 'makerDemandCtrl',
			controllerUrl: 'app/controllers/makerDemandCtrl'
		})).state('make_demand_list', angularAMD.route({
			// 创客需求汇总
			url: '/maker/demand/list',
			templateUrl : 'static/view/help/makerDemandList.html',
			controller: 'makerDemandListCtrl',
			controllerUrl: 'app/controllers/makerDemandListCtrl'
		})).state('makeDemand_detail', angularAMD.route({
			// 联系我们
			url: '/maker/demand/detail/:id',
			templateUrl : 'static/view/help/makerDemandDetail.html',
			controller: 'makerDemandDetailCtrl',
			controllerUrl: 'app/controllers/makerDemandDetail'
		})).state('supply_demand', angularAMD.route({
			// 供应链
			url: '/supplyChain',
			templateUrl : 'static/view/help/supplyChain.html',
			controller: 'supplyChainCtrl',
			controllerUrl: 'app/controllers/supplyChainCtrl'
		})).state('coperation', {
			// 渠道合作
			url: '/coperation',
			templateUrl : 'static/view/help/coperation.html'
		}).state('joinUs', {
			// 加入我们
			url: '/joinUs',
			templateUrl : 'static/view/help/joinUs.html'
		}).state('news', {
			// 站内新闻
			url: '/news',
			templateUrl : 'static/view/help/news.html'
		}).state('agreement', {
			// 使用协议
			url: '/agreement',
			templateUrl : 'static/view/help/agreement.html'		
		})*/
	}]);

	app.run(['$rootScope', 'BaseService', function($rootScope, BaseService) {
		$rootScope.rootPath = BaseService.getRootPath();
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

	// 左侧边栏controller
	app.controller('HelpNavListCtrl', ['$scope', 'HelpAPI', function ($scope, HelpAPI) {
		HelpAPI.findAllChildren({parentId : 0}, function (data) {
			$scope.nav1 = data;
			angular.forEach($scope.nav1, function (nav) {
				nav.isShow = true;
			});
		}, function (response) {
			toaster.pop('error', response.data);
		});

		// 开关导航
		$scope.toggleNav = function (nav) {
			nav.isShow = !nav.isShow;
		};
	}]);

	return app;
});