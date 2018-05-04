define([ 'app/app' ], function(app) {
	//订单详情
	app.register.controller('TradePaymentDetailCtrl', ['$scope', 'ngTableParams', 'toaster', '$stateParams', 'Payment', 'Purchase', '$modal', 'BaseService', function($scope, ngTableParams, toaster, $stateParams, Payment, Purchase, $modal, BaseService) {

		//控制流程状态样式
		var scheduleStyle = function(paymentInfo) {
			var statusAttr = ['514', '515'];
			if (paymentInfo.status == statusAttr[0]) {
				console.log(paymentInfo.status);
				$scope.styl0 = 'current';
			}
			if (paymentInfo.status == statusAttr[1]) {
				$scope.styl0 = 'past';
				$scope.styl1 = 'current';
			}
		}
		var loadData = function(){
			//根据申请号获取订单详情
			Payment.findByRequestId({ requestId:$stateParams.requestId }, {}, function(data){
				$scope.paymentInfo = data;
				console.log($scope.paymentInfo.status);
				//根据details获取采购单信息
				var details = $scope.paymentInfo.details;
				Payment.findPurchaseDetails({ details : details },function (data) {
					$scope.purchaseDetails = data;
				});
				scheduleStyle($scope.paymentInfo);
			}),function(){
				toaster.pop('error', '获取订单详情失败', data);				
			};
			Purchase.findBankTransfer({ requestId : $stateParams.requestId }, function (data) {
				$scope.transferInfo = data;
				console.log($scope.transferInfo);
				$scope.payAccount = angular.fromJson(data.jsonPament);
				$scope.receiveAccount = angular.fromJson(data.jsonReceive);
			});
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