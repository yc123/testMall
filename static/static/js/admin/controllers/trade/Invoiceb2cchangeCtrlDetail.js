define([ 'app/app' ], function(app) {
	//订单详情
	app.register.controller('Invoiceb2cchangeCtrlDetail', ['$scope', '$stateParams', 'Invoice', 'toaster', '$modal', function($scope, $stateParams, Invoice, toaster, $modal) {
		Invoice.getVendorByinvoiceid({invoiceid : $stateParams.invoiceid}, function(data) {
			$scope.invoice = data;
			$scope.info = {};
			$scope.statushistory = angular.fromJson($scope.invoice.statushistory);
			$scope.info.sdAddress = angular.fromJson($scope.invoice.jsonSdAddress);
			$scope.info.spAddress = angular.fromJson($scope.invoice.jsonSpAddress);
			$scope.info.logistics = angular.fromJson($scope.invoice.logistics);
			
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
			var statu = $scope.invoice.status;
			var scheduleStyle = function(){ 
				var statusAttr =['406', '404', '405'];
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
			}
			scheduleStyle();
			
		}, function(response) {
			toaster.pop('error', '提示', '载入退货单详细信息失败，请刷新页面')
		});
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

})