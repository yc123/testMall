define([ 'app/app'], function(app) {
	'use strict';
	app.register.controller('FaInOutCtrl', ['$scope', 'toaster', 'BaseService', 'ngTableParams', 'bankTransferService', 'Enterprise', function($scope, toaster, BaseService, ngTableParams, bankTransferService, Enterprise) {
		BaseService.scrollBackToTop();
		
		//付款方企业名称
		$scope.payEnt = [];
		//收款方企业名称
		$scope.collectEnt = [];
		//如果window.sessionStorage 有值，就设置为当前的active值
		$scope.active = window.sessionStorage.getItem('faInOutState')? window.sessionStorage.getItem('faInOutState'):'fain';
		$scope.dateZoneText = '不限';
		$scope.condition = {dateZone: -1};
		$scope.setActive = function(state) {
			window.sessionStorage.setItem('faInOutState',state);
			if($scope.active != state) {
				$scope.active = state;
			}
			if($scope.faInOutTableParams.page() == 1)
				$scope.faInOutTableParams.reload();
			else
				$scope.faInOutTableParams.page(1);
		};
		
		//改变单据日期范围
		$scope.changeDateZone = function(zone) {
			$scope.condition.dateZone = zone;
			$scope.dateZoneText = typeof zone == 'undefined' ? '半年前' : (zone == -1 ? '不限' : (zone == 1 ? '一个月内' : '半年内'));
			$scope.condition.$dateZoneOpen = false;
			getDateCondition(zone, $scope.condition);
			$scope.faInOutTableParams.reload();
		};
		//打开日期选择框
		$scope.openDatePicker = function($event, item, openParam) {
			$event.preventDefault();
		    $event.stopPropagation();
		    item[openParam] = !item[openParam];
		};

		// 选择查找日期
		$scope.onDateCondition = function(){
			$scope.faInOutTableParams.page(1);
			$scope.faInOutTableParams.reload();
		};
		
		$scope.faInOutTableParams = new ngTableParams({
			page : 1,
			count : 10,
			sorting : {
				tranferCreateTime: 'DESC'
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
				param.toDate = $scope.condition.dateTo ? $scope.condition.dateTo.getTime() : null;
								
				bankTransferService.getFaInOut(param, function(page) {
					if (page) {
						params.total(page.totalElements);
						$defer.resolve(page.content);
						var data = page.content;
						angular.forEach(data, function(bkt){
							//根据付款方企业uu查看企业信息
							var payenuu = bkt.payenuu;
							Enterprise.getEnterpriseInfo({enuu: payenuu}, function(data){
								$scope.payEnt.push(data);
							});
							//根据收款方企业uu查看企业信息
							var collectenuu = bkt.collectenuu;
							Enterprise.getEnterpriseInfo({enuu: collectenuu}, function(data){
								$scope.collectEnt.push(data);
							});
						})
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
			$scope.faInOutTableParams.reload();
		}
		
		/*
		 * 改变单据日期范围
		 */
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