define([ 'app/app' ], function(app) {
	'use strict';	
	app.register.controller('supplyChainCtrl', ['$scope', 'makerDemandServices', 'toaster', '$state', 'SessionService', '$upload', 'SuDemand', '$modal', '$http', '$timeout', function($scope, makerDemandServices, toaster, $state, SessionService, $upload, SuDemand, $modal, $http, $timeout) {
		
		if(SessionService.get('authenticated')) {
			makerDemandServices.getBasicInfo(null, function(data) {
				$scope.suDemand = data;
				$scope.hasInfo = true;
			}, function(response) {
				toaster.pop('error', '获取个人信息失败，请重新加载界面');
			});
		}
		
		//既往三年营业额
		$scope.enThreeTurnover = [];
		var threeTurnover = {lastYear:null,yearBefore:null,thePreviousYear:null};
		$scope.enThreeTurnover.push(threeTurnover);
		
		//供应商数据
		$scope.enSupplier = [];
		var supplier = {supplierName:null, accountPeriod:null, accountCredit:null, transactionSum:null};
		$scope.enSupplier.push(supplier);
		$scope.addEnSupplier = function() {
			$scope.enSupplier.push({supplierName:null, accountPeriod:null, accountCredit:null, transactionSum:null});	
		}
		
		//删除供应商数据
		$scope.removeEnSupplier = function(index) {
			$scope.enSupplier.splice(index, 1);
		};
		
		//客户数据
		$scope.enClient = [];
		var client = {clientName:null, accountPeriod:null, accountCredit:null, transactionSum:null};
		$scope.enClient.push(client);
		$scope.addEnClient = function() {
			$scope.enClient.push({clientName:null, accountPeriod:null, accountCredit:null, transactionSum:null});	
		}
		
		//删除客户数据
		$scope.removeEnClient = function(index) {
			$scope.enClient.splice(index, 1);
		}
		//额外货押数据
		$scope.extraData = [];
		var mortgage = {proName:null, proDescription:null, price:null, number:null, supplier:null, date:null};
		$scope.extraData.push(mortgage);
		$scope.addExtraData = function() {
			$scope.extraData.push({proName:null, proDescription:null, price:null, number:null, supplier:null, date:null});	
		}
		
		//删除额外货押数据
		$scope.removeExtraData = function(index) {
			$scope.extraData.splice(index, 1);
		};
				
		// 搜索框获得焦点，显示联想框
		$scope.onFocus = function(extra) {
			extra.associate = true;
			$scope.selectIndex = -1;
			if(!$scope.keyword) $scope.keyword = '';
		};
		
		// 搜索框失去焦点，关闭联想框
		$scope.onBlur = function(extra) {
			extra.associate = false;
		};
		
		// 搜索框通过按键选取想要的联想词
		$scope.onKeyup = function(extra) {
			var code = null;
			if($scope.associates && $scope.associates.length) {
				if(event.keyCode == 40) { //监听到按下键
					$scope.selectIndex ++;
					if($scope.selectIndex >= $scope.associates.length) $scope.selectIndex = 0;
					$scope.keyword = $scope.associates[$scope.selectIndex].code;
					console.log($scope.selectIndex);
				} else if(event.keyCode == 38) { //监听到按上键
					$scope.selectIndex --;
					if($scope.selectIndex < 0) $scope.selectIndex = $scope.associates.length - 1;
					$scope.keyword = $scope.associates[$scope.selectIndex].code;
				} else if(event.keyCode == 13) {
					extra.proName = $scope.associates[$scope.selectIndex].code;
				}
			}
		};
		
		// 输入框内容变化，获取新的联想词
		$scope.onChange = function(component) {
			var params = {
				keyword: component
			};
			if(component != null){
				$http.get('search/similarComponents', {
					params : params
				}).success(function(data) {
					$scope.associates = data;
					console.log(data);
				}).error(function(response) {
					
				});
			}else {
				$scope.associates = false;
			}
		};
		
		
		// 点击联想词
		$scope.onAssociateClick = function(index, component, extra) {
			extra.proName = component.code;
		};
		
		$scope.getMouserInfo = function(component, extra) {
			extra.proName = component.code;
		}
		
		// 鼠标进入联想词框，不能关闭联想词框
		$scope.onAssociateEnter = function() {
			$scope.associateEnter = true;
		};
		
		// 鼠标离开联想词框，可以关闭联想词框
		$scope.onAssociateLeave = function() {
			$scope.associateEnter = false;
		};
		
		//提交表单
		$scope.name = {};
		$scope.name.myFile="";
		$scope.turnover = {};
		$scope.turnover.currency= '';
		$scope.submitMessage = function() {
			$scope.loading = true;
			
			//今年营业额
			if($scope.turnover.currency == 'USD') {
				$scope.suDemand.enNewTurnover = '$ ' + $scope.suDemand.enNewTurnover;
			}else if($scope.turnover.currency == 'RMB') {
				$scope.suDemand.enNewTurnover = '¥ ' + $scope.suDemand.enNewTurnover;
			}else {
				$scope.suDemand.enNewTurnover = null;
			}
			
			//货押
			angular.forEach($scope.extraData, function(mortgage) {
				if(mortgage.currency == 'USD') {
					mortgage.price = '$ ' + mortgage.price;
				}else if(mortgage.currency == 'RMB') {
					mortgage.price = '¥ ' + mortgage.price;
				}else {
					mortgage.price = null;
				}
			});
			$scope.suDemand.enMortgage = angular.toJson($scope.extraData);
			
			//供应商
			angular.forEach($scope.enSupplier, function(supplier) {
				if(supplier.currency == 'USD') {
					supplier.accountCredit = '$ ' + supplier.accountCredit;
					supplier.transactionSum = '$ ' + supplier.transactionSum;
				}else if(supplier.currency == 'RMB') {
					supplier.accountCredit = '¥ ' + supplier.accountCredit;
					supplier.transactionSum = '¥ ' + supplier.transactionSum;
				}else{
					supplier.accountCredit = null;
					supplier.transactionSum = null;
				}
			});
			$scope.suDemand.enSupplier = angular.toJson($scope.enSupplier);
			
			//客户
			angular.forEach($scope.enClient, function(client) {
				if(client.currency == 'USD') {
					client.accountCredit = '$ ' + client.accountCredit;
					client.transactionSum = '$ ' + client.transactionSum;
				}else if(client.currency == 'RMB') {
					client.accountCredit = '¥ ' + client.accountCredit;
					client.transactionSum = '¥ ' + client.transactionSum;
				}else {
					client.accountCredit = null;
					client.transactionSum = null;
				}
			});
			$scope.suDemand.enClient = angular.toJson($scope.enClient);
			
			//既往三年营业额
			var enThreeTurnover = [];
			angular.forEach($scope.enThreeTurnover, function(threeTurnover) {
				if(threeTurnover.currency == 'USD') {
					threeTurnover.lastYear = '$ ' + threeTurnover.lastYear;
					threeTurnover.yearBefore = '$ ' + threeTurnover.yearBefore;
					threeTurnover.thePreviousYear = '$ ' + threeTurnover.thePreviousYear;
				}else if(threeTurnover.currency == 'RMB') {
					threeTurnover.lastYear = '¥ ' + threeTurnover.lastYear;
					threeTurnover.yearBefore = '¥ ' + threeTurnover.yearBefore;
					threeTurnover.thePreviousYear = '¥ ' + threeTurnover.thePreviousYear;
				}else {
					threeTurnover.lastYear = null;
					threeTurnover.yearBefore = null;
					threeTurnover.thePreviousYear = null;
				}
				if(threeTurnover.currency) {
					enThreeTurnover.push(threeTurnover);
				}
			});
			$scope.suDemand.enThreeTurnover = angular.toJson(enThreeTurnover);
			console.log($scope.suDemand.enThreeTurnover);
			
			var file = $scope.name.myFile[0];//上传执照附件
			$upload.upload({
				url: 'help/suDemand/save/entity',
				file: file,
				method: 'POST',
				data: {
					suDemand: $scope.suDemand
				}
			}).success(function(data) {
				SuDemand.sendEmail({id: data.id}, function(data) {
					toaster.pop('success', '提示', '提交成功');
					var timer = $timeout(function() {
						window.location.reload;
					}, 1000);
				}, function(res) {
					
				});
			}).error(function(data) {
				toaster.pop('error', '提示', '提交失败');
			});
		}
		
		$scope.reload = function() {

		}
	}]);
	
});