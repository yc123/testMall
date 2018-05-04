define([ 'app/app' ], function(app) {
	// 买家销售单跟踪
	app.register.controller('BuyerOrderCtrl', ['$scope', '$anchorScroll', '$location', 'BaseService' , 'ngTableParams', 'Order', 'toaster', '$stateParams', function($scope, $anchorScroll, $location, BaseService ,ngTableParams, Order, toaster, $stateParams) {
		/**********************************************************************
		 * init variable
		 **********************************************************************/
		//如果window.sessionStorage 有值，就设置为当前的active值
		$scope.active = window.sessionStorage.getItem('buyerOrderState')? window.sessionStorage.getItem('buyerOrderState'):'available';
		// 保存关键字
		$scope.keyword = null;
		// 保存分页数据
		$scope.page = null;
		// 订单状态码和订单状态的映射
		$scope.stateMap = {
			501 : '待付款',
			503 : '待付款',
			504 : '待付款',
			505 : '待发货',
			406 : '待发货',
			407 : '待发货',
			408 : '待发货',
			404 : '待收货',
			405 : '已收货',
			520 : '已完成',
			602 : '已失效',
			603 : '已失效',
			604 : '已失效',
			606 : '已失效',
			315 : '已失效'
		};

		/**
		 * 根据当前选择状态获取订单对应的相关状态码字符串
		 *
		 * @returns {string}
		 */
		var getState = function() {
			var state = null;
			switch($scope.active) {
				case 'available' :
					state = '501-503-504-505-406-407-408-404-405-520'; break;
				case 'unavailable' :
					state = '602-603-604-606-315'; break;
				default:
					state = '501-503-504-505-406-407-408-404-405-520';
			}
			return state;
		};

		/**
		 * 根据状态获取订单处于该状态的时间
		 *
		 * @param order 订单信息
		 * @param status 状态信息
		 */
		var getStateTime = function (order, status) {
			var times = [];
			angular.forEach(angular.fromJson(order.statushistory), function (statusHistory) {
				if (statusHistory.status == status) {
					times.push(statusHistory.time);
				}
			});
			return times;
		};

		/**
		 * 初始化分页的订单数据信息
		 */
		var initPage = function () {
			$scope.page = page;
			$scope.page.content = null;
			$scope.page.totalPages = 0;
			$scope.page.totalElements = 0;
			$scope.page.number = 1;
		};

		// 分页获取订单列表参数
		$scope.orderTableParams = new ngTableParams({
			page : 1,
			count : 5,
			sorting : {
				creattime: 'DESC'
			}
		}, {
			total : 0,
			counts: [5, 10, 25, 50, 100],
			getData : function($defer, params) {
				$scope.loading = true;
				var param = BaseService.parseParams(params.url());
				param.keyword = $scope.keyword;
				// 如果设置了筛选状态，则已经此状态获取订单信息
				if ($scope.state) {
					param.status = $scope.state;
				} else {
					param.status = getState();
				}
				// 设置筛选时间区段
				if ($scope.timeType) {
					var date = new Date();
					switch ($scope.timeType) {
						case 1:
							date.setDate(date.getDate() - 1);break;
						case 2:
							date.setDate(date.getDate() - 2*2);break;
						case 3:
							date.setDate(date.getDate() - 3*3);break;
						default:
							param.fromDateMils = date.getTime();
					}
					param.fromDateMils = date.getTime();
				}
				console.log(param);
				Order.findAdminOrderPageByParams(param, function (page) {
					console.log('PRINT PAGE DATA OF ORDRE');
					console.log(page);
					if (page.content) {
						$scope.page = page;
						// 获取发货和收货的时间
						angular.forEach(page.content, function (order) {
							order.deliverTime = getStateTime(order, 404);
							order.receivedTime = getStateTime(order, 405);
						})
					} else {
						initPage()
					}
				}, function () {
					initPage();
				});
			}
		});
		// 加载订单数据
		$scope.orderTableParams.reload();

		/**********************************************************************
		 * interactive operation
		 **********************************************************************/

		/**
		 * 设置状态按钮选中状态
		 *
		 * @param state 设置要选中的状态
		 */
		$scope.setActive = function(state) {
			window.sessionStorage.setItem('buyerOrderState',state);
			if($scope.active != state) {
				$scope.active = state;
			}
			delete $scope.state;
			delete $scope.timeType;
			$scope.orderTableParams.page(1);
			$scope.orderTableParams.reload();
		};

		/**
		 * 搜索功能
		 */
		$scope.onSearch = function() {
			// TODO huxz 搜索功能暂时未添加
			//$scope.orderTableParams.reload();
			toaster.pop('success', '暂时未添加');
		};

		// 存储下拉菜单状态
		$scope.isShowPop = {};

		/**
		 * 触发时间选择下拉菜单
		 */
		$scope.showTimePop = function () {
			delete $scope.isShowPop.status;
			delete $scope.isShowPop.expType;
			delete $scope.isShowPop.originalState;
			$scope.isShowPop.time = !$scope.isShowPop.time;
		};

		// 保存筛选时间区间类型
		$scope.timeType = null;

		/**
		 * 选择筛选的时间区间类型，并刷新页面数据
		 * @param type 时间区间类型
		 */
		$scope.selectTime = function (type) {
			$scope.timeType = type;
			delete $scope.isShowPop.time;
			$scope.orderTableParams.page(1);
			$scope.orderTableParams.reload();
			console.log(type);
		};

		/**
		 * 触发状态选择下拉菜单
		 */
		$scope.showStatusPop = function () {
			delete $scope.isShowPop.time;
			delete $scope.isShowPop.expType;
			$scope.isShowPop.status = !$scope.isShowPop.status;
		};

		// 保存筛选的状态
		$scope.state = null;

		/**
		 * 选择筛选的状态，并刷新页面数据
		 *
		 * @param status 状态
		 */
		$scope.selectStatus = function (status) {
			var state = null;
			switch (status) {
				case 'tobepaid' : // 待付款
					state = '501-503-504'; break;
				case 'tobedeliver' : // 待发货
					state = '505-406-407-408'; break;
				case 'tobereceive' : // 待收货
					state = '404'; break;
				case 'received' : // 已收货
					state = '405'; break;
				case 'success': // 已完成
					state = '520'; break;
				default:
					state = '501-503-504-505-406-407-408-404-405-520';
			}
			$scope.state = state;
			delete $scope.isShowPop.status;
			$scope.orderTableParams.page(1);
			$scope.orderTableParams.reload();
		};

		/**
		 * 触发异常类型的下拉菜单
		 */
		$scope.showExpPop = function () {
			delete $scope.isShowPop.time;
			delete $scope.isShowPop.status;
			$scope.isShowPop.expType = !$scope.isShowPop.expType;
		};

		/**
		 * 选择筛选的异常类型，并刷新页面数据
		 *
		 * @param expType 异常类型
		 */
		$scope.selectExpType = function (expType) {
			console.log(expType);
			// TODO huxz 异常类型的范围
			delete $scope.isShowPop.expType;
			$scope.orderTableParams.page(1);
			$scope.orderTableParams.reload();
		};

		/**
		 * 触发失效来源下拉菜单
		 */
		$scope.showOriginalStatePop = function () {
			delete $scope.isShowPop.time;
			$scope.isShowPop.originalState = !$scope.isShowPop.originalState;
		};

		/**
		 * 选择筛选的失效来源，并刷新页面数据
		 *
		 * @param stateName 失效来源名称
		 */
		$scope.selectOriginalState = function (stateName) {
			console.log(stateName);
			// TODO huxz 添加筛选的数据范围
			delete $scope.isShowPop.originalState;
			$scope.orderTableParams.page(1);
			$scope.orderTableParams.reload();
		};

		/**
		 * 跳转到页数pageNum
		 *
		 * @param pageNum
		 */
		$scope.jumpToPage = function (pageNum) {
			// 如果页面超出1~page.totalPages，则设置为对应的边界值
			if (pageNum < 1) {
				pageNum = 1;
			} else if (pageNum > $scope.page.totalPages) {
				pageNum = $scope.page.totalPages;
			}
			delete $scope.toPage;
			$scope.orderTableParams.page(pageNum);
			$scope.orderTableParams.reload();
		};

		/**********************************************************************
		 * business operation
		 **********************************************************************/

		/**
		 * 确认收款
		 *
		 * @param order 订单信息
		 */
		$scope.ensurePay = function(order){
			Order.ensurePay({orderid: order.orderid}, {}, function(data){
				toaster.pop('success', '处理成功', '【' + data.orderid + '】' + '确认付款');
				$scope.orderTableParams.page(1);
				$scope.orderTableParams.reload();
			}, function(response){
				toaster.pop('error', '确认付款失败', response.data);
			})
		};

		/**
		 * 转出货单并添加出货信息
		 *
		 * @param order 操作的订单
		 */
		$scope.batchCreateinFor = function(order) {
			var postData = {ids: order.id};
			Order.batchCreateinFor({}, postData, function(data){
				toaster.pop('success', '成功', '转出货单成功');
				console.log(data);
				$scope.orderTableParams.page(1);
				$scope.orderTableParams.reload();
			}, function(res) {
				toaster.pop('error', '错误', '转出货单失败');
			});
		};

	}]);
});