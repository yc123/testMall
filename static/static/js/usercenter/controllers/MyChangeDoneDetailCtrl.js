define([ 'app/app' ], function(app) {
	app.register.controller('MyChangeDoneDetailCtrl', ['$scope', 'Change', '$stateParams', '$location', 'toaster', 'EncryptionService', '$modal', 'BaseService', 'Invoice', function($scope, Change, $stateParams, $location, toaster, EncryptionService, $modal, BaseService, Invoice) {
		BaseService.scrollBackToTop();
		
		Change.findByChangeId({changeid : $stateParams.changeid}, function(data) {
			$scope.change = data;
			$scope.address = angular.fromJson($scope.change.jsonAddress); // 收货地址
			$scope.sdaddress = angular.fromJson($scope.change.jsonSdAddress); // 发货地址
			$scope.logistics = angular.fromJson($scope.change.logistics); // 物流信息
			var statushistory = angular.fromJson($scope.change.statushistory); // 状态变更记录
			var history = [];
			angular.forEach(statushistory, function(data) {
				if (data.status == '311' || data.status == '103' || data.status == '409' || data.status == '404'|| data.status == '405'|| data.status == '403') {
					history.push(data);
				}
			});
			
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
			}
			
			$scope.statushistory = history;
			//控制流程状态样式
			var statu = $scope.change.status;
			var scheduleStyle = function(){ 
				var statusAttr =['311', '103', '409', '410', '406', '403','407','408', '404', '405'];
					if(statu == statusAttr[0]){
						$scope.styl0 = 'past';
						$scope.last0 = 1;	
					}
					if(statu == statusAttr[1]){
						$scope.styl0 = 'past';
						$scope.styl5 = 'past';
						$scope.last5 = 1;
				}
					if(statu == statusAttr[2]){
						$scope.styl0 = 'past';
						$scope.styl1 = 'past';
						$scope.last1 = 1;
					}
					
					if(statu == statusAttr[3] || statu == statusAttr[4] || statu == statusAttr[5] || statu == statusAttr[6] || statu == statusAttr[7]){
						$scope.styl0 = 'past';
						$scope.styl1 = 'past';
						$scope.styl2 = 'past';
						$scope.last2 = 1;
					}
					if(statu == statusAttr[8]){
						$scope.styl0 = 'past';
						$scope.styl1 = 'past';
						$scope.styl2 = 'past';
						$scope.styl3 = 'past';
						$scope.last3 = 1;
					}
					if(statu == statusAttr[9]){
						$scope.styl0 = 'past';
						$scope.styl1 = 'past';
						$scope.styl2 = 'past';
						$scope.styl3 = 'past';
						$scope.styl4 = 'past';
						$scope.last4 = 1;
					}
			};
			scheduleStyle();

			getInvoiceBySourceid($scope.change.changeid);
			
		}, function(res) {
			toaster.pop('error', '提示', '获取退货单信息失败');
		})

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