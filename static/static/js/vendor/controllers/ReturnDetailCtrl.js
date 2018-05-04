define(['app/app'], function(app) {
	'use strict';
	app.register.controller('ReturnDetailCtrl', ['$scope', 'Return', '$stateParams', 'toaster', '$modal', 'BaseService', function($scope, Return, $stateParams, toaster, $modal, BaseService) {
		BaseService.scrollBackToTop();
		
		Return.EntReturnDetail({returnid : $stateParams.returnid}, function(data) {
			$scope.Return = data;
			var statushistory = angular.fromJson($scope.Return.statushistory);
			var history = [];
			angular.forEach(statushistory, function(data) {
				if (data.status == '410' || data.status == '405') {
					history.push(data);
				}
			});
			$scope.statushistory = history;
			
			//查看物流详情
			$scope.listLogistics = function(data){
				var lgtid = $scope.Return.logistics.id;
				console.log(lgtid);
				var modalInstance = $modal.open({
					animation: true,
					templateUrl: 'static/view/vendor/listLogistics.html',
					controller: 'listLogisticsCtrl',
					resolve: {
						lgtid: function() {
							return lgtid;
						}
					}
				});
				modalInstance.result.then(function(response){
					
				}, function(){
					
				});
			}
			
			//控制流程状态样式
			var scheduleStyle = function(){ 
				var statusAttr =['410', '405'];
					if($scope.Return.status == statusAttr[0]){
							$scope.styl0 = 'past';
					}
					if($scope.Return.status == statusAttr[1]){
						$scope.styl0 = 'past';
						$scope.styl1 = 'past';
					}
			}
			scheduleStyle();
		}, function(res) {
			toaster.pop('error', '提示', '获取退货单失败');
		})
	}]);

	app.register.controller('listLogisticsCtrl', [
		'$scope',
		'$modal',
		'ResponseLogistics',
		'$modalInstance',
		'lgtid',
		function($scope, $modal, ResponseLogistics, $modalInstance,
				lgtid) {
			$scope.Info = [];
			$scope.getlogistics = function() {
				ResponseLogistics.get({
					id : lgtid
				}, {}, function(data) {
					$scope.Info = data;
					console.log(data);
				});
			};
			$scope.getlogistics();
			$scope.cancel = function() {
				$modalInstance.dismiss();
			}
		}]);
});