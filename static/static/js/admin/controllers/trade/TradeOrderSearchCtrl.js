define([ 'app/app' ], function(app) {
	//订单查询接口
	app.register.controller('TradeOrderSearchCtrl', ['$scope', 'ngTableParams', 'BaseService', 'toaster', '$stateParams', 'Order', function($scope, ngTableParams, BaseService ,toaster, $stateParams, Order) {
		
		$scope.flag = false;
		var clearDate = function () {
			delete $scope.order;
			delete $scope.user;
			delete $scope.vender;
			delete $scope.relationInfo;
		}
		//搜索
		$scope.onSearch = function () {
			if($scope.keyword) {
				var orid = $scope.keyword;
				Order.findUserVenderByCode({orderid:orid}, null, function(data) {
					$scope.flag = true;
					if(data.order) {
						$scope.order = data.order;
					}else {
						clearDate();
					};
					if(data.user) {
						$scope.user = data.user;
					};
					if(data.vender) {
						$scope.vender = data.vender[0];
						// console.log($scope.vender);
					};
					if(data.relationInfo) {
						$scope.relationInfo = data.relationInfo;
					}
				},function(res) {
					clearDate();
					toaster.pop('error', '未查询到订单信息', '请重新输入！');
				});
			}
		}
	
		
		
	}]);
});