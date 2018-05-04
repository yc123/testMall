define(['app/app'], function(app) {
	'use strict';
	app.register.controller('orderBillAdminCtrl', ['$scope','toaster', 'BaseService', 'Order', 'ngTableParams', function($scope, toaster, BaseService, Order, ngTableParams) {
		BaseService.scrollBackToTop();
		
		$scope.active = 'toBeMakeOut';
		
		var getState = function() {
			var state = '700';
			switch($scope.active) {
				case 'prepare' :
					state = '699'; break;
				case 'toBeMakeOut' :
					state = '700'; break;
				case 'opened' :
					state = '702'; break;
				case 'needNo' :
					state = '703'; break;
			}
			return state;
		};
		
		$scope.setActive = function(status) {
			$scope.active = status;
			$scope.makeOutBillTableParams.page(1);
			$scope.makeOutBillTableParams.reload();
			$scope.fillBill = false;
			//记录当前选中的条数
			$scope.count = 0;
			
			$scope.sameInfo = {};
		}
		
		$scope.makeOutBillTableParams = new ngTableParams({
			page : 1,
			count : 5,
			sorting : {
				creattime : 'DESC'
			}
		}, {
			total : 0,
			counts : [5, 10, 25, 50, 100],
			getData : function($defer, params) {
				var param = BaseService.parseParams(params.url());
				param.keyword = $scope.keyword;
				param.status = getState();
				Order.getOrderOnBill(param, function(page) {
					for(var i = 0; i < page.content.length; i++) {
						//转发票发货信息地址
						page.content[i].invoiceAddress = angular.fromJson(page.content[i].invoiceAddress);
						//删除 不必要的数据，为匹配发票的收货地址匹配做准备
						if(page.content[i].invoiceAddress) {
							delete page.content[i].invoiceAddress.enuu;
							delete page.content[i].invoiceAddress.useruu;
							delete page.content[i].invoiceAddress.id;
						}
						for(var j = 0; j < page.content[i].orderDetails.length; j++) {
							page.content[i].orderDetails[j].realTradeNum = page.content[i].orderDetails[j].number - 
							(page.content[i].orderDetails[j].custreturnQty ? page.content[i].orderDetails[j].custreturnQty : 0);
							page.content[i].orderDetails[j].realPrice = page.content[i].orderDetails[j].realTradeNum* page.content[i].orderDetails[j].unitprice;
						}
					}
					if(page.content) {
						$defer.resolve(page.content);
						params.total(page.totalElements);
					}
				}, function(response) {
					toaster.pop('error', '获取待开票订单失败', response.data);
				});
			}
		});
		
		//根据采购单号搜索采购单
		$scope.onSearch = function() {
			$scope.makeOutBillTableParams.reload();
		}
		
		$scope.totalPrice = 0;
		$scope.fillBill = false;
		
		$scope.makeOutBill = function() {
			$scope.totalPrice = 0;
			if(!$scope.count) {
				toaster.pop('info', '请选中需要开票的明细!');
				return ;
			}else {
				$scope.billOrder = {};
				var orders = $scope.makeOutBillTableParams.data;
				for(var i = 0; i < orders.length; i++) {
					var arr = [];
					for(var j = 0; j < orders[i].orderDetails.length; j++) {
						var detail = orders[i].orderDetails[j];
						if(detail.checked) {
							arr.push(detail.detailid);
							$scope.totalPrice += detail.realPrice;
						}
					}
					if(arr.length != 0) {
						$scope.billOrder[orders[i].orderid] = arr;
					}
				}
				
				$scope.fillBill = true;
			}
		}
		
		var initSampleInfoAndCompare = function(order, orderDetail) {
			if(!$scope.sameInfo.invoicetitle || !$scope.count) {
				$scope.sameInfo.invoicetitle = order.invoicetitle;
				$scope.sameInfo.invoicetype = order.invoicetype;
				$scope.sameInfo.invoiceAddress = order.invoiceAddress;
			}else {
				if($scope.sameInfo.invoicetitle != order.invoicetitle) {
					toaster.pop('info', "发票的抬头不一致，不能批量开票");
					orderDetail.checked = false;
					return false;
				}
				if($scope.sameInfo.invoicetype != order.invoicetype) {
					toaster.pop('info', "发票类型不一致，不能批量开票");
					orderDetail.checked = false;
					return false;
				}
				if(!angular.equals($scope.sameInfo.invoiceAddress, order.invoiceAddress)) {
					toaster.pop('info', "发票收货地址不一致，不能批量开票");
					orderDetail.checked = false;
					return false;
				}
				
			}
			
			return true;
		}
		
		//记录当前选中的条数
		$scope.count = 0;
		
		$scope.sameInfo = {};
		
		$scope.selectOrder = function(order) {
			if(order.checked) {
				if(!$scope.sameInfo.invoicetitle || !$scope.count) {
					$scope.sameInfo.invoicetitle = order.invoicetitle;
					$scope.sameInfo.invoicetype = order.invoicetype;
					$scope.sameInfo.invoiceAddress = order.invoiceAddress;
				}else {
					if($scope.sameInfo.invoicetitle != order.invoicetitle) {
						toaster.pop('info', "发票的抬头不一致，不能批量开票");
						order.checked = false;
						return false;
					}
					if($scope.sameInfo.invoicetype != order.invoicetype) {
						toaster.pop('info', "发票类型不一致，不能批量开票");
						order.checked = false;
						return false;
					}
					if(!angular.equals($scope.sameInfo.invoiceAddress, order.invoiceAddress)) {
						toaster.pop('info', "发票收货地址不一致，不能批量开票");
						order.checked = false;
						return false;
					}
				}
				for(var i = 0; i < order.orderDetails.length; i++) {
					if(!order.orderDetails[i].checked && order.orderDetails[i].billStatus==700) {
						$scope.count++;
						order.orderDetails[i].checked = true;
					}
				}
			}else {
				for(var i = 0; i < order.orderDetails.length; i++) {
					if(order.orderDetails[i].checked) {
						$scope.count--;
					}
					order.orderDetails[i].checked = false;
				}
				
				if(!$scope.count) {
					$scope.sameInfo = {};
				}
			}
		}
		
		$scope.selectDetail = function(order, orderDetail) {
			if(orderDetail.checked) {
				var returnOrNot = initSampleInfoAndCompare(order, orderDetail);
				if(!returnOrNot) {
					return;
				}
				var result = true; //如果订单明细全部选中，则订单应该被选中
				for(var i = 0; i < order.orderDetails.length; i++) {
					if(!order.orderDetails[i].checked) {
						result = false;
						break;
					}
				}
				if(result) {
					order.checked=true;
				}
				$scope.count++;
			}else {
				$scope.count--;
				if(!$scope.count) {
					$scope.sameInfo = {};
				}
				
				//订单默认取消全选
				order.checked = false;
			}
		}
		
		$scope.cancle = function() {
			$scope.fillBill = false;
		}
		$scope.bill = {};
		$scope.bill.billNum = 0;
		$scope.confirmMakeBill = function() {
			if(!$scope.bill.billNum) {
				toaster.pop("info", "请输入发票流水号");
				return ;
			}
			Order.makeOutBill({billNum: $scope.bill.billNum}, $scope.billOrder, function(data) {
				toaster.pop('success', '批量开票成功');
				$scope.makeOutBillTableParams.page(1);
				$scope.makeOutBillTableParams.reload();
				$scope.fillBill = false;
				//记录当前选中的条数
				$scope.count = 0;
				
				$scope.sameInfo = {};
				$scope.bill = {};
				$scope.bill.billNum = 0;
				$scope.totalPrice = 0;
			}, function(response) {
				toaster.pop('erorr', '批量开票失败，请重新开票     ' + response.data);
			});
		}
		
	}]);
	
});