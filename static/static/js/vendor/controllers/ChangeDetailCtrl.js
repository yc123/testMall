define(['app/app'], function(app) {
	'use strict';
	app.register.controller('ChangeDetailCtrl', ['$scope', 'Change', '$stateParams', '$location', 'toaster', '$filter', '$modal', 'BaseService', function($scope, Change, $stateParams, $location, toaster, $filter, $modal, BaseService) {
		BaseService.scrollBackToTop();
		
		var enIdFilter = $filter('EncryptionFilter');
		//TODO 所有明细表缺乏uuid，img信息
		Change.EntChangeDetail({changeid : $stateParams.changeid}, function(data) {
			$scope.change = data ;
			$scope.address = angular.fromJson($scope.change.jsonSdAddress);
			var statushistory = angular.fromJson($scope.change.statushistory);
			
			var history = [];
			angular.forEach(statushistory, function(data) {
				if (data.status == '410' || data.status == '406' || data.status == '405') {
					history.push(data);
				}
			});
			$scope.statushistory = history;
			
			//查看物流详情
			$scope.listLogistics = function(data){
				var lgtid = $scope.change.logistics.id;
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
				var statusAttr =['410', '406', '404', '405'];
					if($scope.change.status == statusAttr[0]){
							$scope.styl0 = 'past';
							$scope.last0 = 1;
					}
					if($scope.change.status == statusAttr[1]){
						$scope.styl0 = 'past';
						$scope.styl1 = 'past';
						$scope.last1 = 1;
					}
					if($scope.change.status == statusAttr[2]){
						$scope.styl0 = 'past';
						$scope.styl1 = 'past';
						$scope.styl2 = 'past';
						$scope.last2 = 1;
					}
					if($scope.change.status == statusAttr[3]){
						$scope.styl0 = 'past';
						$scope.styl1 = 'past';
						$scope.styl2 = 'past';
						$scope.styl3 = 'past';
						$scope.last3 = 1;
					}
			}
			scheduleStyle();
			
			$scope.toDetail = function(invoiceid) {
				$location.url("invoiceChange/" + enIdFilter(invoiceid));
			}
		}, function(respone) {
			toaster.pop('error', '提示', '获取换货单失败');
		});
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
		} ]);
});