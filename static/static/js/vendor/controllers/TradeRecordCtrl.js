define([ 'app/app'], function(app) {
	'use strict';
	app.register.controller('TradeRecordCtrl', ['$scope', '$location', 'toaster', 'BaseService', 'ngTableParams', 'Order', 'ReceiptVendor', '$filter', function($scope, $location, toaster, BaseService, ngTableParams, Order, ReceiptVendor, $filter) {
		BaseService.scrollBackToTop();
		
		var enIdFilter = $filter('EncryptionFilter');
		//如果window.sessionStorage 有值，就设置为当前的active值
		$scope.active = window.sessionStorage.getItem('tradeRecordState')? window.sessionStorage.getItem('tradeRecordState'):'notsettled';
		$scope.dateZoneText = '不限';
		$scope.condition = {dateZone: -1};
		
		var getState = function() {
			var state = 'get';
			switch($scope.active) {
				case 'settled':// 已结算
					state = 'settled'; break ; 
				case 'notsettled' :// 待结算
					state = 'notsettled'; break;
				case 'unavailable' :// 无效
					state = 'unavailable'; break;
			}
			return state;
		};
		
		// 选择出入库单状态
		$scope.setActive = function(state) {
			window.sessionStorage.setItem('tradeRecordState',state);
			if($scope.active != state) {
				$scope.active = state;
			}
			if($scope.tradeRecordTableParams.page() == 1)
				$scope.tradeRecordTableParams.reload();
			else
				$scope.tradeRecordTableParams.page(1);
		};
		
		// 改变单据日期范围
		$scope.changeDateZone = function(zone) {
			$scope.condition.dateZone = zone;
			$scope.dateZoneText = typeof zone == 'undefined' ? '半年前' : (zone == -1 ? '不限' : (zone == 1 ? '一个月内' : '半年内'));
			$scope.condition.$dateZoneOpen = false;
			getDateCondition(zone, $scope.condition);
			$scope.tradeRecordTableParams.reload();
		};
		
		// 打开日期选择框
		$scope.openDatePicker = function($event, item, openParam) {
			$event.preventDefault();
		    $event.stopPropagation();
		    item[openParam] = !item[openParam];
		};

		// 选择查找日期
		$scope.onDateCondition = function(){
			$scope.tradeRecordTableParams.page(1);
			$scope.tradeRecordTableParams.reload();
		};
		
		$scope.tradeRecordTableParams = new ngTableParams({
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
				param.state = $scope.active;
				param.fromDate = $scope.condition.dateFrom ? $scope.condition.dateFrom.getTime() : null;
				param.toDate = $scope.condition.dateTo ? $scope.condition.dateTo.setDate($scope.condition.dateTo.getDate()+1) : null;// datepicker默认选中时间为当天0:00，所以选中截至时间+1天
				
				ReceiptVendor[getState()].call(null, param, function(page) {
					if (page) {
						params.total(page.totalElements);
						angular.forEach(page.content, function(data) {
							data.sourceType = data.sourceType.replace("供应商", "");
						});
						$defer.resolve(page.content);
					}
				});
			}
		});
		
		// 跳转到来源单详情页
		$scope.toDetail = function(receipt) {
//			TODO 后台暂时没有解密 前台暂不加密
//			receipt.sourceid = EncryptionService.encry(receipt.sourceid);
			switch(receipt.sourceType) {
				case "出货单" :
					$location.url("invoice/" + receipt.sourceid); break;
				case "换货出货单" :
					$location.url("invoiceChange/" + enIdFilter(receipt.sourceid)); break;
				case "平台退货单" :
					$location.url("return/" + receipt.sourceid); break;
				case "平台换货单" :
					$location.url("change/" + receipt.sourceid); break;
			}
		};
		
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
		
		// 根据订单号搜索单据
		$scope.onSearch = function() {
			$scope.keyword = angular.uppercase($scope.keyword);
			$scope.tradeRecordTableParams.reload();
		};
		
		// 改变单据日期范围
		var getDateCondition = function(zone, condition) {
			var date = new Date();
			if(zone == -1) {
				condition.dateFrom = null;
				condition.dateTo = null;
			} else if(zone == 1) {
				date.setMonth(date.getMonth() - 1);
				condition.dateFrom = date;
				condition.dateTo = new Date();
			} else if (zone == 6) {
				date.setMonth(date.getMonth() - 6);
				condition.dateFrom = date;
				condition.dateTo = new Date();
			} else {
				date.setMonth(date.getMonth() - 6);
				condition.dateFrom = null;
				condition.dateTo = date;
			}
		};
	}]);
});