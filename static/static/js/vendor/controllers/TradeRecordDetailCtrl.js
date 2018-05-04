define([ 'app/app' ], function(app) {

	//入库单详情
	app.register.controller('TradeRecordDetailCtrl', ['$scope', '$location', 'BaseService' , 'ngTableParams', 'Receipt', 'toaster', '$stateParams', '$filter', function($scope, $location, BaseService ,ngTableParams, Receipt, toaster, $stateParams, $filter) {
		BaseService.scrollBackToTop();
		
		var enIdFilter = $filter('EncryptionFilter');
		Receipt.getReceipt({receiptid: $stateParams.receiptid}, {}, function(data){
			$scope.receipt = data;
			console.log($scope.receipt);

			//状态变更记录
			$scope.statushistory = angular.fromJson($scope.receipt.statushistory);
			
			//地址
			$scope.address = angular.fromJson($scope.receipt.jsonAddress);
			
		}, function(response) {
			toaster.pop('error', '提示', '获取出入库单失败');
		});
		
		// 跳转到来源单详情页
		$scope.toDetail = function(receipt) {
			switch(receipt.sourceType) {
				case "供应商出货单" :
					$location.url("invoice/" + receipt.sourceid); break;
				case "供应商换货出货单" :
					$location.url("invoiceChange/" + enIdFilter(receipt.sourceid)); break;
				case "平台退货单" :
					$location.url("invoice/" + receipt.sourceid); break;
				case "平台换货单" :
					$location.url("invoice/" + receipt.sourceid); break;
			}
		};
	}]);
});