define([ 'app/app' ], function(app) {
	//订单详情
	app.register.controller('ReturnFromCustDetailCtrl', ['$scope', '$stateParams', 'Return', 'toaster', '$modal', function($scope, $stateParams, Return, toaster, $modal) {
		Return.findByReturnId({returnid : $stateParams.returnid}, function(data) {
			$scope.returnFC = data;
			$scope.info = {};
			$scope.statushistory = angular.fromJson($scope.returnFC.statushistory);
			$scope.info.address = angular.fromJson($scope.returnFC.jsonAddress);
			$scope.info.logistics = angular.fromJson($scope.returnFC.logistics);
			
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
			var statu = $scope.returnFC.status;
			var scheduleStyle = function(){ 
				var statusAttr =['311', '409', '103', '410', '507', '508'];
					if(statu == statusAttr[0]){
							$scope.styl0 = 'current';
					}
					if(statu == statusAttr[1] || statu == statusAttr[2]){
						$scope.styl0 = 'past';
						$scope.styl1 = 'current';
					}
					
					if(statu == statusAttr[3]){
						$scope.styl0 = 'past';
						$scope.styl1 = 'past';
						$scope.styl2 = 'current';
					}
					if(statu == statusAttr[4]){
						$scope.styl0 = 'past';
						$scope.styl1 = 'past';
						$scope.styl2 = 'past';
						$scope.styl3 = 'current';
					}
					if(statu == statusAttr[5]){
						$scope.styl0 = 'past';
						$scope.styl1 = 'past';
						$scope.styl2 = 'past';
						$scope.styl3 = 'past';
						$scope.styl4 = 'current';
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