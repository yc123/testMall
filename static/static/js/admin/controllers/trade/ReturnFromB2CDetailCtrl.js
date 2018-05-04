define([ 'app/app' ], function(app) {
	//订单详情
	app.register.controller('ReturnFromB2CDetailCtrl', ['$scope', '$stateParams', 'Return', 'toaster', '$modal', function($scope, $stateParams, Return, toaster, $modal) {
		Return.getFB2C({returnid : $stateParams.returnid}, function(data) {
			$scope.returnFB = data;
			$scope.info = {};
			$scope.info.cust = angular.fromJson($scope.returnFB.cust);
			$scope.statushistory = angular.fromJson($scope.returnFB.statushistory);
			$scope.info.address = angular.fromJson($scope.returnFB.jsonAddress);
			$scope.info.logistics = angular.fromJson($scope.returnFB.logistics);
			console.log($scope.info.logistics);
			
			//查看物流详情
			$scope.listLogistics = function(data){
				var lgtid = $scope.info.logistics.id;
				var modalInstance = $modal.open({
					animation: true,
					templateUrl: 'static/view/admin/modal/listLogistics_modal.html',
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
			var statu = $scope.returnFB.status;
			var scheduleStyle = function(){ 
				var statusAttr =['409', '410', '405', '508'];
					if(statu == statusAttr[0]){
						$scope.styl0 = 'current';
					}
					if(statu == statusAttr[1]){
						$scope.styl0 = 'past';
						$scope.styl1 = 'current';
					}
					
					if(statu == statusAttr[2]){
						$scope.styl0 = 'past';
						$scope.styl1 = 'past';
						$scope.styl2 = 'current';
					}
					if(statu == statusAttr[3]){
						$scope.styl0 = 'past';
						$scope.styl1 = 'past';
						$scope.styl2 = 'past';
						$scope.styl3 = 'current';
					}
			}
			scheduleStyle();
			
		}, function(response) {
			toaster.pop('error', '提示', '载入退货单详细信息失败，请刷新页面')
		});
	}])
	
		// 物流信息
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
})