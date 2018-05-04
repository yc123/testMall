define([ 'app/app' ], function(app) {
	app.register.controller('MyReturnDoneDetailCtrl', ['$scope', 'Return', '$stateParams', '$location', 'toaster', 'EncryptionService', 'bankTransferService', '$modal', 'BaseService', function($scope, Return, $stateParams, $location, toaster, EncryptionService, bankTransferService, $modal, BaseService) {
		BaseService.scrollBackToTop();
		
		Return.findByReturnId({returnid : $stateParams.returnid}, function(data) {
			$scope.returnStatus = data;
			$scope.address = angular.fromJson($scope.returnStatus.jsonAddress);
			$scope.logistics = angular.fromJson($scope.returnStatus.logistics);
			var statushistory = angular.fromJson($scope.returnStatus.statushistory);
			var history = [];
			angular.forEach(statushistory, function(data) {
				if (data.status == '311' || data.status == '103' || data.status == '409' || data.status == '507'|| data.status == '508') {
					history.push(data);
				}
			});
			$scope.statushistory = history;
			//控制流程状态样式
			var statu = $scope.returnStatus.status;
			var scheduleStyle = function(){ 
				var statusAttr =['311', '103', '409', '410', '411', '507', '508'];
					if(statu == statusAttr[0]){
						$scope.styl0 = 'past';
						$scope.last0 = 1;
					}
					if(statu == statusAttr[1]){
						$scope.styl0 = 'past';
						$scope.styl4 = 'past';
						$scope.last4 = 1;
					}
					if(statu == statusAttr[2]){
						$scope.styl0 = 'past';
						$scope.styl1 = 'past';
						$scope.last1 = 1;
					}
					
					if(statu == statusAttr[3] || statu == statusAttr[4] || statu == statusAttr[5]){
						$scope.styl0 = 'past';
						$scope.styl1 = 'past';
						$scope.styl2 = 'past';
						$scope.last2 = 1;
					}
					if(statu == statusAttr[6]){
						$scope.styl0 = 'past';
						$scope.styl1 = 'past';
						$scope.styl2 = 'past';
						$scope.styl3 = 'past';
						$scope.last3 = 1;
					}
			};
			scheduleStyle();
		}, function() {
			toaster.pop('error', '提示', '获取退货单信息失败');
		});
		//查看物流详情
		$scope.listLogistics = function(){
			var lgtid = $scope.logistics.id;
			var modalInstance = $modal.open({
				animation: true,
				templateUrl: 'static/view/usercenter/listLogistics.html',
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
	}]);
	
	app.register.controller('listLogisticsCtrl', [ '$scope', '$modal', 'ResponseLogistics', '$modalInstance', 'lgtid', function($scope, $modal, ResponseLogistics, $modalInstance, lgtid){
		$scope.Info = [];
		$scope.getlogistics = function() {
			ResponseLogistics.get({id: lgtid}, {}, function(data) {
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