define([ 'app/app' ], function(app) {
	app.register.controller('MyRefundDoneDetailCtrl', ['$scope', 'refundService', '$stateParams', '$location', 'toaster', 'EncryptionService', '$modal', 'BaseService', 'Invoice', function($scope, refundService, $stateParams, $location, toaster, EncryptionService, $modal, BaseService, Invoice) {
		BaseService.scrollBackToTop();

		// 单据来源类型和单据名称映射
		$scope.typeMap = {
			'ORDER'		: "订单",
			'PURCHASE'	: "采购单",
			'RETURN'	: "客户退货单"
		};

		refundService.getRefundByRefundId({refundId : $stateParams.refundId}, function(data) {
			$scope.refund = data;
			$scope.address = angular.fromJson($scope.refund.jsonAddress); // 收货地址
			$scope.sdaddress = angular.fromJson($scope.refund.jsonSdAddress); // 发货地址
			$scope.logistics = angular.fromJson($scope.refund.logistics); // 物流信息
			$scope.statushistory = angular.fromJson($scope.refund.statusHistory); // 状态变更记录

			//查看物流详情
			$scope.listLogistics = function(data){
				var lgtid = $scope.logistics.id;
				var modalInstance = $modal.open({
					animation: true,
					templateUrl: 'static/view/usercenter/listLogistics.html',
					controller: 'listLogisticsCtrl',
					resolve: {
						lgtid: function() {
							return lgtid;
						}
					}
				});
				modalInstance.result.then(function(response){

				}, function(){

				});
			};

			//控制流程状态样式
			var status = $scope.refund.status;
			var scheduleStyle = function(){
				var statusAttr =['TOBEREFUND', 'REFUNDED'];
				if(status == statusAttr[0]){
					$scope.styl0 = true;
					$scope.last0 = true;
				}
				if(status == statusAttr[1]){
					$scope.styl0 = true;
					$scope.styl1 = true;
					$scope.styl1 = true;
				}
			};
			scheduleStyle();

			getInvoiceBySourceid($scope.refund.reid);

		}, function(res) {
			toaster.pop('error', '提示', '获取退货单信息失败');
		});

		// 买家根据换货单号获取商城针对买家换货单发货给买家的出货单
		var getInvoiceBySourceid = function (changeId) {
			Invoice.getInvoiceBySourceid({changeId: changeId}, null, function (data) {
				$scope.invoiceFromMall = data;
				$scope.logisticsFromMall = angular.fromJson($scope.invoiceFromMall.logistics); // 物流信息
				$scope.stateHistoryFromMall = angular.fromJson($scope.invoiceFromMall.statushistory);
			}, function (error) {
				toaster.pop('error', '获取商城换货出货单信息失败', error.data);
			})
		}
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
