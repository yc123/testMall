define(['app/app'], function(app) {
	'use strict';
	app.register.controller('cusPurchaseCtrl', ['$scope', 'Purchase', 'ngTableParams', 'BaseService', 'toaster', '$state', '$filter', 'Return', 'Change', '$modal', 'PuExProcess', function($scope, Purchase, ngTableParams, BaseService, toaster, $state, $filter, Return, Change, $modal, PuExProcess) {
		//BaseService.scrollBackToTop();

		// 加密过滤器
		var enIdFilter = $filter('EncryptionFilter');
		// 如果window.sessionStorage 有值，就设置为当前的active值
		$scope.active = window.sessionStorage.getItem('purchaseState')? window.sessionStorage.getItem('purchaseState'):'tobeconfirmed';
		// 分页相关数据
		$scope.pageParams = { number : 1 };
		// 下拉菜单状态
		$scope.isShowPop = false;
		// 搜索关键字
		$scope.keyword = "";
		// 订单数据条数
		$scope.orderLength = 1;
		// 多选操作，存在ID
		$scope.checkedIds = {};
		// 禁用批量确认收款操作
		$scope.canEnsureRec = false;

		var unavailableReasons = {
			315 : '已注销',
			602 : '库存不足',
			603 : '一直未付款',
			604 : '拒绝发货',
			605 : '用户全部退货',
			606 : '用户取消订单'
		};

		// 订单状态码和订单状态的映射
		$scope.stateMap = {
			501 : '意向订单',
			502 : '待发货',
			406 : '待发货',
			404 : '待收货',
			405 : '待收款',/*已收货：卖家没有已收货状态，商城收货后，应该是待收款状态*/
			503 : '待收款',
			514 : '待收款',
			520 : '已完成',
			602 : '已失效',
			603 : '已失效',
			604 : '已失效',
			605 : '已失效',
			606 : '已失效',
			315 : '已失效'
		};
		// 币种币别符号映射
		$scope.currencyTrans = {
			'RMB' : '￥',
			'USD' : '$'
		};
		// 根据订单状态获取状态码
		var getState = function() {
			var state = 'get';
			switch($scope.active) {
				case 'all' :
					state = ''; break;
				case 'tobeconfirmed' :
					state = '501'; break;
				case 'comfirmed':
					// TODO huxz 点击填写物流转出货单，填写完物流信息变为待收货状态
					state = '502-406'; break;
				case 'inbound':
					state = '404'; break;
				case 'tobepaid':
					// TODO huxz 平台收货后即变为待收款状态，直到买家确认收货503待付款状态
					state = '405-503-514'; break;
				case 'completed':
					// TODO huxz 平台采购单已完成，即交易完成
					state = '520'; break;
				case 'unavailable':
					// TODO huxz 平台采购单的失效状态
					state = '602-603-315-604-605-606'; break;
			}
			return state;
		};

		$scope.setActive = function(active) {
			window.sessionStorage.removeItem("exceptionType");
			window.sessionStorage.setItem('purchaseState', active);
			if($scope.active != active) {
				$scope.active = active;
				$scope.orderTableParams.page(1);
			}
			$scope.isShowPop = false;
			// 初始化多选记录
			$scope.checkedIds = {};
			$scope.orderTableParams.reload();
		};

		// 异常申请/异常通知/退货/换货
		$scope.setExceptionType = function (type, active) {
			window.sessionStorage.setItem('exceptionType', type);
			window.sessionStorage.setItem('purchaseState', active);
			if($scope.active != active) {
				$scope.active = active;
				$scope.orderTableParams.page(1);
			}
			$scope.orderTableParams.page(1);
			$scope.isShowPop = false;
			$scope.checkedIds = {};
			$scope.orderTableParams.reload();
		};

		// 获取各种状态订单的数量信息
		var getCounts = function() {
			Purchase.getAllStatusCounts({}, function(data) {
				$scope.counts = angular.copy(data);
				$scope.counts[$scope.active] = $scope.pageParams.totalElements;
			});
		};
		getCounts();

		// 填写物流信息
		$scope.toBeShiped = function(purchase) {
			// 如果处于406，则直接跳转到物流页面
			if (purchase.inid) {
				// 填写物流信息
				$state.go("entryCheck",{ids: enIdFilter(purchase.inid)});
			} else {
				Purchase.tobeshiped({id: purchase.id}, function(data) {
					toaster.pop('success', '转出货单成功');
					// 填写物流信息
					$state.go("entryCheck",{ids: enIdFilter(data.inId)});
				}, function(response) {
					toaster.pop('error', '失败', '转出货单失败' + response.data);
				});
			}
		};

		// 根据状态码获取对应状态的时间信息
		var getTimeByStatus = function(order, statushistory, statusCode, statusStr) {
			angular.forEach(eval(statushistory), function(statushistory) {
				if (statushistory.status === statusCode) {
					order[statusStr + 'Time'] = statushistory.time;
				}
			});
		};

		$scope.orderTableParams = new ngTableParams({
			page: 1,
			count: 10,
			sorting: {
				createtime : 'DESC'
			}
		}, {
			total: 0,
			getData: function($defer, params) {
				$scope.loading = true;
				$scope.paginationParams = params;
				var param = BaseService.parseParams(params.url());
				param.keyword = $scope.keyword;
				param.status = getState();
				param.startMils = $scope.startMils;
				param.endMils = $scope.endMils;
				param.exceptionType = window.sessionStorage.getItem('exceptionType');
				$scope.startMils = undefined;
				$scope.endMils = undefined;
				Purchase.getByStatusAndInternal(param, function(page) {
					//console.log(page);
					if(page) {
						if (page.content) {
							angular.forEach(page, function (value, key) {
								if (key == 'all' || key == 'tobeconfirmed' || key == 'comfirmed' || key == 'inbound'
									|| key == 'tobepaid' || key == 'completed' || key == 'unavailable') {
									$scope.counts[key] = value;
								}
							});
						} else {
							$scope.counts = {};
						}
						$scope.purchases = page.content;
						getExMsgState(); // 获取异常消息状态
						getReturnByPurchaseIds(); // 获取退货单信息

						//console.log($scope.counts);
						$scope.orderLength = page.numberOfElements;
						$scope.pageParams.content = page.content;
						$scope.pageParams.number = page.number;
						$scope.pageParams.totalElements = page.totalElements;
						$scope.pageParams.totalPages = page.totalPages;
						params.total(page.totalElements);
						$defer.resolve(page.content);
						$scope.orderLength = page.content.length;
						//console.log(page.content);

						angular.forEach(page.content, function(order){
							var purchaseDetails = angular.copy(order.purchaseDetails);
							// 获取型号数量
							var components = {};
							angular.forEach(purchaseDetails, function(purchaseDetail){
								components[purchaseDetail.uuid] ++;
							});
							order.codeNum = Object.getOwnPropertyNames(components).length;
							// TODO huxz 获取付款到账时间[已付款时间]
							// 获取订单发货时间
							getTimeByStatus(order, order.statushistory, 406, 'inbound');
							// 获取订单收货时间
							getTimeByStatus(order, order.statushistory, 405, 'receivedGoods');
							// 当订单状态码为失效状态时
							var statusCode = order.status;
							if (statusCode == 602 || statusCode == 603 || statusCode == 604 || statusCode == 315 || statusCode == 605 || statusCode == 606) {
								getTimeByStatus(order, order.statushistory, statusCode, 'unavailable');
								order.unavailableReason = unavailableReasons[statusCode];
							}
						});
					}
				})
			}
		});
		$scope.orderTableParams.reload();

		// 收退货
		$scope.receivingDialogShow = {};
		// 确认收退货：知道
		$scope.known = function (purchase) {
			var id = $scope.returnInfo[purchase.purchaseid].id;
			receiving(id);
			$scope.receivingDialogShow[id] = false
		};
		// 确认收退货：下次不再提示
		$scope.notHint = function (purchase) {
			window.localStorage.setItem('notHintEnsureReceiving', true);
			var id = $scope.returnInfo[purchase.purchaseid].id;
			receiving(id);
			$scope.receivingDialogShow[id] = false
		};
		//确认收货
		$scope.ensureReceiving = function(re, purchase){
			if(!window.localStorage.getItem('notHintEnsureReceiving')) {
				/*var modalInstance = $modal.open({
					templateUrl : 'static/view/vendor/modal/ensure-receiving-modal.html',
					controller: 'ensureReceivingModalCtrl',
					/!*size: 'sm',*!/
					/!*windowClass: ''*!/
				});
				modalInstance.result.then(function (result) {
					receiving(re.id);
				}, function (reason) {

				 })*/
				var detailIds = [];
				angular.forEach(re.returnDetails, function (detail) {
					detailIds.push(detail.puid);
				});
				var allUnavailable = true;
				for(var i = 0; i < purchase.purchaseDetails.length; i++) {
					var puDetail = purchase.purchaseDetails[i];
					if(detailIds.indexOf(puDetail.detailid) != -1) {
						allUnavailable = false;
						break;
					}
				}
				// 全部明细无效才失效整张订单，从而才弹出提示
				if(allUnavailable) {
					$scope.receivingDialogShow[re.id] = !$scope.receivingDialogShow[re.id];
				}
			}else {
				receiving(re.id);
			}
		};
		var receiving = function (id) {
			Return.venderAccept({returnid: id}, {}, function(data){
				$scope.orderTableParams.reload();
				toaster.pop('success', '处理成功', '退货单 确认收货成功');
			}, function(error){
				toaster.pop('error', '退货处理失败:' + error.data);
			})
		};


		//确认收退换货
		$scope.ensureExchangeReceiving = function(purchaseId){
			Change.venderAcceptByPurchase({purchaseId : purchaseId}, function () {
				$scope.orderTableParams.page(1);
				$scope.orderTableParams.reload();
				toaster.pop('success', '处理成功', '退货单 确认收货成功');
			}, function (error) {
				toaster.pop('error', '退货处理失败:' + error.data);
			});
		};

		// 分页操作
		$scope.topage = function(num) {
			//console.log('num:' + num);
			if ($scope.topagenum !== null) {
				$scope.topagenum = null;
			}
			if (num < 1) {
				num = 1;
			} else if (num > $scope.pageParams.totalPages) {
				num = $scope.pageParams.totalPages;
			}
			$scope.orderTableParams.page(num);
			$scope.orderTableParams.reload();
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
		};

		// TODO huxz 打开下拉菜单
		$scope.showPop = function() {
			$scope.isShowPop = !$scope.isShowPop;
		};

		// TODO huxz 选择下单时间分段
		$scope.chooseInternal = function(inType) {
			//console.log(1);
			var nowDate = new Date();
			// 30天后
			nowDate.setDate(nowDate.getDate() - 30);
			var startDate = angular.copy(nowDate);
			// 90天后
			nowDate.setDate(nowDate.getDate() - 30 * 2);
			var endDate = angular.copy(nowDate);
			switch (inType) {
				case 1:
					$scope.startMils = startDate.getTime();
					$scope.endMils = undefined;
					break;
				case 2:
					$scope.startMils = endDate.getTime();
					$scope.endMils = startDate.getTime();
					break;
				case 3:
					$scope.startMils = undefined;
					$scope.endMils = endDate.getTime();
					break;
			}
			//console.log('[' + $scope.startDate + ',' + $scope.endDate +']');
			$scope.orderTableParams.page(1);
			$scope.orderTableParams.reload();
			$scope.isShowPop = false;
		};

		// 根据输入单号搜索单据
		$scope.onSearch = function() {
			$scope.keyword = angular.uppercase($scope.keyword);
			$scope.orderTableParams.page(1);
			$scope.orderTableParams.reload();
		};

		// 对意向订单拒绝
		$scope.refuse = function(purchaseDetail) {
			//为批量的拒绝留条路，ids 用-链接
			Purchase.refusePurDetail({ids:purchaseDetail.id}, function() {
				toaster.pop('success', '拒绝成功');
				$scope.orderTableParams.page(1);
				$scope.orderTableParams.reload();
			}, function(response) {
				toaster.pop('error', '拒绝失败  ' + response.text);
			});
		};

		$scope.orderTake = function(purchaseDetail) {
			//批量接单的入口
			Purchase.orderTakeDetail({ids: purchaseDetail.id}, function() {
				toaster.pop('success', '接单成功');
				$scope.orderTableParams.page(1);
				$scope.orderTableParams.reload();
			}, function(response) {
				toaster.pop('error', '接单失败  ' + response.text);
			});
		};

		// 多选操作
		$scope.checkOnePur = function (purchase) {
			// 批量确认收款
			if (purchase && purchase.id) {
				if ($scope.checkedIds[purchase.id]) {
					delete $scope.checkedIds[purchase.id];
				} else {
					$scope.checkedIds[purchase.id] = true;
				}
				var idArray = Object.getOwnPropertyNames($scope.checkedIds);
				$scope.canEnsureRec = idArray.length > 0;
			}
		};

		// TODO 弃用，【批量】确认收款
		$scope.ensureReceived = function (id) {
			var idArray = Object.getOwnPropertyNames($scope.checkedIds);
			var ids = id || idArray.join('-');
			Purchase.ensureReceivedMoney({ids:ids}, {}, function (data) {
				if (data.data == 'success') {
					toaster.pop('success', '确认收款成功');
					// 初始化多选记录
					$scope.checkedIds = {};
					$scope.orderTableParams.reload();
				}
			});
		};

		/**
		 * 根据采购单号获取对应的退货单物流
		 */
		var getReturnByPurchaseIds = function () {
			var puids = [];
			angular.forEach($scope.purchases, function (purchase) {
				puids.push(purchase.purchaseid);
			});
			//puids = puids.slice(0, -1);
			Return.getReturnByPurchaseIds({puids : puids}, function (data) {
				$scope.returnInfo = data;
			}, function (error) {
				toaster.pop('error', '获取订单关联的退货单信息失败');
			})
		};

		/**
		 * 获取异常消息状态
		 */
		var getExMsgState = function () {
			var applyIds = [], notifyIds = [];
			angular.forEach($scope.purchases, function (purchase) {
				if(purchase.launchPuExApplyId) {
					applyIds.push(purchase.launchPuExApplyId);
				}
				if(purchase.exApplyIdFromBuyer) {
					notifyIds.push(purchase.exApplyIdFromBuyer);
				}
			});
			sellerGetApplyMsgState(applyIds);
			sellerGetNotifyMsgState(notifyIds);
		}

		/**
		 * 卖家获取异常申请消息状态
		 */
		var sellerGetApplyMsgState = function (applyIds) {
			PuExProcess.sellerGetApplyMsgState({applyIds: applyIds}, function (data) {
				$scope.applyMsgState = data;
			}, function (error) {
				toaster.pop('error', '获取异常申请消息状态失败');
			})
		};

		/**
		 * 卖家获取异常通知消息状态
         */
		var sellerGetNotifyMsgState = function (notifyIds) {
			PuExProcess.sellerGetNotifyMsgState({notifyIds: notifyIds}, function (data) {
				$scope.notifyMsgState = data;
			}, function (error) {
				toaster.pop('error', '获取异常通知消息状态失败');
			})
		};
		
		 //查看物流详情
        $scope.listLogistics = function(lgtId){
            $modal.open({
                animation: true,
                templateUrl: 'static/view/usercenter/listLogistics.html',
                controller: 'listLogisticsCtrl',
                resolve: {
                    lgtid: function() {
                        return lgtId;
                    }
                }
            }).result.then(function () {
                
            }, function () {
                
            });
        };

	}]);
})