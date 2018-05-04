define([ 'app/app' ], function(app) {
	app.register.controller('InvoiceChangeDetailCtrl', ['$scope', 'Invoice', 'VendorService', 'toaster', '$stateParams', '$modal', 'BaseService', function($scope, Invoice, VendorService, toaster, $stateParams, $modal, BaseService) {
		Invoice.findByinvoiceIds({ids : $stateParams.invoiceChangeId}, {}, function(data){
			BaseService.scrollBackToTop();
			
			$scope.invoiceFPur = data;
			//状态变更记录
			$scope.statushistory = angular.fromJson($scope.invoiceFPur[0].statushistory);
			
			//地址
			$scope.address = angular.fromJson($scope.invoiceFPur[0].jsonSpAddress);
			
			//物流信息
			$scope.logistics = angular.fromJson($scope.invoiceFPur[0].logistics);
			
			//查看物流详情
			$scope.listLogistics = function(data){
				var lgtid = data.id;
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
			var statu = $scope.invoiceFPur[0].status;
			var scheduleStyle = function(){ 
				var statusAttr =['406', '404', '405', '506', '505'];
					if(statu == statusAttr[0]){
							$scope.styl0 = 'past';
							$scope.last0 = 1;
					}
					
					if(statu == statusAttr[1]){
						$scope.styl0 = 'past';
						$scope.styl1 = 'past';
						$scope.last1 = 1;
					}
					if(statu == statusAttr[2] || statu == statusAttr[3]){
						$scope.styl0 = 'past';
						$scope.styl1 = 'past';
						$scope.styl2 = 'past';
						$scope.last2 = 1;
					}
					
					if(statu == statusAttr[4]){
						$scope.styl0 = 'past';
						$scope.styl1 = 'past';
						$scope.styl2 = 'past';
						$scope.styl3 = 'past';
						$scope.last3 = 1;
					}
			};
			scheduleStyle();
			
			//根据卖家uu获取卖家信息
			var getSellerInfo = function(){
				VendorService.getVendorInfoByEnuu({sellerenuu : $scope.invoiceFPur[0].sellerenuu}, {}, function(data){
					$scope.seller = data;
				}, function(response) {
					toaster.pop('error', '提示', '获取买家信息单详情失败');
				});
			};
			getSellerInfo();
			
		}, function(data) {
			toaster.pop('error', '提示', '获取换货出货单详情失败');
		})
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