define(['app/app'], function(app) {
	'use strict';
	app.register.controller('MyProofingCtrl', ['$scope', 'Purchase', 'ngTableParams', 'BaseService', function($scope, Purchase, ngTableParams, BaseService) {
		BaseService.scrollBackToTop();
		
		var getState = function() {
			var state = 'get';
			switch($scope.active) {
			case 'tobeshipped' :
				state = '406'; break;
			case 'inbound':
				state = '404'; break;
			case 'received':
				state = '405'; break;
			case 'unavailable'://已失效
				state = '606'; break;
			}
			return state;
		}
		
		$scope.keyword = "";
		
		$scope.active = 'tobeshipped';
		
		$scope.setActive = function(active) {
			if($scope.active != active) {
				$scope.active = active;
				$scope.orderTableParams.page(1);
				$scope.orderTableParams.reload();
			}
		}
		
		$scope.orderTableParams = new ngTableParams({
			page: 1,
			count: 10,
			sorting: {
				createtime : 'DESC'
			}
		}, {
			total: 0,
			counts: [10, 25, 50, 100],
			getData: function($defer, params) {
				$scope.loading = true;
				$scope.paginationParams = params;
				var param = BaseService.parseParams(params.url());
				param.keyword = $scope.keyword;
				param.status = getState();
				//送样单标识  isProof
				param.isProof = true;
				Purchase.getByStatus(param, function(page) {
					if(page) {
						params.total(page.totalElements);
						$defer.resolve(page.content);
					}
				})
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
		
		// 根据输入单号搜索单据
		$scope.onSearch = function() {
			$scope.keyword = angular.uppercase($scope.keyword);
			$scope.orderTableParams.page(1);
			$scope.orderTableParams.reload();
		}
	}]);
})