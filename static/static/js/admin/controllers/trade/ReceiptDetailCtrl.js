define([ 'app/app' ], function(app) {

	//入库单详情
	app.register.controller('ReceiptDetailCtrl', ['$scope', '$anchorScroll', '$location', 'BaseService' , 'ngTableParams', 'Receipt', 'toaster', '$stateParams', function($scope, $anchorScroll, $location, BaseService ,ngTableParams, Receipt, toaster, $stateParams) {
		Receipt.getReceipt({receiptid: $stateParams.receiptid}, {}, function(data){
			$scope.receipt = data;
			console.log($scope.receipt);

			//状态变更记录
			$scope.statushistory = angular.fromJson($scope.receipt.statushistory);
			
			//地址
			$scope.address = angular.fromJson($scope.receipt.jsonAddress);
			
		})
	}]);
});