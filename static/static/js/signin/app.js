define([ 'toaster', 'ui.bootstrap', 'services', 'common/query/store', 'common/query/messageBoard'], function() {
	'use strict';
	var app = angular.module('myApp', [ 'toaster', 'ui.bootstrap', 'common.services', 'store', 'messageBoardServices']);
	app.init = function() {
		angular.bootstrap(document, [ 'myApp' ]);
	};
	app.controller('AuthCtrl', ['$scope', '$window', '$location', 'toaster', 'AuthenticationService', 'SessionService', '$modal', 'BaseService', 'collectionService', function($scope, $window, $location, toaster, AuthenticationService, SessionService, $modal, BaseService, collectionService) {
		$scope.loading = false;
		$scope.user = {
			j_username : SessionService.getCookie('J_USERNAME'),
			j_password : "",
			remember_me : true
		};
		$scope.login = function(user, _url) {
			$scope.loading = true;
			AuthenticationService.login(user).success(function(responseText, status) {
				if (status == 200) {
					if(user.remember_me)
						SessionService.setCookie('J_USERNAME', user.j_username);
					else
						SessionService.removeCookie('J_USERNAME');
					var url = responseText;
					if(!url || url == '' || url.indexOf('/signin') > 0)
						url = BaseService.getRootPath();
					
					/*
					 * 如果游客登陆了，就将将游客收藏的信息保存的数据库
					 * author yujia
					 */
					var str = SessionService.getCookie('visitor');
					if(str) {
						collectionService.saveStores({}, angular.toJson(str), function(data) {
						}, function(response) {
							
						});
					};
					/**
					 * 这里根据客户端的返回值来进行跳转控制, 删除localStorage的数据之后再跳转
					 */
					var currentPath = SessionService.get("currentPath");
					if(currentPath) {
						SessionService.unset("currentPath");
						$window.location.href = (_url || url) + currentPath;
					} else {
						$window.location.href = (_url || url) + '/index' + window.location.hash;
					}
				} else if(status == 207 && responseText instanceof Array) {// multi
					$scope.loading = false;
					$modal.open({
						templateUrl: 'chooseEnterprise.html',
						controller: 'ChooseEnterpriseCtrl',
						size: 'sm',
						resolve: {
							enterprises: function() {
								return responseText;
							}
						}
					}).result.then(function(enUU){
						if (enUU) {
							user.t_enuu = enUU;
							$scope.login(user);
						}
					});
				}
			}).error(function(responseText) {
				$scope.loading = false;
				toaster.pop('error', '登录失败', responseText || '用户名或密码错误');
			});
		};
	}]);
	app.controller('ChooseEnterpriseCtrl', ['$scope', '$modalInstance', 'enterprises', function($scope, $modalInstance, enterprises){
		$scope.choose = enterprises[enterprises.length -1].uu;
		angular.forEach(enterprises, function(e){
			if(e.isLast)
				$scope.choose = e.uu;
		});
		$scope.enterprises = enterprises;
		$scope.cancel = function() {
			$modalInstance.close();
		};
		$scope.login = function(uu) {
			$modalInstance.close(uu);
		};
	}]);
	return app;
});