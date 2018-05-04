define(['app/app'], function(app) {
	'use strict';
	app.register.controller('HomeCtrl', ['$scope', 'toaster', 'VendorService', function($scope, toaster, VendorService) {
		var getVendorInfo = function(){
			VendorService.getVendorInfo(null, function(data){
				$scope.vendor = data;
				$scope.totalCount = 0;
				//获取待出货出货单数
				VendorService.getToBeShippedCount(null, function(count){
					$scope.toShippedCount = count.data;
					$scope.totalCount += parseInt($scope.toShippedCount);
					});		
				
				//获取待收货出货单数
				VendorService.getInboundCount(null, function(count){
						$scope.inboundCount = count.data;
						$scope.totalCount += parseInt($scope.inboundCount);
					});
				
				//获取待收款出货单数
				VendorService.getToMoneyCount(null, function(count){
						$scope.toMoneyCount = count.data;
						$scope.totalCount += parseInt($scope.toMoneyCount);
					});
			});
		}
		getVendorInfo();
		
		//将出货单状态设为待出货
		$scope.setTobeshipped = function() {
			window.sessionStorage.setItem('invoiceState', 'tobeshipped');
		}
		
		//将出货单状态设为待收货
		$scope.setInbound = function() {
			window.sessionStorage.setItem('invoiceState', 'inbound');
		}

		//将出货单状态设为待收款
		$scope.setToreceivemoney = function() {
			window.sessionStorage.setItem('invoiceState', 'toreceivemoney');
		}
		
	}]);
	
});