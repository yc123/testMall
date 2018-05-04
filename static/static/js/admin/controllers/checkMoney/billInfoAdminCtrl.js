define(['app/app'], function(app) {
	'use strict'
	app.register.controller('billInfoAdminCtrl', ['$scope','BaseService', 'Bill', 'toaster', '$modal', '$state', function($scope, BaseService, Bill, toaster, $modal, $state) {
		BaseService.scrollBackToTop();

		$scope.getData = function() {
			Bill.getListAdmin(null, function(data) {
				$scope.normalBill = {};
				$scope.specialBill = {};
				angular.forEach(data, function(bill) {
					if(bill.kind == 1205) {
						$scope.specialBill = bill;
					} else {
						$scope.normalBill = bill;
					}
				});
			}, function(response) {
				toaster.pop('error', '获取发票信息失败 ' + response.data);
			});
		}
		
		$scope.getData();
		
		$scope.deleteById = function(id) {
			var bool = confirm("确认要删除吗？");
			if(!bool) {
				return ;
			}
			Bill.deleteById({id: id}, function(data) {
				toaster.pop('success', '删除成功');
				$scope.getData();
			}, function(reponse) {
				toaster.pop('error', '删除发票资料失败');
			});
		}
		
		$scope.detail = function(bill) {
			var modalInstance = $modal.open({
				templateUrl : 'static/view/admin/modal/billInfoModal.html',
				controller : 'BillInfoCtrl',
				resolve : {
					bill : function() {
						//深拷贝一份
						return angular.copy(bill);
					}
				}
			});
		}
		
		$scope.revise = function(id) {
			$state.go('bill_input', {id: id});
		}
		
	}]);
	
	app.register.controller('BillInfoCtrl', ['$scope', '$modalInstance', 'bill', function($scope, $modalInstance, bill) {
		$scope.bill = bill;
		$scope.dismiss = function() {
			$modalInstance.dismiss();
		}
	}]);
})