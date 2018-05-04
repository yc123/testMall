define(['app/app'], function(app) {
	'use strict';
	app.register.controller('purchaseBillAdminCtrl', ['$scope','toaster', 'BaseService', 'Purchase', 'ngTableParams', function($scope, toaster, BaseService, Purchase, ngTableParams) {
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
				case 'toBeReceive': //采购单中存在待收票的发票,这个在前台需要特殊处理
					state = '799'; break;
					default :
						state = '799'; break;
			}
			return state;
		};
		
		$scope.setActive = function(status) {
			$scope.active = status;
			$scope.purchaseBillTableParams.page(1);
			$scope.purchaseBillTableParams.reload();
		}
		
		$scope.purchaseBillTableParams = new ngTableParams({
			page : 1,
			count : 5,
			sorting : {
				createtime : 'DESC'
			}
		}, {
			total : 0,
			counts : [5, 10, 25, 50, 100],
			getData : function($defer, params) {
				var param = BaseService.parseParams(params.url());
				param.keyword = $scope.keyword;
				param.status = getState();
				Purchase.getPurchaseBillByStatus(param, function(page) {
					for(var i = 0; i < page.content.length; i++) {
						//转发票发货信息地址
						page.content[i].invoiceAddress = angular.fromJson(page.content[i].invoiceAddress);
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
			$scope.purchaseBillTableParams.reload();
		}
		
		$scope.confirmBill = function(purchase, purchaseDetail) {
			var bill = {};
			bill[purchase.purchaseid] = purchaseDetail.detailid;
			Purchase.confirmBill(null, bill, function() {
				toaster.pop('success', '确认收票');
				$scope.purchaseBillTableParams.page(1);
				$scope.purchaseBillTableParams.reload();
			}, function(response) {
				toaster.pop('error', "确认收票失败 ： " + response.data)
			});
		}
	}])
});