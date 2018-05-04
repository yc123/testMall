define([ 'app/app'], function(app) {
	'use strict';
	app.register.controller('FaBankCtrl', ['$scope', 'toaster', 'BaseService', 'ngTableParams', 'bankInfoService', '$filter','$modal', function($scope, toaster, BaseService, ngTableParams, bankInfoService ,$filter ,$modal) {
		BaseService.scrollBackToTop();
		var bank;
		var hideBankFilter = $filter("hideBankFilter");
		//获取全部银行账户
		var getBankInfo = function(){
			
			bankInfoService.getBuyEnterpriseBank({}, function(data){
				bank = data;
				//分页显示
				$scope.faBankTableParams = new ngTableParams({
					page : 1,
					count : 10
				}, {
					total: 0,
					dataset: bank
				});
				
			});	
		}
		getBankInfo();
		
		
		//根据订单号搜索单据
		$scope.onSearch = function() {
			$scope.faBankTableParams.reload();
		}
		
		//新增账户
		$scope.newAccount = function(data) {
			var modalInstance = $modal.open({
				templateUrl : 'static/view/common/bankVenderModal.html',
				controller : 'BankInfoCtrl',
				resolve : {
					kind : function() {
						//深拷贝一份
						return angular.copy(true);
					},
					account : function() {
						//深拷贝一份
						return angular.copy(data);
					}
				}
			});
			
			modalInstance.result.then(function(account) {
				//企业账户
				bankInfoService.saveBuyEnterpriseBank({}, account, function(data) {
					toaster.pop('success', '保存成功','信息已添加');
					$scope.kind = account.kind;
					getBankInfo();
				}, function(res) {
					toaster.pop('error', '错误', res.data);
				});
			}, function() {
				
			});
		};
		
		//解析数据，从返回的数据中找到要解析的数据
		var resolveData = function(data) {
			var arr = new Array();
			for(var key in data) {
				var numb= Number(key);
				if(angular.isNumber(numb)&&(!isNaN(numb))) {
					arr.push(data[key]);
				}
			}
			return arr;
		};
		
		$scope.deleteAccount = function(buyAccount) {
			var c = confirm("是否确定要删除此账号？请保证企业至少有一个银行账户，请谨慎操作!");
			if(c) {
				bankInfoService.deleteBank({id: buyAccount.id}, function(data) {
					toaster.pop('success', '删除成功');
					getBankInfo();
				}, function(response) {
					toaster.pop('error', '删除失败');
				})
			}
		}
		

	}]);
	
	app.register.controller('BankInfoCtrl', ['$scope', '$modalInstance', 'account', 'kind', function($scope, $modalInstance, account, kind){
		$scope.account = account;
		$scope.kind = kind;
		if($scope.account) {
			$scope.title = "修改账户";
		}else {
			$scope.title = "新增账户";
			$scope.account = {};
		}
		
		$scope.confirm = function() {
			$scope.account.kind = $scope.kind;
			$modalInstance.close($scope.account);
		}
		
		$scope.cancel = function() {
			$modalInstance.dismiss();
		}
		
	}]);
	
});