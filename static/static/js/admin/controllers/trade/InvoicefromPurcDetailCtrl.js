define([ 'app/app' ], function(app) {
	app.register.controller('InvoicefromPurcDetailCtrl', ['$scope', '$anchorScroll', '$location' , 'ngTableParams', 'InvoiceFPurchase', 'Purchase', 'toaster', '$stateParams', 'ComponentActive', '$modal', function($scope, $anchorScroll, $location , ngTableParams, InvoiceFPurchase, Purchase, toaster, $stateParams, ComponentActive, $modal) {
			//获取卖家出货单订单详情
			var loadData = function(){
				InvoiceFPurchase.getInvoiceFPurc({invoiceid: $stateParams.invoiceid}, {}, function(data){
					$scope.invoiceFPur = data;
					//状态变更记录
					$scope.statushistory = angular.fromJson($scope.invoiceFPur.statushistory);
					
					//地址
					$scope.address = angular.fromJson($scope.invoiceFPur.jsonSdAddress);
					
					//物流信息
					$scope.logistics = angular.fromJson($scope.invoiceFPur.logistics);
					console.log($scope.logistics);
					//查看物流详情
					$scope.listLogistics = function(){
						var modalInstance = $modal.open({
							animation: true,
							templateUrl: 'static/view/admin/modal/listLogistics_modal.html',
							controller: 'listLogisticsCtrl',
							resolve: {
								logistics : function () {
									return $scope.logistics
								}
							}
						});
						modalInstance.result.then(function(response){
							
						}, function(){
							
						});
					}
				
					//根据批次号获取标准元器件信息
					// var details = $scope.invoiceFPur.invoiceFPurchaseDetails;
					// var getComponent = function() {
					// 	angular.forEach(details, function(detail){
					// 		ComponentActive.getByBatchCode({batchCode:detail.batchCode}, {}, function(comp){
					// 			detail.img = comp.img;
					// 			detail.uuid = comp.uuid;
					// 		});
					// 	})
					// };
					// getComponent();

					//根据来源采购单id获取采购单信息
					var puid = $scope.invoiceFPur.puid;
					var getPurchase = function(){
						Purchase.getPurchaseById({id: puid}, {}, function(data){
							$scope.purc = data;
						});
					}
					getPurchase();
					
					//控制流程状态样式
					var scheduleStyle = function(){ 
						var statusAttr =['406', '404', '405', '506', '505'];
							if($scope.invoiceFPur.status == statusAttr[0]){
									$scope.styl0 = 'current';
							}
							if($scope.invoiceFPur.status == statusAttr[1]){
								$scope.styl0 = 'past';
								$scope.styl1 = 'current';
							}
							if($scope.invoiceFPur.status == statusAttr[2]){
								$scope.styl0 = 'past';
								$scope.styl1 = 'past';
								$scope.styl2 = 'current';
							}
							if($scope.invoiceFPur.status == statusAttr[3]){
								$scope.styl0 = 'past';
								$scope.styl1 = 'past';
								$scope.styl2 = 'past';
								$scope.styl3 = 'current';
							}
							if($scope.invoiceFPur.status == statusAttr[4]){
								$scope.styl0 = 'past';
								$scope.styl1 = 'past';
								$scope.styl2 = 'past';
								$scope.styl3 = 'past';
								$scope.styl4 = 'current';
							}
					}
					scheduleStyle();
					
				}), function(){
					toaster('提示', '获取出货单详情失败');
				};
			};
			loadData();
		}]);
	

				// 物流信息
			app.register.controller('listLogisticsCtrl', ['$scope', '$modal', 'ResponseLogistics', '$modalInstance', 'logistics', 'KdnLogistics', 'toaster', function($scope, $modal, ResponseLogistics, $modalInstance, logistics, KdnLogistics, toaster) {
						$scope.Info = [];
						$scope.getlogistics = function() {
							var params = {};
							params.companyName = logistics.companyName;
							params.logisticsCode = logistics.number;
							KdnLogistics.kdnQuery(params, {}, function(response){
								if(!response.errorInfo) {
									$scope.Info = eval ("(" + response.traces + ")");
									// statusOfLogistics($scope.logisticsInfo[$scope.logisticsInfo.length - 1].AcceptStation);
								}
							}, function(){
								// $scope.Info = [];
								toaster.pop('info', '查询物流信息失败,请核对物流公司和运单号');
							});
							// ResponseLogistics.get({id : lgtid}, {}, function(data) {
							// 	$scope.Info = data;
							// 	console.log(data);
							// });
						};
						$scope.getlogistics();
						$scope.cancel = function() {
							$modalInstance.dismiss();
						}
					} ]);
	});