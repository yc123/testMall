define([ 'angularAMD', 'ngRoute', 'ui-bootstrap', 'ngDraggable' ], function(angularAMD) {
	'use strict';
	var app = angular.module('myApp', [ 'ngRoute', 'ui.bootstrap', 'ngDraggable' ]);
	app.init = function() {
		angularAMD.bootstrap(app);
	};
	/**
	 * 默认页面属性
	 */
	var defaults = {
		home : {
			type : '基础页',
			name : '首页',
			layout : [],
			desc : '首页为买家访问店铺看到的第一个页面',
			rules : [ '导航不能删除，不能低于30px', '导航+店招不能超过150px' ]
		},
		search : {
			type : '基础页',
			name : '店内搜索',
			layout : [],
			desc : '搜索宝贝的页面，买家通过顶部搜索或者搜索模块进入该页面',
			rules : [ '默认搜索页面不能装修，只能设置页面页头背景', '导航不能删除，不能低于30px', '导航+店招不能超过150px' ]
		},
		trends : {
			type : '基础页',
			name : '店铺动态',
			layout : [],
			desc : '店铺动态为买家与卖家交流互动的平台，包含动态、留言板和 日志相册等功能',
			rules : [ '该页面及子页面暂不能装修，不能设置页面页头背景', '导航不能删除，不能低于30px', '导航+店招不能超过150px' ]
		},
		details : {
			type : '基础页',
			name : '商品详情',
			layout : [],
			desc : '展示商品详情和购买的页面',
			rules : [ '详情页不支持设置页面背景', '详情页左侧与内容区不能添加三方模块', '页面不能出现悬浮，不能有任何内容遮挡官方区域，违规者将予封店处理',
					'导航不能删除，不能低于30px，导航+店招不能超过150px' ]
		},
		classification : {
			type : '基础页',
			name : '商品分类',
			layout : [],
			desc : '列表页模板仅作为批量化修改列表页装修而存在，无真实意义， 且只能一级分类绑定模板',
			rules : [ '关联到该模板页的宝贝分类的链接页面与该页装修结果一致', '只有一级分类才能绑定列表页模板', '没有绑定到特定自定义分类页的商品分类链接指向“商品分类页”' ]
		},
		userdefined : {
			type : '自定义页',
			name : '自定义',
			layout : [],
			editable : true,
			rules : [ '导航不能删除，不能低于30px; 导航+店招不能超过150px', '自定义页不支持添加设计师模块' ],
			showAdvanced : true,
			advanced : {
				ishome : false,
				showinnav : true
			}
		}
	};
	app.config(function($routeProvider) {
		$routeProvider.when('/page/:pageId/design', angularAMD.route({
			// 页面编辑
			templateUrl : 'static/view/shop/page_design.html',
			controller : 'PageDesignCtrl',
			controllerUrl : 'app/controllers/PageDesignCtrl',
			resolve : {
				pageConfig : function() {
					return defaults.home;
				},
				operator : function() {
					return 'design';
				}
			}
		})).when('/page/:pageId/layout', angularAMD.route({
			// 页面布局
			templateUrl : 'static/view/shop/page_layout.html',
			controller : 'PageLayoutCtrl',
			controllerUrl : 'app/controllers/PageLayoutCtrl',
			resolve : {
				pageConfig : function() {
					return defaults.home;
				},
				operator : function() {
					return 'layout';
				}
			}
		})).when('/page/:pageId/setting', angularAMD.route({
			// 页面属性
			templateUrl : 'static/view/shop/page_setting.html',
			controller : 'PageSettingCtrl',
			controllerUrl : 'app/controllers/PageSettingCtrl',
			resolve : {
				pageConfig : function() {
					return defaults.home;
				},
				operator : function() {
					return 'setting';
				}
			}
		})).otherwise({
			redirectTo : '/page/0/design'
		});
	});
	/**
	 * 左边导航栏
	 */
	app.controller('NavCtrl', function($scope) {
		$scope.open = {
			first : true,
			second : true,
			third : true,
			fourth : true,
			fifth : true
		};
	});
	/**
	 * 页面编辑
	 */
	app.controller('PageCtrl', function($scope, $rootScope, $location) {
		$scope.page = {};
		$rootScope.$on('$routeChangeSuccess', function(event, current) {
			if (current.locals && current.locals.operator)
				$scope.page.operator = current.locals.operator;
		});
		$scope.$watch('page.operator', function(value) {
			if (value) {
				$location.path('/page/0/' + $scope.page.operator);
			}
		});
	});
	return app;
});