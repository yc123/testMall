define([ 'app/app' ], function(app) {
	//订单详情
	app.register.controller('OrderDetailCtrl', ['$scope', '$rootScope', 'ngTableParams', 'toaster', '$stateParams', 'Order', 'Logistics', 'ComponentActive', '$modal', 'BaseService', function($scope, $rootScope, ngTableParams, toaster, $stateParams, Order, Logistics, ComponentActive, $modal, BaseService) {
		BaseService.scrollBackToTop();
		
		var initOrder = function(data) {
			$scope.orderDetailInfo = data;
			if (!$scope.orderDetailInfo.buyerTel) {
				$scope.orderDetailInfo.buyerTel = $rootScope.userInfo.userTel;
			}
			$scope.buyAccount = angular.fromJson($scope.orderDetailInfo.buyaccount);
			$scope.sellerAccount = angular.fromJson($scope.orderDetailInfo.selleraccount);
			$scope.address = angular.fromJson($scope.orderDetailInfo.jsonAddress);
			$scope.orderDetailInfo.invoiceAddress = angular.fromJson($scope.orderDetailInfo.invoiceAddress);
			$scope.cmpNum = 0;
			var cmps = [];
			angular.forEach($scope.orderDetailInfo.orderDetails, function(detail, k) {
				if(cmps.indexOf(detail.cmpCode) === -1) {
					$scope.cmpNum++;
					cmps.push(detail.cmpCode);
				}
			});
		};
		
		//根据卖家uu获取卖家信息
		var getSellerInfo = function(){
			Order.getSellerInfo({sellerenuu : $scope.orderDetailInfo.sellerenuu}, function(data){
				$scope.seller = data;
			});
		};
		
		//根据快递id获取快递信息
		var getLogistics = function(lgtid){
			Logistics.findLogisticsById({lgtid: lgtid}, function(data){
				$scope.logistics = data;
				//查看物流详情
				$scope.listLogistics = function(data){
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
			});
		};
		
		//根据批次号获取标准元器件信息
		var getComponent = function(details) {
			angular.forEach(details, function(detail){
				ComponentActive.getByBatchCode({batchCode:detail.batchCode}, {}, function(comp){
					detail.img = comp.img;
					detail.uuid = comp.uuid
				});
			})
		};
		
		//根据银行信息id获取银行信息
		var getBankInfo = function(banktfid) {
			Order.getBankInfo({banktfid: banktfid}, {}, function(data){
				$scope.receiveBankInfo = angular.fromJson(data.jsonReceive);
				$scope.pamentBankInfo = angular.fromJson(data.jsonPament);
				$scope.transferTime = data.transferTime;
				//$scope.imgUrl = data.imgUrl;
			},function(){
				toaster.pop("提示", "获取银行信息失败");
			});
		};
		
		// 打印订单
		/**	1.  模板上传路径http://192.168.253.60:8090/report/fileUpload?userName=B2C
		 * 	2.  打印示例路径http://192.168.253.60:8090/report/print?userName=B2C&reportName=order&whereCondition=where rownum<10&printType=PREVIEW 
		 * 	2.1 userName：账套名，B2C项目调用时userName=B2C
		 * 	2.2 reportName：报表名，即模板名称order.jrxml去掉后缀
		 * 	2.3 whereCondition：where之后的条件，包括where
		 * 	2.4 printType:打印类型，默认为PREVIEW
		 * 		printType=PDF 直接下载PDF
		 * 		printType=EXCEL 直接下载纯数据EXCEL
		 * 		printType=PRINT 直接打印
		 * 		printType=PREVIEW 进入预览
		 */
		$scope.printOrder = function(orderDetail) {
			if (orderDetail.status == 501) {
				toaster.pop('info', '请确认订单之后再打印订单');
			} else if (orderDetail.status == 602) {
				toaster.pop('info', '失效的未确认订单无法打印');
			} else {
				var rootPath = BaseService.getRootPath();
				if (orderDetail.paytype == 1103) {
					window.open(rootPath + "/report/print?reportName=order&orderId=" + orderDetail.orderid);
				} else if (orderDetail.paytype == 1102) {
					window.open(rootPath + "/report/print?reportName=order_online&orderId=" + orderDetail.orderid);
				}
			}
		};
		
		//控制流程状态样式
		var scheduleStyle = function(statu){ 
			var statusAttr =['501', '503', '504', '406', '403', '407', '408', '404', '405','511'];
				if(statu == statusAttr[0]){
						$scope.styl0 = 'past';
						$scope.last0 = 1;
				}
				if(statu == statusAttr[1]){
					$scope.styl0 = 'past';
					$scope.styl1 = 'past';
					$scope.last1 = 1;
				}
				if(statu == statusAttr[2] || statu == statusAttr[3] || statu == statusAttr[4] || statu == statusAttr[5] || statu == statusAttr[6]){
					$scope.styl0 = 'past';
					$scope.styl1 = 'past';
					$scope.styl2 = 'past';
					$scope.last2 = 2;
				}
				if(statu == statusAttr[7]) {
					$scope.styl0 = 'past';
					$scope.styl1 = 'past';
					$scope.styl2 = 'past';
					$scope.styl3 = 'past';
					$scope.last3 = 3;
				}
				// 已完成订单状态流转
				if(statu == statusAttr[8]) {
					$scope.styl0 = 'past';
					$scope.last0 = 1;
				}
				if(statu == statusAttr[9]) {
					$scope.styl0 = 'past';
					$scope.styl1 = 'past';
					$scope.last1 = 2;
				}
		};
		
		var loadData = function(){
			Order.getBuyerOrderDetail({orderid:$stateParams.orderid}, {}, function(data){
				initOrder(data);
				getSellerInfo();
				var lgtid = $scope.orderDetailInfo.lgtId;
				if(lgtid != null){
					getLogistics(lgtid);
				}
				var details = $scope.orderDetailInfo.orderDetails;
				getComponent(details);
				var banktfid = $scope.orderDetailInfo.banktfid;
				if(banktfid != null){
					getBankInfo(banktfid);
				}
				var statu = $scope.orderDetailInfo.status;
				scheduleStyle(statu);
			},function(){
				toaster.pop('error', '获取订单详情失败', data);
			});
		};
		loadData();
	}]);
	
});