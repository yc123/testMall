define([ 'app/app' ], function(app) {
	app.register.controller('RequestPayCtrl', ['$scope', '$anchorScroll', '$location', '$http','$filter' , 'ngTableParams', 'BaseService', '$stateParams','$state' ,'Receipt','DateParse' , '$modal' , 'bankInfoService', 'bankTransferService' , 'toaster', 'Purchase', function($scope , $anchorScroll, $location, $http, $filter ,ngTableParams, BaseService, $stateParams, $state , Receipt, DateParse, $modal,bankInfoService , bankTransferService , toaster, Purchase) {
		$scope.dateZoneText = '不限';
		$scope.condition = {dateZone: -1};
		if (!$stateParams.uu){}else {
			//控制变量
			$scope.kind = true;
			$scope.startDateError = false;
			$scope.endDateError = false;
			var hideBankFilter = $filter("hideBankFilter");
			// 保存多选的明细ID
			$scope.detailIds = {};
			var details = [];
			$scope.count = 0;

			$scope.active = 'available';
			/*
			 * 待结算 （notsettled） 显示还有出入库单未结算的企业 ,
			 * 已结算 （settled）显示还有出入库单已结算的企业 ,
			 */
			var getState = function() {
				var state = 516;
				switch($scope.active) {
					case 'available' :
						state = 516; break;
					case 'unavailable' :
						state = 517; break;
					case 'availableToBeMakeBill':
						state = 518; break;
				}
				return state;
			};

			$scope.setActive = function(state) {
				if($scope.active != state) {
					$scope.active = state;
				}
				if($scope.receiptTableParams.page() == 1)
					$scope.receiptTableParams.reload();
				else
					$scope.receiptTableParams.page(1);
			};

			//控制单号换行
			$scope.getIndex = function($index) {
				if($index > 3) {
					var boo = $index + 1;
					if(boo%5 == 0) {
						return true;
					}
				}
				return false;
			}

			// 改变单据日期范围
			$scope.changeDateZone = function(zone) {
				$scope.condition.dateZone = zone;
				$scope.dateZoneText = typeof zone == 'undefined' ? '半年前' : (zone == -1 ? '不限' : (zone == 1 ? '一个月内' : '半年内'));
				$scope.condition.$dateZoneOpen = false;
				getDateCondition(zone, $scope.condition);
				$scope.receiptTableParams.reload();
			};

			// 打开日期选择框
			$scope.openDatePicker = function($event, item, openParam) {
				$event.preventDefault();
				$event.stopPropagation();
				item[openParam] = !item[openParam];
			};

			// 选择查找日期
			$scope.onDateCondition = function(){
				$scope.receiptTableParams.page(1);
				$scope.receiptTableParams.reload();
			};

			// 清除多选数据
			var clearChooseData = function () {
				$scope.detailIds = {};
				$scope.count = 0;
				$scope.checks.checked = false;
			};

			$scope.receiptTableParams = new ngTableParams({
				page : 1,
				count : 5,
				sorting : {
					'purchase.createtime' : 'DESC'
				}
			}, {
				total : 0,
				counts : [5, 10, 25, 50, 100],
				getData : function ($defer, params) {
					var param = BaseService.parseParams(params.url());
					param.keyword = $scope.keyword;
					//日期筛选
					param.fromDate = $scope.condition.dateFrom ? $scope.condition.dateFrom.getTime() : null;
					param.toDate = $scope.condition.dateTo ? $scope.condition.dateTo.setDate($scope.condition.dateTo.getDate()+1) : null;// datepicker默认选中时间为当天0:00，所以选中截至时间+1天
					param.enuu = $stateParams.uu;
					Purchase.getPurchaseDetailByEnuu(param, function (page) {
						console.log(page);
						clearChooseData();
						if (page.content) {
							angular.forEach(page.content, function (data) {
								data.purchase = angular.fromJson(data.purchaseStr);
								delete data.purchaseStr;
							});
							params.total(page.totalElements);
							$defer.resolve(page.content);
							details = page.content;
						} else {
							params.total(0);
							$defer.resolve(null);
							details = [];
						}
					}, function () {
						params.total(0);
						$defer.resolve(null);
						details = [];
					});
				}
			});

			//重新勾选
			$scope.cancelCheck = function() {
				$scope.batchCheckStatus = false;
				delete $scope.noticeInfo;
			}

			//根据采购单号搜索采购单
			$scope.onSearch = function() {
				if($scope.startDate){
					if(DateParse.match($scope.startDate) == false){
						$scope.startDateError = true;
					} else {
						$scope.startDateError = false;
						$scope.condition.dateFrom = new Date($scope.startDate);
					}
				} else {
					$scope.startDateError = false;
				}
				$scope.detailIds = {};
				if(!$scope.startDateError) {
					$scope.receiptTableParams.page(1);
					$scope.receiptTableParams.reload();
				}
			}

			//清数据
			var clearData = function (){
				delete $scope.startDateError;
				delete $scope.endDateError;
				delete $scope.noticeInfo;
				delete $scope.batchCheckStatus;
				$scope.checks = {
					checked : false
				};
				$scope.checkCodes = [];
			}

			/**
			 * 多选、单选操作
			 */
			$scope.checks = {
				checked : false
			};

			$scope.checkCodes = [];

			// 点击勾选Code全部的复选框
			$scope.checkAll = function(){
				if($scope.checks.checked) {
					angular.forEach(details, function(item) {
						$scope.detailIds[item.id] = true;
					});
					$scope.count = Object.getOwnPropertyNames($scope.detailIds).length;
				}else {
					$scope.detailIds = {};
					$scope.count = 0;
				}
			};

			//点击Code单选
			$scope.checkOne = function(detail) {
				if ($scope.detailIds[detail.id]) {
					delete $scope.detailIds[detail.id];
					$scope.count --;
				} else {
					$scope.detailIds[detail.id] = true;
					$scope.count ++;
				}
				var idArray = Object.getOwnPropertyNames($scope.detailIds);
				// $scope.checks.checked = !!(idArray && idArray.length > 0);
				$scope.checks.checked = !!(idArray && idArray.length == details.length);
			};

			// 批量申请付款
			$scope.batchRequestPay = function () {
				var ids = Object.getOwnPropertyNames($scope.detailIds);
				console.log(ids.join('-'));
				Purchase.batchRequestPay({ids:ids.join('-')}, {}, function (data) {
					if (data && data.code == 1) {
						$scope.receiptTableParams.page(1);
						$scope.receiptTableParams.reload();
						toaster.pop('success', '申请付款操作成功,结算单：' +data.data);
					}
				});
			};
		}

	}]);

});