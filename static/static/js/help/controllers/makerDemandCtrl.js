define([ 'app/app' ], function(app) {
	'use strict';	
	app.register.controller('makerDemandCtrl', ['$scope', 'makerDemandServices', 'toaster', '$state', 'SessionService', '$upload', function($scope, makerDemandServices, toaster, $state, SessionService, $upload) {

		$scope.maDemand = {};
		
		if(SessionService.get('authenticated')) {
			makerDemandServices.getBasicInfo(null, function(data) {
				$scope.maDemand.commpanyName = data.companyName;
				$scope.maDemand.makerName = data.makerName;
				$scope.maDemand.telephone = data.telephone;
				$scope.maDemand.email = data.email;
				$scope.hasInfo = true;
			}, function(response) {
				toaster.pop('error', '获取个人信息失败，请重新加载界面');
			});
		}
		
		$scope.submitQues = function() {
			var method = SessionService.get('authenticated') ? 'saveMakeDemandAuthentic' : 'saveMakeDemand';
			if($scope.maDemand.descripeDemand.length > 800) {
				toaster.pop('info', '您提交的需求描述必须小于800个字符。');
				return ;
			}

			makerDemandServices[method](null, $scope.maDemand, function(data) {
				toaster.pop('success', '提交成功');
				$state.go("make_demand_list");
			}, function(response) {
				toaster.pop('error', '提交失败:'+ response.data );
			});
		}
		
		$scope.name = {};
		$scope.name.myFile = "";
		$scope.submit = function(){
			
			$scope.loading = true;
			console.log("enter");
			console.log($scope.name);
			var file = $scope.name.myFile[0];//上传附件
			console.log($scope.maDemand);
			$upload.upload({
				url: 'trade/help/makeDemand/save/file',
				file: file,
				method: 'POST',
				data: {
					maDemand: $scope.maDemand
				}
			}).success(function(data) {
				console.log(data);
			}).error(function(data) {
				console.log("error");
			});
		}
		
		$scope.cancel = function() {
			$scope.maDemand = {};
			$state.go("make_demand_list");
		}
	}]);
});