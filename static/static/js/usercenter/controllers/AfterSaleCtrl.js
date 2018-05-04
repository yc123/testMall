define([ 'app/app' ], function(app) {
	
	app.register.controller('AfterSaleCtrl', ['$scope', 'ngTableParams', 'BaseService','Order', 'Return', 'Change' ,'$stateParams','$location', 'toaster' , function($scope, ngTableParams, BaseService, Order, Return , Change , $stateParams, $location ,toaster) {
		BaseService.scrollBackToTop();	
		$scope.hasOrder = false;
			var loaddata = function() {
				if($stateParams.orderid) {
					var loadorder = function(){
						Order.findByCode({orderid:$stateParams.orderid}, function(data) {
							$scope.order = data;
							angular.forEach($scope.order.orderDetails, function(detail) {
								if(!detail.custreturnQty) {
									detail.custreturnQty = 0;
								}
								detail.realQty = detail.number - detail.custreturnQty;
								detail.returnQty = 0;
							});
						}, function(response) {
							toaster.pop('error', '获取订单信息失败：' + response.text);
						});
					}
					loadorder();
					$scope.hasOrder = true;
					$scope.selectDelivery = function(type) {
						if(type == 1301) {
							$scope.returnresurt = true;
							$scope.changeresurt = false;
							$scope.updatePackage = function(qty, number) {
								if(qty>number) {
									loadorder();
									toaster.pop('error', '退货数量不能大于此明细总数量:' + number);	
								}else if(qty< 0) {
									loadorder();
									toaster.pop('error', '退货数量小于0');	
								}
							}
						}else {
							$scope.returnresurt = false;
							$scope.changeresurt = true;
							$scope.updateChange = function(qty,number) {
								if(qty>number) {
									loadorder();
									toaster.pop('error', '换货数量不能大于此明细总数量:' + number);	
								}else if(qty< 0) {
									loadorder();
									toaster.pop('error', '换货数量小于0');	
								}
							}
						}
					}
				}
			}
			loaddata();
			
			/**
			 * 确认退货单
			 */
			$scope.ensureReturn = function(order) {
				if(!checkReturnQty(order)) {
				Return.ensureReturn({}, order, function(data) {
					$scope.loading = true;
					toaster.pop('success', '处理成功,您已成功退货！');
					$scope.timeseconds = 3;
					var setTime = function() {
						if($scope.timeseconds > 0) {
							setTimeout(function() {
								$scope.$apply(function() {
									$scope.timeseconds--;
									setTime();
								});
							}, 1000);
						}else {
							window.location.replace('user#/home/myReturn_done');
						}
					}
					setTime();
					}, function(res) {
						toaster.pop('error', '失败！');
					});
				}else {
					toaster.pop('error', '填写错误，您重新填写退货数量！');
				}
			}
			/**
			 * 确认换货单
			 */
			$scope.ensureChange = function(order) {
				if(!checkChangeQty(order)) {
					Change.ensureChange({}, order, function(data) {
						$scope.loading = true;
						toaster.pop('success', '处理成功');
						$scope.timeseconds = 3;
						var setTime = function() {
							if($scope.timeseconds > 0) {
								setTimeout(function() {
									$scope.$apply(function() {
										$scope.timeseconds--;
										setTime();
									});
								}, 1000);
							}else {
								window.location.replace('user#/home/myChange_done');
							}
						}
						setTime();
					}, function(res) {
						toaster.pop('error', '失败！');
					});
				}else {
					toaster.pop('error', '填写错误，您重新填写换货数量！');
				}
			}
			/**
			 * 确认时在此判断判断用户输入(不能为null，不能大于总数量-已退货数量，不能全部都为0,)
			 */
			var checkReturnQty = function(order) {
				var blag = true ;
				for(var i=0;i<order.orderDetails.length;i++) {
					if(order.orderDetails[i].returnQty == null) {
						blag = true;
						break;
					}
					if (blag) {
						if(!order.orderDetails[i].custreturnQty) {
							order.orderDetails[i].custreturnQty = 0;
						}
						if (order.orderDetails[i].returnQty > 0 && order.orderDetails[i].returnQty <= order.orderDetails[i].number - order.orderDetails[i].custreturnQty) {
							blag = false;
						}
					}
				}
				return blag
			}
			/**
			 * 确认时在此判断判断用户输入(不能为null，不能大于总数量-已退货数量，不能全部都为0,)
			 */
			var checkChangeQty = function(order) {
				var blag = true ;
				for(var i=0;i<order.orderDetails.length;i++) {
					if(order.orderDetails[i].returnQty == null) {
						blag = true;
						break;
					}
					if (blag) {
						if (!order.orderDetails[i].custreturnQty) {
							order.orderDetails[i].custreturnQty = 0;
						}
						if (!order.orderDetails[i].custchangeQty) {
							order.orderDetails[i].custchangeQty = 0;
						}
						if (order.orderDetails[i].returnQty > 0 && order.orderDetails[i].returnQty <= order.orderDetails[i].number - order.orderDetails[i].custreturnQty) {
							blag = false;
						}
					}
				}
				return blag
			}

			
	}]);
});