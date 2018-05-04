define([ 'app/app' ], function(app) {
	//订单详情
	app.register.controller('TradePurchaseDetailCtrl', ['$scope', 'ngTableParams', 'toaster', '$stateParams', 'Purchase', 'Logistics', 'InvoiceFPurchase', 'ComponentActive', '$modal', 'BaseService', function($scope, ngTableParams, toaster, $stateParams, Purchase, Logistics, InvoiceFPurchase, ComponentActive, $modal, BaseService) {
		var loadData = function(){
			//根据订单号获取订单详情
			Purchase.getPurchaseDetail({purchaseid:$stateParams.purchaseid}, {}, function(data){
				$scope.purchaseDetailInfo = data;
				$scope.address = angular.fromJson($scope.purchaseDetailInfo.jsonAddress);
				$scope.statushistory = angular.fromJson($scope.purchaseDetailInfo.statushistory);
				
				//根据快递单id获取快递信息
				var lgtid = $scope.purchaseDetailInfo.lgtId;
				var getLogistics = function(){
					Logistics.findLogisticsById({lgtid: lgtid}, {}, function(data){
						$scope.logistics = data;
					});
				}
				if(lgtid != null){
					getLogistics();
				}

				//查看物流详情
				$scope.listLogistics = function(data){
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
				};

				// 打印
				$scope.print = function (purchase, type) {
					var rootPath = BaseService.getRootPath();
					window.open(rootPath + '/report/print?reportName=' + type + '&whereCondition=' + "where trade$purchase.id=" + purchase.id);
				};

				//控制流程状态样式
				var scheduleStyle = function(){
					var statusAttr =['406', '404', '405', '503', '504'];
					if($scope.purchaseDetailInfo.status == statusAttr[0]){
							$scope.styl0 = 'current';
					}
					if($scope.purchaseDetailInfo.status == statusAttr[1]){
						$scope.styl0 = 'past';
						$scope.styl1 = 'current';
					}
					if($scope.purchaseDetailInfo.status == statusAttr[2]){
						$scope.styl0 = 'past';
						$scope.styl1 = 'past';
						$scope.styl2 = 'current';
					}
					if($scope.purchaseDetailInfo.status == statusAttr[3]) {
						$scope.styl0 = 'past';
						$scope.styl1 = 'past';
						$scope.styl2 = 'past';
						$scope.styl3 = 'current';
					}
					if($scope.purchaseDetailInfo.status == statusAttr[4]) {
						$scope.styl0 = 'past';
						$scope.styl1 = 'past';
						$scope.styl2 = 'past';
						$scope.styl3 = 'past';
						$scope.styl4 = 'current';
					}
				}
				scheduleStyle();
				
				//根据批次号获取标准元器件信息
				var details = $scope.purchaseDetailInfo.purchaseDetails;
				var getComponent = function() {
					angular.forEach(details, function(detail){
						ComponentActive.getByBatchCode({batchCode:detail.batchCode}, {}, function(comp){
							detail.img = comp.img;
							detail.uuid = comp.uuid
						});
					})
				};
				getComponent();
				
				
				//根据转的发货单id获取发货单信息
				var inid = $scope.purchaseDetailInfo.inid;
				var getInvoiceFPurchase = function() {
					InvoiceFPurchase.getInvoiceFPu({id: inid}, {}, function(data) {
						$scope.inFpu = data;
					}, function() {
						toaster.pop('提示', '未录入发货单信息');
					});
				}
				getInvoiceFPurchase();

			}),function(){
				toaster.pop('error', '获取订单详情失败', data);				
			};
		};
		loadData();
	}]);
	
	app.register.controller('listLogisticsCtrl', [ '$scope', '$modal', 'ResponseLogistics', '$modalInstance', 'logistics', 'KdnLogistics', 'toaster', function($scope, $modal, ResponseLogistics, $modalInstance, logistics, KdnLogistics, toaster){
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
	}]);
});