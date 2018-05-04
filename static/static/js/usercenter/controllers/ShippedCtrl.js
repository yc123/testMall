define(['app/app'], function(app) {
	'use strict';
	app.register.controller('ShippedCtrl', ['$scope', 'toaster','$modal','ShippingAddress', '$state', '$stateParams','Change', 'Logistics', '$filter', 'BaseService', function($scope, toaster, $modal, ShippingAddress, $state, $stateParams, Change, Logistics, $filter, BaseService) {
		BaseService.scrollBackToTop();
		
		$scope.isCompany = false;
		// 获取全部快递公司信息
		var getLogisticsCompany = function() {
			$scope.companies = [];
			Logistics.findCompany({}, {}, function(data) {
				$scope.companies = data;
			}, function() {
			
			});
		}
		
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
		}
		
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
		Change.findByChangeId({changeid: $stateParams.id}, {}, function(data) {
			$scope.checkchange = data;
			$scope.checkchange.hide = true;
			if($scope.checkchange.jsonSdAddress) {
				$scope.checkchange.jsonSdAddress = angular.fromJson($scope.checkchange.jsonSdAddress);
			}
			if($scope.checkchange.jsonAddress) {
				$scope.checkchange.jsonAddress = angular.fromJson($scope.checkchange.jsonAddress);
			}
		}, function(res) {
			toaster.pop("error", "错误", "加载换货信息失败");
		});
		
		$scope.setHide = function(checkchange) {
			checkchange.hide = !checkchange.hide;
		}
		
		$scope.isSetTop = true;
		
		$scope.select = function(add) {
			$scope.jsonAddress = add;
		}
		
		var loadAddrs = function() {
			ShippingAddress.findB2cAdd({send: false}, function(data) {
				$scope.addresss = data;
				if($scope.addresss.length > 0) {
					$scope.jsonAddress = $scope.addresss[0];
				}else {
					$scope.jsonAddress = null;
				}
			}, function(res) {
				toaster.pop('error', '错误！！', res.resposeText);
			});
		};
		
		loadAddrs();
		
		$scope.entryCheck = function(checkchange) {
			if(!$scope.logistics.companyName || angular.equals($scope.logistics.companyName, '物流公司')) {
				toaster.pop('info', '请填写物流公司名称');
				return ;
			}
			if(!$scope.logistics.number) {
				toaster.pop('info', '请填写快递单号');
				return ;
			}
			if(!$scope.checkchange || angular.equals(angular.toJson($scope.checkchange),'[]')) {
				toaster.pop('info','出货单信息为空');
				return;
			}
			if(!$scope.jsonAddress || angular.equals(angular.toJson($scope.jsonAddress),'{}')) {
				toaster.pop('info','选择收货地址');
				return;
			}
			checkchange.logistics = angular.copy($scope.logistics);
			checkchange.jsonAddress = angular.copy($scope.jsonAddress);
			var newModel = function(checkchange) {
				$modal.open({
					templateUrl : 'static/view/usercenter/modal/editchange_modal.html',
					controller : 'ensureChangeCtrl',
					size : 'lg',
					resolve : {
	                    checkchanges : function() {
	                    	return angular.copy($scope.checkchange);
	                    },
	                    logistis : function() {
	                    	return angular.copy($scope.logistics);
	                    }
					}
				}).result.then(function(address){
					loadAddrs();
				});
			}
			newModel();

		}
		
		
	}]);
	
	
	//地址编辑模态框的Controller
	app.register.controller('ensureChangeCtrl', ['$scope', 'logistis', 'checkchanges', '$modalInstance', 'toaster', 'Change', 'ShippingAddress','$state', function($scope, logistis, checkchanges, $modalInstance, toaster, Change, ShippingAddress, $state){
		$scope.change = checkchanges;
		$scope.logistis = logistis;
	    $scope.save = function (change) {
	    	change.jsonSdAddress = angular.toJson(change.jsonSdAddress) ;
	    	change.jsonAddress = angular.toJson(change.jsonAddress) ;
	    	change.logistics = $scope.logistis;
			Change.sendChange({},change,function(data) {
				$modalInstance.dismiss();
				toaster.pop('success', '发货成功!');
				$state.go('myChange_done');
			}, function(res){
				toaster.pop('error', '发货失败，' + res.data);
			})
	    }
		$scope.cancel = function() {
			$modalInstance.dismiss();
		};
		
	}]);
	
	
});