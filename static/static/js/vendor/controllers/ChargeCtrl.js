define(['app/app'], function(app) {
	'use strict';
	app.register.controller('ChargeCtrl', ['$scope', 'Charge', 'BaseService', '$modal', 'toaster', 'ngTableParams', function($scope, Charge, BaseService, $modal, toaster, ngTableParams) {
		BaseService.scrollBackToTop();
		
		var getState = function() {
			var state = 'get';
			switch($scope.active) {
			case 'chargeapply' :
				state = '607'; break;
			case 'chargeaccept':
				state = '608'; break;
			case 'chargerefuse':
				state = '609'; break;
			case 'unavailable':
				state = '602'; break;
			}
			return state;
		}
		
		$scope.keyword = "";
		
		$scope.active = 'chargeapply';
		
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
				date : 'DESC'
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
				Charge.findCharges(param, function(page) {
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
		
		//审核
		$scope.accept = function(charge) {
			var c = confirm('审核同意后，议价格会覆盖原价格，订单交易金额会改变');
			if(c) {
				Charge.accept(null, charge, function(data) {
					$scope.active = 'chargeaccept';
					$scope.orderTableParams.reload();
					toaster.pop('success', '提交成功!');
				}, function(res){
					toaster.pop('info', '失败！');
				})
			}
		}
		
		$scope.refuse = function(charge) {
			if(charge) {
				$modal.open({
					templateUrl : 'static/view/vendor/modal/refuseCharge_modal.html',
					controller : 'chargeChargeCtrl',
					size : 'md',
					resolve : {
						charge : function(){
	                    	return angular.copy(charge);
	                    }
					}
				}).result.then(function(data){
					$scope.active = 'chargerefuse';
					$scope.orderTableParams.reload();
				}, function(reason){
					toaster.pop('info', '提示 ' + '您已取消编辑!');
				});
			}
		}
		
		// 根据输入单号搜索单据
		$scope.onSearch = function() {
			$scope.keyword = angular.uppercase($scope.keyword);
			$scope.orderTableParams.page(1);
			$scope.orderTableParams.reload();
		}
		
	}]);
	
	//申请议价
	app.register.controller('chargeChargeCtrl', ['$scope', '$modalInstance', 'toaster', '$http', 'charge', 'Charge', function($scope, $modalInstance, toaster, $http, charge, Charge){
		$scope.charge = charge;
		$scope.save = function () {
			//检查一下数据是否有缺失
			if($scope.charge.chargeRemark) {
				Charge.refuse(null, $scope.charge, function(data) {
					toaster.pop('success', '提交成功');
					$modalInstance.close(data);
				}, function(res){
					toaster.pop('info', '失败！');
				})
			}else {
				toaster.pop('info', '提示 ' + '请填写您的 原因!');
			}
	    }
	    
		$scope.cancel = function() {
			$modalInstance.dismiss();
		};
		
	}]);
});