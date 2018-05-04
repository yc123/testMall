define(['app/app'], function(app) {
	'use strict'
	app.register.controller('BillInputCtrl', ['$scope', '$http', 'BaseService', 'Bill', 'toaster', '$stateParams', '$state', 'isNormal', '$upload', function($scope, $http, BaseService, Bill, toaster, $stateParams, $state, isNormal, $upload) {
		BaseService.scrollBackToTop();
		
		$scope.bill = {};
		$scope.bill.address = {};
		$scope.bill.is_agree = true;
		$scope.bill.kind = 1206;
		$scope.isNormal = true;
		$scope.isSpecial = true;
		$scope.isRevice = $stateParams.id;
		//控制发票的类型
		$scope.setType = function() {
			switch(isNormal) {
			case 1206:
				$scope.bill.kind = 1206;
				$scope.isNormal = true;
				$scope.isSpecial = false; break;
			case 1205:
				$scope.bill.kind = 1205;
				$scope.isNormal = false;
				$scope.isSpecial = true; break;
				default:
					$scope.isNormal = true;
					$scope.isSpecial = true;
			}
		}
		
		$scope.setType();
		
		var getCityData = function() {
			$http.get('static/js/prod/data/city.json').success(function(data) {
				$scope.division = data;
			}).error(function(e) {
				toaster.pop('error', '系统错误 ' + '加载城市信息失败');
			});
		}
		
		
 		//如果有id传进来则获取指定的发票信息
		$scope.getData = function() {
			if($stateParams.id) {
				Bill.getBillById({id: $stateParams.id}, function(data) {
					$scope.bill = data;
					if($scope.bill.kind == 1205) {
						$scope.isNormal = false;
					}else {
						$scope.isSpecial = false;
					}
					$scope.bill.is_agree = true;
					$http.get('static/js/prod/data/city.json').success(function(data) {
						$scope.division = data;
						if($scope.bill.area){
							$scope.bill.address = {};
							//拼装下拉选择框
							var arr = $scope.bill.area.split(',');
							$scope.bill.address.province = arr[0];
							$scope.bill.address.city = arr[1];
							$scope.bill.address.district = arr[2];
						}
					}).error(function(e) {
						toaster.pop('error', '系统错误 ' + '加载城市信息失败，请重新刷新界面。');
					});
				}, function(response) {
					toaster.pop('error', '获取指定的发票信息失败');
				});
			}else {
				getCityData();
			}
		}
		$scope.getData();
		
		$scope.saveBill = function() {
			$scope.bill.area = $scope.bill.address.province + "," + $scope.bill.address.city + "," + $scope.bill.address.district;
			var file = null
			if($scope.bill.billInfo&&$scope.bill.billInfo[0]) {
				file = $scope.bill.billInfo[0];
			}
			$upload.upload({
				url: 'trade/bill/save/admin',
				file: file,
				method: 'POST',
				data: {
					bill: $scope.bill
				}
			}).success(function(data){
				toaster.pop('success', '保存成功');
				delete $scope.bill.address.province;
				delete $scope.bill.address.city;
				delete $scope.bill.address.district;
				$state.go('billInfoAdmin');
			}).error(function(res){
				console.log(res);
				toaster.pop('error', '保存信息失败  ' + res);
			});
		};
		
		$scope.exit = function() {
			$state.go('billInfoAdmin');
		}
	}]);
})