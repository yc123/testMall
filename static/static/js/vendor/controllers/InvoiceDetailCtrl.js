define([ 'app/app' ], function(app) {
	app.register.controller('InvoiceDetailCtrl', ['$scope', '$anchorScroll', '$modal', '$location' , 'ngTableParams', 'InvoiceFPurchase', 'VendorService', 'toaster', '$stateParams', 'ComponentActive', 'BaseService', function($scope, $anchorScroll, $modal, $location , ngTableParams, InvoiceFPurchase, VendorService, toaster, $stateParams, ComponentActive, BaseService) {
		BaseService.scrollBackToTop();	
		
		//获取卖家出货单订单详情
			var loadData = function(){
				InvoiceFPurchase.getInvoiceFPurc({invoiceid: $stateParams.invoiceid}, {}, function(data){
					$scope.invoiceFPur = data;
					//状态变更记录
					$scope.statushistory = angular.fromJson($scope.invoiceFPur.statushistory);
					
					//地址
					$scope.address = angular.fromJson($scope.invoiceFPur.jsonSpAddress);
					
					//物流信息
					$scope.logistics = angular.fromJson($scope.invoiceFPur.logistics);

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
					//根据卖家uu获取卖家信息
					var sellerenuu = $scope.invoiceFPur.sellerenuu;
					var getSellerInfo = function(){
						VendorService.getVendorInfoByEnuu({sellerenuu:sellerenuu}, {}, function(data){
							$scope.seller = data;
						});
					};
					getSellerInfo();

					//根据批次号获取标准元器件信息
					var details = $scope.invoiceFPur.invoiceFPurchaseDetails;
					var getComponent = function() {
						angular.forEach(details, function(detail){
							ComponentActive.getByBatchCode({batchCode:detail.batchCode}, {}, function(comp){
								detail.img = comp.img;
								detail.uuid = comp.uuid;
							});
						})
					};
					getComponent();

					//控制流程状态样式
					var statu = $scope.invoiceFPur.status;
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
					}
					scheduleStyle();
					
				}), function(){
					toaster.pop('error', '提示', '获取出货单详情失败');
				};
			};
			loadData();	
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