define([ 'app/app' ], function(app) {
	// 交易记录表
	app.register.controller('TradeRecordChartCtrl', ['$scope', 'Ysepay', 'ngTableParams', 'BaseService', 'TradeRecordChart', function($scope, Ysepay, ngTableParams, BaseService, TradeRecordChart) {

		$scope.active = '';
		$scope.keyword = '';
		$scope.dateZoneText = '不限';
		$scope.condition = {dateZone: -1};
		
		var getState = function() {
			var state = 'get';
			switch($scope.active) {
				case 'payment':// 已付款
					state = 'payment'; break ; 
				case 'refund' :// 已退款
					state = 'refund'; break;
			}
			return state;
		};
		
		// 选择交易状态
		$scope.setActive = function(state) {
			if($scope.active != state) {
				$scope.active = state;
			}
			if($scope.tradeRecordChartTableParams.page() == 1)
				$scope.tradeRecordChartTableParams.reload();
			else
				$scope.tradeRecordChartTableParams.page(1);
		};
		
		// 表格参数
		$scope.tradeRecordChartTableParams = new ngTableParams({
			page : 1,
			count : 10,
			sorting : {
				orderid: 'DESC'
			}
		}, {
			total : 0,
			getData : function($defer, params) {
				$scope.loading = true;
				var param = BaseService.parseParams(params.url());
				param.keyword = $scope.keyword;
				param.state = $scope.active;
				param.fromDate = $scope.condition.dateFrom ? $scope.condition.dateFrom.getTime() : null;
				param.toDate = $scope.condition.dateTo ? $scope.condition.dateTo.setDate($scope.condition.dateTo.getDate()+1) : null;// datepicker默认选中时间为当天0:00，所以选中截至时间+1天
				
				TradeRecordChart[getState()].call(null, param, function(page) {
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
		
		// 根据订单号搜索
		$scope.onSearch = function() {
			$scope.keyword = angular.uppercase($scope.keyword);
			$scope.tradeRecordChartTableParams.reload();
		};	
		
		// 改变单据日期范围
		$scope.changeDateZone = function(zone) {
			$scope.condition.dateZone = zone;
			$scope.dateZoneText = typeof zone == 'undefined' ? '半年前' : (zone == -1 ? '不限' : (zone == 1 ? '一个月内' : '半年内'));
			$scope.condition.$dateZoneOpen = false;
			getDateCondition(zone, $scope.condition);
			$scope.tradeRecordChartTableParams.reload();
		};
		
		// 打开日期选择框
		$scope.openDatePicker = function($event, item, openParam) {
			$event.preventDefault();
		    $event.stopPropagation();
		    item[openParam] = !item[openParam];
		};

		// 选择查找日期
		$scope.onDateCondition = function(){
			$scope.tradeRecordChartTableParams.page(1);
			$scope.tradeRecordChartTableParams.reload();
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