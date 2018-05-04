define([ 'angularAMD', 'ngRoute', 'ui-bootstrap', 'ngLocal', 'common/services', 'common/directives', 'ngTable', 'common/query/enterprise', 'common/query/user', 'common/query/customer', 'common/query/product', 'app/services/saleServices' ], function(angularAMD) {
	'use strict';
	var app = angular.module('myApp', [ 'ngRoute', 'ui.bootstrap', 'ng.local', 'common.services', 'common.directives', 'ngTable', 'common.query.enterprise', 'common.query.user', 'common.query.customer', 'common.query.product', 'saleServices', 'store' ]);
	app.init = function() {
		angularAMD.bootstrap(app);
	};
	app.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/orders', angularAMD.route({
			// 销售订单列表
			templateUrl : 'static/view/sale/order_list.html',
			controller : 'OrderListCtrl',
			controllerUrl : 'app/controllers/OrderListCtrl',
			params: {active: 'orders'}
		})).when('/order', angularAMD.route({
			// 添加销售订单
			templateUrl : 'static/view/sale/order_edit.html',
			controller : 'OrderCtrl',
			controllerUrl : 'app/controllers/OrderCtrl',
			params: {active: 'order'}
		})).when('/orders/draft', angularAMD.route({
			// 草稿箱
			templateUrl : 'static/view/sale/order_list.html',
			controller : 'OrderListCtrl',
			controllerUrl : 'app/controllers/OrderListCtrl',
			params: {active: 'orders/draft'}
		})).when('/customers', angularAMD.route({
			// 客户资料管理
			templateUrl : 'static/view/sale/customer_list.html',
			controller : 'CustomerListCtrl',
			controllerUrl : 'app/controllers/CustomerListCtrl',
			params: {active: 'customers'}
		})).otherwise({
			redirectTo : '/orders'
		});
	}]);

	app.run(['$rootScope', 'BaseService', function($rootScope, BaseService) {
		$rootScope.rootPath = BaseService.getRootPath();
	}]);

	app.controller('AuthenticationCtrl', ['$scope', '$window', 'AuthenticationService', 'SessionService', '$rootScope', 'collectionService', function($scope, $window, AuthenticationService, SessionService, $rootScope, collectionService) {
		$scope.user = { j_username: "", j_password: "", logintype: 'uu' };
		
	    $scope.login = function(user) {
	        AuthenticationService.login(user).success(function(responseText, status) {
	        	if(status == 200)
	        		$window.location.href = responseText;
	        });
	    };
	    $scope.logout = function() {
	    	AuthenticationService.logout().success(function(){
	    		SessionService.removeCookie($rootScope.userInfo.userUU);
	    		$window.location.reload();
	    	});
	    };
	    $scope.isAuthed = AuthenticationService.isLoggedIn();
	    $scope.userInfo = {};
	    AuthenticationService.getAuthentication().success(function(data){
	    	$scope.userInfo = data;

			//增加收藏功能的代码
			$rootScope.userInfo = data;
			$rootScope.brandCount = 0;
			$rootScope.componentCount = 0;
			if(SessionService.get('authenticated')) {
                collectionService.getStoreByUU({}, function(data) {
					var store = [];
					for(var i = 0; i < data.length; i++) {
						if(data[i].kind == 1) {
							$rootScope.brandCount++;
						}else {
							$rootScope.componentCount++;
						}
						store.push(data[i]);
					}
					SessionService.setCookie($rootScope.userInfo.userUU, angular.toJson(store));
					//默认在登录界面游客收藏的数据已传输成功，删除游客的数据
					SessionService.removeCookie('visitor');
				}, function(response) {
				});
			}
	    	
	    	if(data == null || !data.uu)
	    		$scope.isAuthed = false;
	    });
	}]);
	app.controller('MyCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
		$scope.hideAlert = true;
		$scope.alert = function(type, msg) {
			$scope.alert = {
				type : type,
				msg : msg
			};
			$scope.hideAlert = false;
		};
		$rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
			if(current.$$route) {
				var params = current.$$route.params;
				params && ($scope.active = params.active);
			}
		});
		$rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
			$scope.alert('error', rejection);
		});
	}]);
	app.controller('DoubleDateCtrl', ['$scope', function($scope) {
		function now() {
			return new Date();
		}
		;
		$scope.from = now();
		$scope.to = now();
		$scope.clear = function() {
			$scope.dt = null;
		};
		$scope.open = function($event, isOpened) {
			$event.preventDefault();
			$event.stopPropagation();
			$scope[isOpened] = true;
		};
		$scope.disabled = function(date, mode) {
			// return (mode === 'day' && (date.getDay() === 0 || date.getDay()
			// === 6));
			return false;
		};
		$scope.toggleMin = function() {
			$scope.minDate = ($scope.minDate) ? null : new Date();
		};
		$scope.formats = [ 'yyyy-MM-dd', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate' ];
		$scope.format = $scope.formats[0];
		$scope.setArea = function(type, x, y) {
			var today = now(), year = today.getFullYear(), month = today.getMonth(), day = today.getDate();
			if (type == 'd') {
				$scope.from = new Date(year, month, day + x);
				$scope.to = new Date(year, month, day + y);
			} else if (type == 'm') {
				$scope.from = new Date(year, month + x, x == 0 ? 1 : day);
				$scope.to = new Date(year, month + y, day);
			} else if (type == 'y') {
				$scope.from = new Date(year + x, x == 0 ? 0 : month, x == 0 ? 1 : day);
				$scope.to = new Date(year + y, month, day);
			}
		};
	}]);
	return app;
});