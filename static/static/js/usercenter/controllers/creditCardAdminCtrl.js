define(['app/app'], function(app) {
	'use strict';
	app.register.controller('creditCardAdminCtrl', ['$scope', 'toaster', 'BaseService', 'bankInfoService', '$filter', '$modal', function($scope, toaster, BaseService, bankInfoService, $filter, $modal) {
		BaseService.scrollBackToTop();
		
		$scope.active = 'personal';
		
		var getMethod = function() {
			var method = null;
			switch($scope.active) {
				case 'personal':
					method = 'getBuyPersonalBank'; break;
				case 'enterprise':
					method = 'getBuyEnterpriseBank'; break;
				default: method = 'getBuyPersonalBank';
			}
			return method;
		}
		
		$scope.setActive = function(status) {
			$scope.active = status;
			loadAccount();
		}
		
		var hideBankFilter = $filter("hideBankFilter");
		
		var loadAccount = function() {
			bankInfoService[getMethod()].call(null, {}, function(data) {
				$scope.accounts = data;
				angular.forEach($scope.accounts, function(account) {
					account.filterAccount = hideBankFilter(account.number);
				})
			}, function(response) {
				toaster.pop('error', '获取账户信息失败 ', response.data);
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
			switch($scope.active) {
				case 'personal':
					$scope.kind = 1; break;
				case 'enterprise':
					$scope.kind = 0; break;
				default: $scope.kind = 1;
			}
			var modalInstance = $modal.open({
				templateUrl : 'static/view/common/bankInfoModal.html',
				controller : 'BankInfoCtrl',
				resolve : {
					kind : function() {
						//深拷贝一份
						return angular.copy($scope.kind);
					},
					account : function() {
						//深拷贝一份
						return angular.copy(data);
					}
				}
			});
			
			modalInstance.result.then(function(account) {
				if(account.kind) {
					bankInfoService.saveBuyPersonalBank({}, account, function(data) {
						toaster.pop('success', '成功','信息已更新');
						$scope.kind = account.kind;
						loadAccount();  //这个方法不能提取到外面，因为存在异步。
					}, function(res) {
						toaster.pop('error', '错误', res.data);
					});
				}else {
					//企业账户
					bankInfoService.saveBuyEnterpriseBank({}, account, function(data) {
						toaster.pop('success', '保存成功','信息已更新');
						$scope.kind = account.kind;
						loadAccount();
					}, function(res) {
						toaster.pop('error', '错误', res.data);
					});
				}
			}, function() {
				
			});
		};
		
		
	}]);
	
	app.register.controller('BankInfoCtrl', ['$scope', '$modalInstance', 'account', 'kind', function($scope, $modalInstance, account, kind){
		$scope.account = account;
		if($scope.account) {
			$scope.eidt = true;
		} else {
			delete $scope.eidt;
		}
		$scope.kind = kind;
		if($scope.account) {
			$scope.title = "修改账户";
		}else {
			$scope.title = "新增账户";
			$scope.account = {};
		}
		
		$scope.set = function(kind) {
			$scope.kind = kind;
		}
		
		$scope.confirm = function() {
			$scope.account.kind = $scope.kind;
			$modalInstance.close($scope.account);
		}
		
		$scope.cancel = function() {
			$modalInstance.dismiss();
		}
		
	}]);
})