define(['app/app'], function(app) {
	'use strict';
	app.register.controller('ChangeCtrl', ['$scope', 'toaster', 'SessionService','Change', '$stateParams','BaseService','ngTableParams' ,'EncryptionService','$state', function($scope, toaster, SessionService, Change , $stateParams, BaseService ,ngTableParams , EncryptionService, $state) {
		BaseService.scrollBackToTop();
		
		//如果window.sessionStorage 有值，就设置为当前的active值
		$scope.active = 'inspecting';
		/**
		 * 验货中 410
		 * 待收货 404-406
		 * 已收货 405
		 */
		var getState = function() {
			var state = 'get';
			switch($scope.active) {
				case 'all' : 
					break;
				case 'inspecting' :
					state = '410'; break;
				case 'inbound' :
					state = '406'; break;
				case 'tobeReceive' :
					state = '404'; break;
				case 'received' :
					state = '405'; break;
			}
			return state;
		};
		
		$scope.setActive = function(state) {
			if($scope.active != state) {
				$scope.active = state;
			}
			
			if($scope.changeTableParams.page() == 1){
				$scope.changeTableParams.reload();
			}else {
				$scope.changeTableParams.page(1);
			}
		}
		
		$scope.changeTableParams = new ngTableParams({
			page : 1,
			count : 10,
			sorting : {
				createtime: 'DESC'
			}
		}, {
			total : 0,
			counts: [10, 25, 50, 100],
			getData : function($defer, params) {
				$scope.loading = true;
				$scope.paginationParams = params;
				var param = BaseService.parseParams(params.url());
				param.keyword = $scope.keyword;
				param.status = getState();
				param.isVender = true;
				Change.getIndividualVender(param, function(page) {
					if (page) {
						params.total(page.totalElements);
						$defer.resolve(page.content);
					}
				});
			}
		});
		
		// 搜索框内容转换成大写
		var t;
		var setTime = function() {
			if($scope.time > 0) {
				t = setTimeout(function() {
					$scope.$apply(function() {
						$scope.time--;
						setTime();
					});
				}, 1000);
			}else {
				$scope.keyword = angular.uppercase($scope.keyword);
			}
		};
		
		$scope.upper = function() {
			$scope.time = 1;
			clearTimeout(t);
			setTime();
		}
		
		// 根据订单号搜索单据
		$scope.onSearch = function() {
			$scope.keyword = angular.uppercase($scope.keyword);
			$scope.changeTableParams.reload();
		};
		
		//确认收
		$scope.ensureAccept = function(returns){
			Change.venderAccept({changeid: returns.id}, null, function(data){
				$scope.sendstatus = false;
				$scope.changeTableParams.reload();
				toaster.pop('success', '处理成功', '换货单 确认收货成功');
			}, function(res){
				$scope.sendstatus = false;
				toaster.pop('error', '操作失败' + res.data + "请重新操作");
			})
		}
		
	}]);
	
});