define([ 'app/app' ], function(app) {
	//订单详情
	app.register.controller('TradeOrderDetailCtrl', ['$scope', 'ngTableParams', 'toaster', '$stateParams', 'Order', 'InvoiceFPurchase', 'Purchase', 'Logistics', 'ComponentActive', function($scope, ngTableParams, toaster, $stateParams, Order, InvoiceFPurchase, Purchase, Logistics, ComponentActive) {
		var loadData = function(){
			//根据订单号获取订单详情
			Order.getOrderDetail({orderid:$stateParams.orderid}, {}, function(data){
				$scope.orderDetailInfo = data;
				$scope.invoiceAddress = angular.fromJson($scope.orderDetailInfo.invoiceAddress);
				$scope.address = angular.fromJson($scope.orderDetailInfo.jsonAddress);
				$scope.statushistory = angular.fromJson($scope.orderDetailInfo.statushistory);
				
				//根据快递id获取快递信息
				var lgtid = $scope.orderDetailInfo.lgtId;
				var getLogistics = function(){
					Logistics.findLogisticsById({lgtid: lgtid}, {}, function(data){
						$scope.logistics = data;
					}),function(){
						toaster.pop("error", "未能获取快递信息");
					};
				}
				if(lgtid){
					getLogistics();
				}
				
				//控制流程状态样式
				var scheduleStyle = function(){ 
					var statusAttr =['501', '503', '504', '406', '403', '407', '408', '404', '405'];
						if($scope.orderDetailInfo.status == statusAttr[0]){
								$scope.styl0 = 'on';
								$scope.styl1 = 'no';
								$scope.styl2 = 'no';
								$scope.styl3 = 'no';
								$scope.styl4 = 'no';
								$scope.styl5 = 'no';
								$scope.styl6 = 'no';
								$scope.styl7 = 'no';
								$scope.styl8 = 'no';
						}
						if($scope.orderDetailInfo.status == statusAttr[1]){
							$scope.styl0 = 'already';
							$scope.styl1 = 'on';
							$scope.styl2 = 'no';
							$scope.styl3 = 'no';
							$scope.styl4 = 'no';
							$scope.styl5 = 'no';
							$scope.styl6 = 'no';
							$scope.styl7 = 'no';
							$scope.styl8 = 'no';
						}
						if($scope.orderDetailInfo.status == statusAttr[2]){
							$scope.styl0 = 'already';
							$scope.styl1 = 'already';
							$scope.styl2 = 'on';
							$scope.styl3 = 'no';
							$scope.styl4 = 'no';
							$scope.styl5 = 'no';
							$scope.styl6 = 'no';
							$scope.styl7 = 'no';
							$scope.styl8 = 'no';
						}
						if($scope.orderDetailInfo.status == statusAttr[3]){
							$scope.styl0 = 'already';
							$scope.styl1 = 'already';
							$scope.styl2 = 'already';
							$scope.styl3 = 'on';
							$scope.styl4 = 'no';
							$scope.styl5 = 'no';
							$scope.styl6 = 'no';
							$scope.styl7 = 'no';
							$scope.styl8 = 'no';
						}
						if($scope.orderDetailInfo.status == statusAttr[4]){
							$scope.styl0 = 'already';
							$scope.styl1 = 'already';
							$scope.styl2 = 'already';
							$scope.styl3 = 'already';
							$scope.styl4 = 'on';
							$scope.styl5 = 'no';
							$scope.styl6 = 'no';
							$scope.styl7 = 'no';
							$scope.styl8 = 'no';
						}
						if($scope.orderDetailInfo.status == statusAttr[5]){
							$scope.styl0 = 'already';
							$scope.styl1 = 'already';
							$scope.styl2 = 'already';
							$scope.styl3 = 'already';
							$scope.styl4 = 'already';
							$scope.styl5 = 'on';
							$scope.styl6 = 'no';
							$scope.styl7 = 'no';
							$scope.styl8 = 'no';
						}
						if($scope.orderDetailInfo.status == statusAttr[6]){
							$scope.styl0 = 'already';
							$scope.styl1 = 'already';
							$scope.styl2 = 'already';
							$scope.styl3 = 'already';
							$scope.styl4 = 'already';
							$scope.styl5 = 'already';
							$scope.styl6 = 'on';
							$scope.styl7 = 'no';
							$scope.styl8 = 'no';
						}
						if($scope.orderDetailInfo.status == statusAttr[7]){
							$scope.styl0 = 'already';
							$scope.styl1 = 'already';
							$scope.styl2 = 'already';
							$scope.styl3 = 'already';
							$scope.styl4 = 'already';
							$scope.styl5 = 'already';
							$scope.styl6 = 'already';
							$scope.styl7 = 'on';
							$scope.styl8 = 'no';
						}
						if($scope.orderDetailInfo.status == statusAttr[8]){
							$scope.styl0 = 'already';
							$scope.styl1 = 'already';
							$scope.styl2 = 'already';
							$scope.styl3 = 'already';
							$scope.styl4 = 'already';
							$scope.styl5 = 'already';
							$scope.styl6 = 'already';
							$scope.styl7 = 'already';
							$scope.styl8 = 'on';
						}
				}
				scheduleStyle();

				//这里不需要获取器件的信息， 因为订单明细带有img uuid
				//根据批次号获取标准元器件信息
				// var details = $scope.orderDetailInfo.orderDetails;
				// var getComponent = function() {
				// 	angular.forEach(details, function(detail){
				// 		ComponentActive.getByBatchCode({batchCode:detail.batchCode}, {}, function(comp){
				// 			detail.img = comp.img;
				// 			detail.uuid = comp.uuid
				// 		});
				// 	})
				// };
				// getComponent();
				
				//根据银行信息id获取银行信息
				var banktfid = $scope.orderDetailInfo.banktfid;
				var getBankInfo = function() {
					if(!banktfid) {
						return ;
					}
					Order.getBankInfo({banktfid: banktfid}, {}, function(data){
						$scope.receiveBankInfo = angular.fromJson(data.jsonReceive);
						$scope.pamentBankInfo = angular.fromJson(data.jsonPament);
						$scope.transferTime = data.transferTime;
						$scope.imgUrl = data.imgUrl;
					});
				}
				getBankInfo();

				
				//根据转的发货单id获取发货单信息
				var inid = $scope.orderDetailInfo.inid;
				var getInvoiceFOrder = function() {
					InvoiceFPurchase.getInvoiceFOrder({inid: inid}, {}, function(data) {
						$scope.inFor = data;
					});
				}
				if(inid){
					getInvoiceFOrder();
				}
				
				//根据采购单id获取采购单信息
				var puid = $scope.orderDetailInfo.puid;
				var getPurchase = function() {
					Purchase.getPurchase({puid: puid}, {}, function(data){
						$scope.purc = data;
					});
				}
				if(puid){
					getPurchase();
				}
			}),function(){
				toaster.pop('error', '获取订单详情失败', data);				
			};
		};
		loadData();
	}]);
});