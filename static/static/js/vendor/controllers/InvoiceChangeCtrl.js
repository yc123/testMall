define(['app/app'], function(app) {
	'use strict';
	app.register.controller('InvoiceChangeCtrl', ['$scope', 'toaster', 'Invoice', 'Order' , '$stateParams', '$location', 'BaseService', 'ngTableParams', 'SessionService', '$window', '$filter', '$state', 'Purchase', function($scope, toaster, Invoice, Order , $stateParams, $location, BaseService ,ngTableParams , SessionService, $window, $filter, $state, Purchase) {
		var enIdFilter = $filter('EncryptionFilter');
		//如果window.sessionStorage 有值，就设置为当前的active值
		$scope.active = SessionService.get('invoiceChangeState')? SessionService.get('invoiceChangeState'):'tobeshipped';
		
		BaseService.scrollBackToTop();
		
		var getState = function() {
			var state = 'get';
			switch($scope.active) {
				case 'all' : 
					break;
				case 'tobeshipped' :
					state = '406'; break;
				case 'inbound' :
					state = '404'; break;
				case 'received' :
					state = '405-506'; break;
				case 'moneyreceived' :
					state = '505'; break;
			}
			return state;
		};
		
		$scope.setActive = function(state) {
			SessionService.set('invoiceChangeState',state);
			if($scope.active != state) {
				$scope.active = state;
			}
			if($scope.invoiceTableParams.page() == 1)
				$scope.invoiceTableParams.reload();
			else
				$scope.invoiceTableParams.page(1);
		};
		
		$scope.invoiceTableParams = new ngTableParams({
			page : 1,
			count : 10,
			sorting : {
				createtime: 'DESC'
			}
		}, {
			total : 0,
			counts: [10, 25, 50, 100],
			getData : function($defer, params) {
				$scope.loading = true;
				$scope.paginationParams = params;
				var param = BaseService.parseParams(params.url());
				param.keyword = $scope.keyword;
				param.status = getState();
				$scope.count = 0;
				Invoice.getBusinessInvoice(param, function(page) {
					if (page) {
						params.total(page.totalElements);
						$defer.resolve(page.content);
					}
				});
			}
		});
		
		// 搜索框内容转换成大写
		var t;
		var setTime = function() {
			if($scope.time > 0) {
				t = setTimeout(function() {
					$scope.$apply(function() {
						$scope.time--;
						setTime();
					});
				}, 1000);
			}else {
				$scope.keyword = angular.uppercase($scope.keyword);
			}
		};
		
		$scope.upper = function() {
			$scope.time = 1;
			clearTimeout(t);
			setTime();
		}
		
		//根据订单号搜索单据
		$scope.onSearch = function() {
			$scope.keyword = angular.uppercase($scope.keyword);
			$scope.invoiceTableParams.reload();
		}
		
		// 跳转到换货出货单详情页
		$scope.toDetail = function(invoiceid) {
			$location.url("invoiceChange/" + enIdFilter(invoiceid));
		}
		
		//批量选择
		$scope.batchShipcheck = false;
		$scope.batchSelectShip = function() {
			$scope.batchShipcheck = !$scope.batchShipcheck;
			if($scope.batchShipcheck) {
				$scope.count = $scope.invoiceTableParams.data.length;
			}else {
				$scope.count = 0;
			}
			angular.forEach($scope.invoiceTableParams.data, function(invoice) {
				invoice.choose = $scope.batchShipcheck;
			});
		}
		
		//判断是否选中了全部的出货单，如果全部选中，全选置为选中
		$scope.doSelect = function(invoice) {
			var allSelect = true;
			if(invoice.choose) {
				$scope.count++;
			}else {
				$scope.count--;
			}
			angular.forEach($scope.invoiceTableParams.data, function(invoice) {
				if(!invoice.choose) {
					allSelect = false;
				}
			});
			$scope.batchShipcheck = allSelect;
		}
		
		//获取已经勾选的，需要出货的出货对象
		var getShip = function() {
			var tobeShip = [];
			angular.forEach($scope.invoiceTableParams.data, function(invoice) {
				if(invoice.choose) {
					tobeShip.push(invoice);
				}
			});
			return tobeShip;
		}
		
		//确认发货
		$scope.send = function(invoice){
			$scope.sendstatus = true;
			var arr = [];
			if(invoice) {
				arr.push(invoice);
			}else {
				arr = getShip()
			}
			$scope.checkinvoice = arr;
			if(angular.equals(angular.toJson($scope.checkinvoice), '[]')) {
				toaster.pop('error', '错误', '请勾选将要出货的出货单');
				window.event.returnValue = false;
				return ;
			}
			var arrid = [];
			/**
			 * 暴力发请求，后面需要加物流信息
			 */
//			Invoice.send({inid:invoice.id},{}, function(page) {
//				$scope.invoiceTableParams.reload();
//				toaster.pop('success', '正确，发货成功！');
//			});
			angular.forEach($scope.checkinvoice, function(invoice) {
				arrid.push(invoice.invoiceid);
			});
			$state.go("shipFchange",{ids: enIdFilter(arrid.join('-'))});
		};
	}]);
	
});