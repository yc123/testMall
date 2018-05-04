define([ 'app/app' ], function(app) {
	'use strict';
	
	/*订单确认后，待付款页面*/
	app.register.controller('OrderEnsuredCtrl', [ '$scope', '$stateParams', '$location', '$modal', 'toaster', 'Order', function($scope, $stateParams, $location, $modal, toaster, Order) {
		
		$scope.orderid =  $stateParams.orderid;
		
		//加载订单数据
		Order.query({orderid: $scope.orderid}, function(data){
			$scope.order = data;
			//检查订单状态
			if(data[0].status != 503){
				/*TODO 订单无效的逻辑*/
				toaster.pop('error', '错误', '此订单状态不为待付款');
			}
		}, function(res){
			toaster.pop('error', '系统错误', '获取订单信息失败');
		});
		
		$scope.time = 5;
		var setTime = function() {
			if($scope.time > 0) {
				setTimeout(function() {
					$scope.$apply(function() {
						$scope.time--;
						setTime();
					});
				}, 1000);
			}else {
				window.location.replace('user#/home/myOrder_transfer');
			}
		};
		
		setTime();
		
	}]);
	
});