define([ 'app/app' ], function(app) {
	app.register.controller('OrderCtrl', function($scope, TableService, CustomerService, ProductService) {
		//订单资料初始化
		$scope.order = {
			type : '正常请购',
			date : new Date(),
			payment : '月结30天',
			orderItems : []
		};
		//订单明细table初始化
		TableService.init({
			scope : $scope,
			defaultItemsSize : 5
		}, {
			model : 'order.orderItems',
			rownumGenerator : 'number'
		});
		
		// 找客户
		$scope.getCustomer = function() {
			CustomerService.open().result.then(function(selected){
				if (selected) {
					$scope.order.customer = selected;
					if(!$scope.order.shipAddress)
						$scope.order.shipAddress = selected.customerEnterprise.enDeliverAddr
							|| selected.customerEnterprise.enAddress;
				}
			});
		};
		
		// 找物料
		$scope.getProduct = function(orderItem) {
			ProductService.open().result.then(function(selected){
				if (selected) {
					orderItem.product = selected;
				}
			});
		};
		
		// 订单明细有效行
		$scope.isItemInvalid = function(item) {
			return !item || !item.product || !item.qty || !item.price;
		};
		var getOrderItems = function() {
			var items = $scope.order.orderItems, valid = [];
			if(items) {
				angular.forEach(items, function(item){
					if(!$scope.isItemInvalid(item))
						valid.push(item);
				});
			}
			return valid;
		};
		
		// 订单是否无效
		$scope.isInvalid = function(order) {
			return !order.customer || !order.delivery || !order.shipAddress 
				|| !order.payment || !order.currency || !order.orderItems 
				|| getOrderItems().length == 0;
		};
	});
});