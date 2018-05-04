define(['app/app'], function(app) {
	'use strict';
	app.register.controller('ShippedForReturnCtrl', ['$scope', 'toaster','$modal','ShippingAddress', '$state', '$stateParams','Return','Logistics', '$filter', 'BaseService', function($scope, toaster, $modal, ShippingAddress, $state, $stateParams, Return, Logistics, $filter, BaseService) {
		BaseService.scrollBackToTop();
		
		$scope.isCompany = false;
		// 获取全部快递公司信息
		var getLogisticsCompany = function() {
			$scope.companies = [];
			Logistics.findCompany({}, {}, function(data) {
				$scope.companies = data;
			}, function() {
			
			});
		};
		
		getLogisticsCompany();
		
		//申请一个数组存放筛选之后的物流公司名称
		$scope.filterCom = [];
		
		// 若输入框为空不显示提示框
		$scope.inputCompany = function() {
			$scope.isCompany = true;
			if($scope.logistics.companyName.length > 0) {
				$scope.filterCom = $filter('filter')($scope.companies, {name :$scope.logistics.companyName});
				if($scope.filterCom == null || $scope.filterCom.length == 0){
					$scope.isCompany = false;
				}
			} else {
				$scope.filterCom = $scope.companies;
			}
		};
		
		$scope.clearSelect = function() {
			$scope.selectIndex = 0;
		};
		
		// 搜索框获得焦点，显示联想框
		$scope.onFocus = function() {
			$scope.isCompany = true;
			$scope.filterCom = $scope.companies;
			$scope.selectIndex = -1;
			if(!$scope.keyword) $scope.keyword = '';
		};

		// 鼠标进入联想词框，不能关闭联想词框
		$scope.onAssociateEnter = function() {
			$scope.associateEnter = true;
			$scope.isCompany = false;
		};
		
		// 隐藏提示框
		$scope.clearSuggestion = function() {
			$scope.isCompany = false;
		};
		
		// 搜索框通过按键选取想要的联想词
		$scope.onKeyDown = function(e) {
			if($scope.isCompany) {
				if(event.keyCode == 40) { //监听到按下键
					$scope.selectIndex ++;
					if($scope.selectIndex >= $scope.filterCom.length) $scope.selectIndex = 0;
					$scope.logistics.companyName = $scope.filterCom[$scope.selectIndex].name;
					$scope.logistics.companyId = $scope.filterCom[$scope.selectIndex].id;
				} else if(event.keyCode == 38) { //监听到按上键
					$scope.selectIndex --;
					if($scope.selectIndex < 0) $scope.selectIndex = $scope.filterCom.length - 1;
					$scope.logistics.companyName = $scope.filterCom[$scope.selectIndex].name;
					$scope.logistics.companyId = $scope.filterCom[$scope.selectIndex].id;
				}else if(event.keyCode == 13) { //确定键
					$scope.logistics.companyName = $scope.filterCom[$scope.selectIndex].name;
					$scope.logistics.companyId = $scope.filterCom[$scope.selectIndex].id;
					$scope.isCompany = false;
				}
			}
		};
		
		// 选择快递公司
		$scope.chooseCompany = function(company) {
			$scope.logistics.companyName = company.name;
			$scope.logistics.companyId = company.id;
			$scope.isCompany = false;
		};
		
		$scope.logistics = {};
		$scope.jsonSdAddress = null;
		Return.findByReturnId({returnid: $stateParams.id}, {}, function(data) {
			$scope.checkreturn = data;
			$scope.checkreturn.hide = true;
			if($scope.checkreturn.jsonAddress) {
				$scope.checkreturn.jsonAddress = angular.fromJson($scope.checkreturn.jsonAddress);
			}
		}, function() {
			toaster.pop("error", "错误", "加载换货信息失败");
		});
		
		$scope.setHide = function(checkreturn) {
			checkreturn.hide = !checkreturn.hide;
		};
		
		$scope.isSetTop = true;
		
		$scope.select = function(add) {
			$scope.jsonSdAddress = add;
		};
		
		var loadAddrs = function() {
			ShippingAddress.findB2cAdd({send: false}, function(data) {
				$scope.addresss = data;
			}, function(res) {
				toaster.pop('error', '错误！！', res.resposeText);
			});
		};
		
		loadAddrs();
		
		// 验证快递单号是否正确
		$scope.checkNumber = function() {
			$scope.isNum = true;
			if(/^[0-9]*$/.test($scope.logistics.number)) {
				if($scope.logistics.number) {
					$scope.isNum = false;
				}
			}
		};
		
		$scope.entryCheck = function(checkreturn) {
			if(!$scope.logistics.companyName || angular.equals($scope.logistics.companyName, '物流公司')) {
				toaster.pop('info', '请填写物流公司名称');
				return ;
			}
			if(!$scope.logistics.number) {
				toaster.pop('info', '请填写快递单号');
				return ;
			}
			if(!$scope.checkreturn || angular.equals(angular.toJson($scope.checkreturn),'[]')) {
				toaster.pop('info','出货单信息为空');
				return;
			}
			if(!$scope.jsonSdAddress || angular.equals(angular.toJson($scope.jsonSdAddress),'{}')) {
				toaster.pop('info','选择发货地址');
				return;
			}
			checkreturn.logistics = angular.copy($scope.logistics);
			checkreturn.jsonAddress = angular.toJson(checkreturn.jsonAddress);
			checkreturn.jsonSdAddress = angular.toJson($scope.jsonSdAddress);
			Return.sendReturn({},checkreturn,function() {
				toaster.pop('success', '发货成功!');
				$state.go('myReturn_done');
			}, function(response){
				toaster.pop('error', '发货失败，' + response.text);
			});
		}
		
	}]);
});