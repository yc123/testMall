define(['app/app'], function(app) {
	'use strict'
	app.register.controller('myOrderBill', ['$scope','BaseService', 'Bill', 'toaster', '$state', 'ngTableParams', 'Order', function($scope, BaseService, Bill, toaster, $state, ngTableParams, Order) {
		BaseService.scrollBackToTop();
		
		$scope.active = 'toBeReceive';
		
		var getState = function() {
			var state = '799';
			switch($scope.active) {
				case 'prepare' :
					state = '699'; break;
				case 'toBeMakeOut' :
					state = '700'; break;
				case 'opened' :
					state = '702'; break;
				case 'needNo' :
					state = '703'; break;
				case 'toBeReceive': //订单中存在待收票的发票,这个在前台需要特殊处理
					state = '799'; break;
					default :
						state = '799'; break;
			}
			return state;
		};
		
		$scope.setActive = function(status) {
			$scope.active = status;
			$scope.myOrderBillTableParams.page(1);
			$scope.myOrderBillTableParams.reload();
		}
		
		//根据采购单号搜索采购单
		$scope.onSearch = function() {
			$scope.myOrderBillTableParams.reload();
		}
		
		$scope.myOrderBillTableParams = new ngTableParams({
			page : 1,
			count : 5,
			sorting : {
				creattime : 'DESC'
			}
		}, {
			total : 0,
			counts : [5, 10, 25, 50, 100],
			getData : function($defer, params) {
				$scope.loading = true;
				var param = BaseService.parseParams(params.url());
				param.keyword = $scope.keyword;
				param.status = getState();
				Order.getOrderOnBillByPersonal(param, function(page) {
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
		
		$scope.confirmBill = function(order, orderDetail) {
			var bill = {};
			bill[order.orderid] = orderDetail.detailid;
			Order.confirmBill(null, bill, function() {
				toaster.pop('success', '确认收票');
				$scope.myOrderBillTableParams.page(1);
				$scope.myOrderBillTableParams.reload();
			}, function(response) {
				toaster.pop('error', "确认收票失败 ： " + response.data)
			});
		}
		
	}]);
	
})