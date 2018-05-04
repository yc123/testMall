define(['app/app'], function(app) {
	'use strict';
	app.register.controller('puchaseBillAdminCtrl', ['$scope','toaster', 'BaseService', 'Purchase', 'ngTableParams', function($scope, toaster, BaseService, Purchase, ngTableParams) {
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
			}
			return state;
		};
		
		$scope.setActive = function(status) {
			$scope.active = status;
			$scope.puchaseBillTableParams.page(1);
			$scope.puchaseBillTableParams.reload();
			$scope.fillBill = false;
			//记录当前选中的条数
			$scope.count = 0;
			
			$scope.sameInfo = {};
		}
		
		$scope.puchaseBillTableParams = new ngTableParams({
			page : 1,
			count : 5,
			sorting : {
				createtime : 'DESC'
			}
		}, {
			total : 0,
			counts : [5, 10, 25, 50, 100],
			getData : function($defer, params) {
				$scope.loading = true;
				var param = BaseService.parseParams(params.url());
				param.keyword = $scope.keyword;
				param.status = getState();
				Purchase.getPurchaseBillByStatusAndVendor(param, function(page) {
					for(var i = 0; i < page.content.length; i++) {
						//转发票发货信息地址
						page.content[i].invoiceAddress = angular.fromJson(page.content[i].invoiceAddress);
						//删除 不必要的数据，为匹配发票的收货地址匹配做准备
						if(page.content[i].invoiceAddress) {
							delete page.content[i].invoiceAddress.enuu;
							delete page.content[i].invoiceAddress.useruu;
							delete page.content[i].invoiceAddress.id;
						}
						for(var j = 0; j < page.content[i].purchaseDetails.length; j++) {
							page.content[i].purchaseDetails[j].realTradeNum = page.content[i].purchaseDetails[j].number - 
							(page.content[i].purchaseDetails[j].custreturnQty ? page.content[i].purchaseDetails[j].custreturnQty : 0);
							page.content[i].purchaseDetails[j].realPrice = page.content[i].purchaseDetails[j].realTradeNum* page.content[i].purchaseDetails[j].unitprice;
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
			$scope.puchaseBillTableParams.page(1);
			$scope.puchaseBillTableParams.reload();
		}
		
		$scope.totalPrice = 0;
		$scope.fillBill = false;
		
		$scope.makeOutBill = function() {
			$scope.totalPrice = 0;
			if(!$scope.count) {
				toaster.pop('info', '请选中需要开票的明细!');
				return ;
			}else {
				$scope.billpurchase = {};
				var purchases = $scope.puchaseBillTableParams.data;
				for(var i = 0; i < purchases.length; i++) {
					var arr = [];
					for(var j = 0; j < purchases[i].purchaseDetails.length; j++) {
						var detail = purchases[i].purchaseDetails[j];
						if(detail.checked) {
							arr.push(detail.detailid);
							$scope.totalPrice += detail.realPrice;
						}
					}
					if(arr.length != 0) {
						$scope.billpurchase[purchases[i].purchaseid] = arr;
					}
				}
				
				$scope.fillBill = true;
			}
		}
		
		var initSampleInfoAndCompare = function(purchase, purchaseDetail) {
			if(!$scope.sameInfo.invoicetitle || !$scope.count) {
				$scope.sameInfo.invoicetitle = purchase.invoicetitle;
				$scope.sameInfo.invoicetype = purchase.invoicetype;
				$scope.sameInfo.invoiceAddress = purchase.invoiceAddress;
			}else {
				if($scope.sameInfo.invoicetitle != purchase.invoicetitle) {
					toaster.pop('info', "发票的抬头不一致，不能批量开票");
					purchaseDetail.checked = false;
					return false;
				}
				if($scope.sameInfo.invoicetype != purchase.invoicetype) {
					toaster.pop('info', "发票类型不一致，不能批量开票");
					purchaseDetail.checked = false;
					return false;
				}
				if(!angular.equals($scope.sameInfo.invoiceAddress, purchase.invoiceAddress)) {
					toaster.pop('info', "发票收货地址不一致，不能批量开票");
					purchaseDetail.checked = false;
					return false;
				}
				
			}
			
			return true;
		}
		
		//记录当前选中的条数
		$scope.count = 0;
		
		$scope.sameInfo = {};
		
		$scope.selectPurchase = function(purchase) {
			if(purchase.checked) {
				if(!$scope.sameInfo.invoicetitle || !$scope.count) {
					$scope.sameInfo.invoicetitle = purchase.invoicetitle;
					$scope.sameInfo.invoicetype = purchase.invoicetype;
					$scope.sameInfo.invoiceAddress = purchase.invoiceAddress;
				}else {
					if($scope.sameInfo.invoicetitle != purchase.invoicetitle) {
						toaster.pop('info', "发票的抬头不一致，不能批量开票");
						purchase.checked = false;
						return false;
					}
					if($scope.sameInfo.invoicetype != purchase.invoicetype) {
						toaster.pop('info', "发票类型不一致，不能批量开票");
						purchase.checked = false;
						return false;
					}
					if(!angular.equals($scope.sameInfo.invoiceAddress, purchase.invoiceAddress)) {
						toaster.pop('info', "发票收货地址不一致，不能批量开票");
						purchase.checked = false;
						return false;
					}
				}
				for(var i = 0; i < purchase.purchaseDetails.length; i++) {
					if(!purchase.purchaseDetails[i].checked && purchase.purchaseDetails[i].billStatus==700) {
						$scope.count++;
						purchase.purchaseDetails[i].checked = true;
					}
				}
			}else {
				for(var i = 0; i < purchase.purchaseDetails.length; i++) {
					if(purchase.purchaseDetails[i].checked) {
						$scope.count--;
					}
					purchase.purchaseDetails[i].checked = false;
				}
				
				if(!$scope.count) {
					$scope.sameInfo = {};
				}
			}
		}
		
		$scope.selectDetail = function(purchase, purchaseDetail) {
			if(purchaseDetail.checked) {
				var returnOrNot = initSampleInfoAndCompare(purchase, purchaseDetail);
				if(!returnOrNot) {
					return;
				}
				var result = true; //如果订单明细全部选中，则订单应该被选中
				for(var i = 0; i < purchase.purchaseDetails.length; i++) {
					if(!purchase.purchaseDetails[i].checked) {
						result = false;
						break;
					}
				}
				if(result) {
					purchase.checked=true;
				}
				$scope.count++;
			}else {
				$scope.count--;
				if(!$scope.count) {
					$scope.sameInfo = {};
				}
				
				//订单默认取消全选
				purchase.checked = false;
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
			Purchase.makeOutBill({billNum: $scope.bill.billNum}, $scope.billpurchase, function(data) {
				toaster.pop('success', '批量开票成功');
				$scope.puchaseBillTableParams.page(1);
				$scope.puchaseBillTableParams.reload();
				$scope.fillBill = false;
				
				//清空数据
				//记录当前选中的条数 
				$scope.count = 0;
				$scope.sameInfo = {};
				$scope.totalPrice = 0;
				$scope.bill = {};
				$scope.bill.billNum = 0;
			}, function(response) {
				toaster.pop('erorr', '批量开票失败，请重新开票     ' + response.data);
			});
		}
		
	}]);
	
});