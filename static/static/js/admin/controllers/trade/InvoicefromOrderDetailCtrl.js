define([ 'app/app' ], function(app) {
	app.register.controller('InvoicefromOrderDetailCtrl', ['$scope', '$anchorScroll', '$location' , 'ngTableParams', 'InvoiceFOrder', 'toaster', '$stateParams', 'ComponentActive', '$modal', function($scope, $anchorScroll, $location , ngTableParams, InvoiceFOrder, toaster, $stateParams, ComponentActive, $modal) {
			//获取卖家出货单订单详情
			var loadData = function(){
				InvoiceFOrder.getInvoiceFOrder({invoiceid: $stateParams.invoiceid}, {}, function(data){
					$scope.invoiceFOrder = data;
					//状态变更记录
					$scope.statushistory = angular.fromJson($scope.invoiceFOrder.statushistory);
					
					//地址
					$scope.address = angular.fromJson($scope.invoiceFOrder.jsonSpAddress);
					
					//物流信息
					$scope.logistics = angular.fromJson($scope.invoiceFOrder.logistics);
					console.log($scope.logistics);
//					$scope.logisticsDetail = angular.fromJson($scope.logistics.companyName);
					
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
					var details = $scope.invoiceFOrder.invoiceFOrderDetails;
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
					var scheduleStyle = function(){ 
						var statusAttr =['406', '404', '405', '503', '504'];
							if($scope.invoiceFOrder.status == statusAttr[0]){
									$scope.styl0 = 'current';
							}
							if($scope.invoiceFOrder.status == statusAttr[1]){
								$scope.styl0 = 'past';
								$scope.styl1 = 'current';
							}
							if($scope.invoiceFOrder.status == statusAttr[2]){
								$scope.styl0 = 'past';
								$scope.styl1 = 'past';
								$scope.styl2 = 'current';
							}
							if($scope.invoiceFOrder.status == statusAttr[3]){
								$scope.styl0 = 'past';
								$scope.styl1 = 'past';
								$scope.styl2 = 'past';
								$scope.styl3 = 'current';
							}
							if($scope.invoiceFOrder.status == statusAttr[4]){
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
						}
					}, function(){
						// $scope.Info = [];
						toaster.pop('info', '查询物流信息失败,请核对物流公司和运单号');
					});
					// ResponseLogistics.get({
					// 	id : lgtid
					// }, {}, function(data) {
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