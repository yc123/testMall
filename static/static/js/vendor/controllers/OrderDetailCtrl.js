define([ 'app/app' ], function(app) {
	//订单详情
	app.register.controller('OrderDetailCtrl', ['$scope', 'ngTableParams', 'toaster', '$stateParams', 'Order', 'BaseService', function($scope, ngTableParams, toaster, $stateParams, Order, BaseService) {
		BaseService.scrollBackToTop();
		
		var loadData = function(){
			Order.getBuyerOrderDetail({orderid:$stateParams.orderid}, {}, function(data){
				$scope.orderDetailInfo = data;
				$scope.address = angular.fromJson($scope.orderDetailInfo.jsonAddress);

				//根据批次号获取标准元器件信息
				var details = $scope.orderDetailInfo.orderDetails;
				var getComponentActive = function() {
					angular.forEach(details, function(detail){
						Order.getComponentActive({batchCode:detail.batchCode}, {}, function(comp){
							detail.img = comp.img;
							detail.uuid = comp.uuid
						});
					})
				};
				getComponentActive();
				
			}),function(){
				toaster.pop('error', '获取订单详情失败', data);				
			};
		};
		loadData();
	}]);
});