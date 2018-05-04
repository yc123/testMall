define(['app/app'], function(app) {
	'use strict';
	app.register.controller('creditCardAdminCtrl', ['$scope', 'toaster', 'BaseService', 'bankInfoService', '$filter', '$modal', function($scope, toaster, BaseService, bankInfoService, $filter, $modal) {
		BaseService.scrollBackToTop();
		
		var hideBankFilter = $filter("hideBankFilter");
		
		$scope.active = "personal";
		
		var getState = function() {
			var method = "getAdminEnterAccount";
			switch($scope.active) {
				case "personal" :
					method = "getAdminPersAccount"; break;
				case "enterprise":
					method = "getAdminEnterAccount"; break;
					default :
						method = "getAdminEnterAccount";
			}
			return method;
		}
		
		var getSaveMethod = function(kind) {
			var method = null;
			switch(kind) {
			case "personal":
				method = "saveAdminPerAccount"; break;
			case "enterprise": 
				method = "saveAdminEnteAccount"; break;
			}
			return method;
		}
		
		$scope.setActive = function(status) {
			$scope.active = status;
			loadAccount();
		}
		
		$scope.kind = 0;
		
		var loadAccount = function() {
			bankInfoService[getState()]({}, function(data) {
				$scope.accounts = data;
				angular.forEach($scope.accounts, function(account) {
					account.filterAccount = hideBankFilter(account.number);
				})
			}, function(response) {
				toaster.pop('error', '获取账户信息失败 '+ response.data);
			})
		}
		loadAccount();
		
		$scope.setDefaultAccount = function(id) {
			bankInfoService.setDefaultAccount({id : id}, function() {
				toaster.pop('success', '设置成功');
				loadAccount();
			}, function(response) {
				toaster.pop('error', '设置默认账户失败');
			})
		}
		
		//删除账户
		$scope.deleteAccount = function(buyAccount) {
			var  isSure = confirm('确认删除本银行账户？删除后无法恢复，请谨慎操作');
			if(isSure){
				bankInfoService.deleteBank({id: buyAccount.id}, function(data) {
					toaster.pop('success', '删除成功');
					loadAccount();
				}, function(response) {
					toaster.pop('error', '删除失败');
				})
			}
		}
		
		//编辑账户
		$scope.editAccount = function(data) {
			var modalInstance = $modal.open({
				templateUrl : 'static/view/admin/modal/creditCard_modal.html',
				controller : 'BankInfoCtrl',
				resolve : {
					account : function() {
						//深拷贝一份
						return angular.copy(data);
					},
					kind : function() {
						return $scope.active;
					}
				}
			});
			
			modalInstance.result.then(function(account) {
				var method = getSaveMethod(account.kind);
				if(method == null) {
					toaster.pop("info", "没有设置对应的账户类型，不能保存");
					return ;
				}
				bankInfoService[method].call(null, account, function(data) {
					toaster.pop('success', '保存成功','信息已更新');
					$scope.kind = account.kind;
					loadAccount();
				}, function(res) {
					toaster.pop('error', '错误', res.data);
				});
			});
		};
		
		
	}]);
	
	app.register.controller('BankInfoCtrl', ['$scope', '$modalInstance', 'account', 'kind', function($scope, $modalInstance, account, kind){
		$scope.creditCard = account || {};
		$scope.creditCard.kind = kind;
		
		if(account) {
			$scope.eidt = true;
		} else {
			delete $scope.eidt;
		}
		
		$scope.confirm = function() {
			$modalInstance.close($scope.creditCard);
		}
		
		$scope.cancel = function() {
			$modalInstance.dismiss();
		}
		
	}]);
});