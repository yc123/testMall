define([ 'app/app' ], function(app) {
	//订单详情
	app.register.controller('curPurchaseDetailCtrl', ['$scope', 'ngTableParams', 'toaster', '$stateParams', 'Purchase', 'Logistics', 'InvoiceFPurchase', 'ComponentActive', 'BaseService', function($scope, ngTableParams, toaster, $stateParams, Purchase, Logistics, InvoiceFPurchase, ComponentActive, BaseService) {
		BaseService.scrollBackToTop();
		
		var loadData = function(){
			//根据订单号获取订单详情
			Purchase.EntPurchaseDetail({purchaseid:$stateParams.purchaseid}, {}, function(data){
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
				
				//控制流程状态样式
				var scheduleStyle = function(){ 
					var statusAttr =['406', '404', '405', '503', '504'];
						if($scope.purchaseDetailInfo.status == statusAttr[0]){
								$scope.styl0 = 'past';
								$scope.last0 = 1;
						}
						if($scope.purchaseDetailInfo.status == statusAttr[1]){
							$scope.styl0 = 'past';
							$scope.styl1 = 'past';
							$scope.last1 = 1;
						}
						if($scope.purchaseDetailInfo.status == statusAttr[2]){
							$scope.styl0 = 'past';
							$scope.styl1 = 'past';
							$scope.styl2 = 'past';
							$scope.last2 = 1;
						}
						if($scope.purchaseDetailInfo.status == statusAttr[3]){
							$scope.styl0 = 'past';
							$scope.styl1 = 'past';
							$scope.styl2 = 'past';
							$scope.styl3 = 'past';
							$scope.last3 = 1;
						}
						if($scope.purchaseDetailInfo.status == statusAttr[4]){
							$scope.styl0 = 'past';
							$scope.styl1 = 'past';
							$scope.styl2 = 'past';
							$scope.styl3 = 'past';
							$scope.styl4 = 'past';
							$scope.last4 = 1;
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

		/*var cmps = [];
		angular.forEach($scope.orderDetailInfo.orderDetails, function(detail, k) {
			if(cmps.indexOf(detail.cmpCode) === -1) {
				$scope.cmpNum++;
				cmps.push(detail.cmpCode);
			}
		});*/
	}]);
});