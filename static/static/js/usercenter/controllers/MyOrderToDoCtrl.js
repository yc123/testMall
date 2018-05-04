define([ 'app/app' ], function(app) {
	// 买家订单跟踪
	app.register.controller('MyOrderToDoCtrl', ['$rootScope', '$scope', '$window', 'ngTableParams', 'BaseService', '$stateParams', 'AuthenticationService', 'Order', 'OrderSimpleInfo', '$modal', 'SessionService', 'toaster', '$filter', '$state', 'bankInfoService', 'Cart', 'Ysepay', 'OrExApplyStatusForBuyer', 'ExNotifyStatusForBuyer', 'AfterSale', function($rootScope, $scope, $window, ngTableParams, BaseService, $stateParams, AuthenticationService, Order, OrderSimpleInfo, $modal, SessionService, toaster, $filter, $state, bankInfoService, Cart, Ysepay, OrExApplyStatusForBuyer, ExNotifyStatusForBuyer, AfterSale) {
		//BaseService.scrollBackToTop();

		// 如果window.sessionStorage 有值，就设置为当前的active值

		// 确认付款
		$scope.paymentEnsure= function(order) {
			// 签名加密
			Ysepay.paymentSign({orderid:order.orderid},{},function(data) {
				$scope.ysepayRequest = data;
				$scope.$apply();
				var form = document.getElementById('paymentForm');
				form.action = "https://openapi.ysepay.com/gateway.do";
				form.method = "POST";
				form.submit();
			},function(res){
				toaster.pop('error', '获取支付请求参数错误', res.data);
			});
		};

		$scope.applyStatusForBuyer = OrExApplyStatusForBuyer;
		$scope.exNotifyStatusForBuyer = ExNotifyStatusForBuyer;

		$scope.active = SessionService.get('todoState')? SessionService.get('todoState'):'tobepaid';
		$scope.canChange = false;
		// 默认设定订单数目为1
		$scope.orderLength = 1;
		// 分页参数初始化
		$scope.pageParams = { number : 1 };
		// 存储跳转页码
		$scope.topagenum = null;
		// 加密订单的ID过滤器
		var enIdFilter = $filter('EncryptionFilter');
		// 下拉菜单状态
		$scope.isShowPop = false;
		// 获取当前时间
		$scope.nowTime = new Date().getTime();
		// 存储选中的订单id或orderid
		$scope.store = {};
		//  暂时保留，初始化客服、退款、退换货的状态
		$scope.operatorStatus = {
			service : 1,		// 1:申请客服，2:客服确认中，3:客服有反馈
			refund : 1,			// 1:申请退款，2:退款确认中，3:退款有反馈
			returnG : 1			// 1：申请退换货，2:退换货确认中，3:退换货有反馈，4:正在退货，5:正在发货
		};
		//  失效状态码和失效原因映射
		var unavailableReasons = {
			315 : '已注销',
			602 : '库存不足',
			603 : '一直未付款',
			604 : '拒绝发货',
			605 : '全部退货',
			606 : '取消订单'
		};
		// 订单状态码和订单状态的映射
		$scope.stateMap = {
			501 : '待付款',
			503 : '待付款',
			504 : '待付款',
			505 : '待发货',
			406 : '待发货',
			407 : '待发货',
			403 : '待发货',
			408 : '待发货',
			404 : '待收货',
			405 : '已收货',
			520 : '已完成',
			602 : '已失效',
			603 : '已失效',
			604 : '已失效',
			605 : '已失效',
			606 : '已失效',
			315 : '已失效'
		};
		//  付款方式和付款类型码的映射[后续更新]
		$scope.payMap = {
			1102 : '在线支付',
			1103 : '线下支付'
		};
		// 币种币别符号映射
		$scope.currencyTrans = {
			'RMB' : '￥',
			'USD' : '$'
		};
		
		// 当前选中的币别
		$scope.currentCurrency = ""; 
		
		// 检查付款信息，设置设置isDisabled属性
		var checkPayInfo = function(){
			angular.forEach($scope.orders, function(order){
				if(order.banktfid){
					order.isDisabled = true;
				}
			});
		};
		
		// 动态修改不同状态和全部订单的样式
		var getOperatorS = function() {
			$scope.canChange = $scope.active != '';
		};
		getOperatorS();
		
		// 获取优软商城对公账户的信息
		bankInfoService.getAdminEnterAccount({}, function(data) {
			if(data.length > 0) {
				$scope.yrscAccount = data;
			}
		}, function(response) {
			toaster.pop('error', '获取账户信息失败 ', response.data);
		});
		
		// 获取优软商城对私账户的信息
		bankInfoService.getAdminPersAccount({}, function(data) {
			if(data.length > 0) {
				$scope.yrscPerAccount = data[0];
			}
		}, function(response) {
			toaster.pop('error', '获取账户信息失败 ', response.data);
		});
		
		// 根据当前状态获取对应的状态码值
		var getState = function() {
			var state = null;
			switch($scope.active) {
				case 'all' : // 全部
					state = null; break;
				case 'tobepaid' : // 待付款
					state = '501-503-504'; break; // 504-已付款， 放在待付款下面，商城确认收款后再放到待发货
				case 'tobedeliver' : // 待发货
					state = '505-406-407-403-408'; break;
				case 'tobereceive' : // 待收货
					state = '404'; break;
				case 'received' : // 已收货
					state = '405'; break;
				case 'success': // 已完成
					state = '520'; break;
				case 'unavailable' : // 已失效
					state = '602-603-315-604-605-606'; break;
			}
			return state;
		};
		
		// 获取各种状态订单的数量信息
		var getCounts = function() {
			Order.getAllStatusCounts({}, function(data) {
				$scope.counts = angular.copy(data);
				$scope.counts[$scope.active] = $scope.pageParams.totalElements;
			});
		};

		// 根据状态码获取对应状态的时间信息
		var getTimeByStatus = function(order, statushistory, statusCode, statusStr) {
			angular.forEach(eval(statushistory), function(statushistory) {
				if (statushistory.status === statusCode) {
					order[statusStr + 'Time'] = statushistory.time;
				}
			});
		};
		
		$scope.orderby = 'status';

		// 设置激活状态
		$scope.setActive = function(state) {
            window.sessionStorage.removeItem("exType");
			SessionService.set('todoState',state);
			clearchecked();	// 清除多选数据
			$scope.currentCurrency = ''; //切换状态之后，清空数据
			if($scope.active != state) {
				$scope.active = state;
			}
			$scope.isShowPop = false;
			getOperatorS();

			/*//  之后去除
			if ($scope.active != 'all') {
				$scope.keyword = null;
			}*/

			if ($scope.ordertodoTableParams.page() != 1) {
				$scope.ordertodoTableParams.page(1);
			}
			$scope.ordertodoTableParams.reload();
		};

        // 正常交易/异常申请/异常通知/退货/换货     normal / notify / apply / return / exchange / refund
        $scope.setExType = function (type, state) {
            window.sessionStorage.setItem('exType', type);
            SessionService.set('todoState',state);
            clearchecked();	// 清除多选数据
            $scope.currentCurrency = ''; //切换状态之后，清空数据
            $scope.active = state;
            $scope.ordertodoTableParams.page(1);
            $scope.isShowPop = false;
            $scope.ordertodoTableParams.reload();
        };
		
		// ng-table加载订单数据
		$scope.ordertodoTableParams = new ngTableParams({
			page : 1,
			count : 10,
			sorting : {
				creattime : "DESC"
			}
		}, {
			total : 0,
			getData : function($defer, params) {
				
				$scope.loading = true;
				$scope.paginationParams = params;
				var param = BaseService.parseParams(params.url());
				param.keyword = $scope.keyword;
				param.status = getState();
                param.exType = window.sessionStorage.getItem('exType');
				param.startDate = angular.copy($scope.startDate);
				param.endDate = angular.copy($scope.endDate);
				$scope.count = 0;
				$scope.startDate = undefined;
				$scope.endDate = undefined;

				// 根据参数获取订单信息
				Order.getIndividualOrder(param, function(page) {

					// console.log('TEST PAGE DATA');
					// console.log(page);

					// 将数据清零
					clearchecked();
					var orderCount = page.content.length;
					$scope.checks.checked = false;
					if(orderCount != 0) {
						angular.forEach(page.content, function(value, key){
							// 给checkCodes数组赋初始值
							if($scope.checkCodes.length < orderCount) {
								$scope.checkCodes.push(false);
							}
						});
					}

					console.log(page);
					
					if (page && page.content) {
						// 设置分页参数
						$scope.pageParams.number = page.number;
						$scope.pageParams.content = page.content;
						$scope.pageParams.totalElements = page.totalElements;
						$scope.pageParams.totalPages = page.totalPages;
						params.total(page.totalElements);
						$scope.counts = page;
						$scope.exCountMap = page.exCountMap;

						$scope.orders = page.content;
						$scope.orderLength = page.content ? page.content.length : 0;
						$scope.count = 0;
						$scope.currentCurrency = "";// 换页，等都需要清空数据
						angular.forEach(page.content, function(order){
							order.puExInfoJson = eval(order.puExInfoJson);

							var orderDatails = angular.copy(order.orderDetails);
							// 获取型号数量
							var components = {};
							angular.forEach(orderDatails, function(orderDatail, key){
								components[orderDatail.uuid] ++;
							});
							order.codeNum = Object.getOwnPropertyNames(components).length;
							//  获取付款到账时间[已付款时间]
							if(order.deliverTime) {
								order.deliverTime = order.deliverTime.replace(':', ''); // 去掉冒号
								order.deliveryTimes = order.deliverTime.split(',');
							}
							// 当订单状态码为失效状态时
							var statusCode = order.status;
							if (statusCode == 602 || statusCode == 603 || statusCode == 604 || statusCode == 315 || statusCode == 605 || statusCode == 606) {
								getTimeByStatus(order, order.statushistory, statusCode, 'unavailable');
								order.unavailableReason = unavailableReasons[statusCode];
							}
						});
                        getExMsgState();
					}
				});
			}
		});
		// 进入页面加载订单列表数据
		$scope.ordertodoTableParams.reload();

		// 分页操作
		$scope.topage = function(num) {
			if ($scope.topagenum !== null) {
				$scope.topagenum = null;
			}
			if (num < 1) {
				num = 1;
			} else if (num > $scope.pageParams.totalPages) {
				num = $scope.pageParams.totalPages;
			}
			$scope.ordertodoTableParams.page(num);
			$scope.ordertodoTableParams.reload();
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
		
		// 将输入单号自动转换成大写
		$scope.upper = function() {
			$scope.time = 1;
			clearTimeout(t);
			setTime();
		};
		
		// 根据订单号搜索单据
		$scope.onSearch = function() {
			$scope.keyword = angular.uppercase($scope.keyword);
			//  如果按关键字进行搜索，则暂时置为全部状态
			/*if ($scope.keyword) {
				$scope.setActive('all');
			} else {*/
				if ($scope.ordertodoTableParams.page() != 1) {
					$scope.ordertodoTableParams.page(1);
				}
				$scope.ordertodoTableParams.reload();
			/*}*/
		};
		
		// 将数据清零
		var clearchecked = function () {
			$scope.canDo = false;
			$scope.checks = {
					checked : false
				};
			$scope.checkCodes = [];
			$scope.store ={};
		};
		
		// 多选操作
		$scope.checks = {
			checked : false
		};
		
		// 点击多选框进行单选操作
		$scope.checkCodes = [];
		$scope.checkOne = function(index) {
			
			var result = true;
			var order = $scope.pageParams.content[index];
			
			// 进行批量填写银行转账信息操作
			if ($scope.active == 'tobepaid') {
				// 如果是批量填写银行转账信息的第一条有效订单信息，选中当前的币别作为付款币种
				if (!$scope.count && order.availabletime >= $scope.nowTime) {
					$scope.count = 1;
					$scope.store[order.orderid] = true;
					$scope.checkCodes[index] = true;
					$scope.currentCurrency = order.currency;
					$scope.canDo = true;
					return ;
				}
				// 如果当前活动状态为待付款且订单已过期或币种与选中币种不同时，则提示用户
				if (order.availabletime < $scope.nowTime || $scope.currentCurrency != order.currency) {
					$scope.checkCodes[index] = false;
					toaster.pop('info', '当前订单已过期，或者与已选的订单的币别不一致 : ' + $scope.currentCurrency);
					return;
				}
				// 如果订单没有选中过，则添加；否则，删除
				if (!$scope.store.hasOwnProperty(order.orderid)) {
					$scope.count ++;
					$scope.store[order.orderid] = true;
					$scope.checkCodes[index] = true;
				} else {
					$scope.count --;
					delete $scope.store[order.orderid];
					$scope.checkCodes[index] = false;
					if (!$scope.count) {
						$scope.canDo = false;
					}
				}
				return;
			}
			// 批量确认收货
			if ($scope.active == 'tobereceive') {
				// 如果订单过期或者平台没有发货，则不选中checkbox
				if (order.status != 404) {
					$scope.checkCodes[index] = false;
					toaster.pop('info', '当前订单已过期或平台没有发货');
					return;
				}
				// 如果是第一条有效订单信息，则设置$scope.count为1
				if (!$scope.count) {
					$scope.count = 1;
					$scope.store[order.id] = true;
					$scope.checkCodes[index] = true;
					$scope.canDo = true;
					return;
				}
				// 如果订单没有选中过，则添加；否则，删除
				if (!$scope.store.hasOwnProperty(order.id)) {
					$scope.count ++;
					$scope.store[order.id] = true;
					$scope.checkCodes[index] = true;
				} else {
					$scope.count --;
					delete $scope.store[order.id];
					$scope.checkCodes[index] = false;
					if (!$scope.count) {
						$scope.canDo = false;
					}
				}
				return;
			}
			// 批量删除订单
			if ($scope.active == 'unavailable') {
				// 如果是第一条订单信息，则设置$scope.count为1
				if (!$scope.count) {
					$scope.count = 1;
					$scope.store[order.id] = true;
					$scope.checkCodes[index] = true;
					$scope.canDo = true;
					return;
				}
				// 如果订单没有选中过，则添加；否则，删除
				if (!$scope.store.hasOwnProperty(order.id)) {
					$scope.count ++;
					$scope.store[order.id] = true;
					$scope.checkCodes[index] = true;
				} else {
					$scope.count --;
					delete $scope.store[order.id];
					$scope.checkCodes[index] = false;
					if (!$scope.count) {
						$scope.canDo = false;
					}
				}
			}
		};

		
		// 获得拼接好的订单号字符串
		var getStrOrderids = function(order){
			var arr = [];
			$scope.total = 0;
			var orders = $scope.ordertodoTableParams.data;
			if(orders){
				for(var i = 0; i < orders.length; i++) {
					if($scope.checkCodes[i]) {
						arr.push(orders[i].orderid);
					}
				}
			}
			return arr.join("-");
		};
		
		// 获得拼接好的订单的id字符串
		var getStrids = function() {
			var arr = [];
			var orders = $scope.ordertodoTableParams.data;
			if(orders){
				for(var i = 0; i < orders.length; i++) {
					if($scope.checkCodes[i]) {
						arr.push(orders[i].id);
					}
				}
			}
			return arr.join("-");
		};

		//  打开下拉菜单
		$scope.showPop = function() {
			$scope.isShowPop = !$scope.isShowPop;
		};

		//  选择下单时间分段
		$scope.chooseInternal = function(inType) {
			var nowDate = new Date();
			// 30天后
			nowDate.setDate(nowDate.getDate() - 30);
			var startDate = angular.copy(nowDate);
			// 90天后
			nowDate.setDate(nowDate.getDate() - 30 * 2);
			var endDate = angular.copy(nowDate);
			switch (inType) {
				case 1:
					$scope.startDate = startDate.getTime();
					$scope.endDate = undefined;
					break;
				case 2:
					$scope.startDate = endDate.getTime();
					$scope.endDate = startDate.getTime();
					break;
				case 3:
					$scope.startDate = undefined;
					$scope.endDate = endDate.getTime();
					break;
			}
			$scope.ordertodoTableParams.page(1);
			$scope.ordertodoTableParams.reload();
			$scope.isShowPop = false;
		};
		
		//批量确认订单
		$scope.ensure = function(orders){
			var url = null;
			if(orders) {
				url = "products/orderEnsure/" + enIdFilter(orders.orderid);
			}else {
				url = "products/orderEnsure/" + enIdFilter(getStrOrderids());
			}
			$window.open(url);
		};
	
		
		$scope.comfirmCancle = function(orderDetail) {
			//可以处理多张订单明细
			Order.comfirmCancle(null, {ids : orderDetail.id}, function(data) {
				$scope.ordertodoTableParams.page(1);
				$scope.ordertodoTableParams.reload();
				toaster.pop('success', '取消成功');
			}, function(response) {
				toaster.pop('error', '取消失败 ' + response.text);
			});
		};
		
		//  确认支付（改）
		$scope.comfirmPay = function(order) {
			
			window.location.replace("product/orderEnsure/" + enIdFilter(order.orderid));
			// 如果订单待确认，跳转到订单确认页面，否则判断订单是否为待付款
			/*if (order.status == 501) {
				window.location.replace("product#/orderEnsure/" + enIdFilter(order.orderid));
			} else if (order.status == 503) {
				// 订单处于待付款状态
				var orderNum = order.orderid;
				if(!orderNum) {
					toaster.pop('error', '请指定需要填写账款信息的订单！');
					window.event.returnValue=false;
					return ;
				}
				SessionService.set("ids", orderNum);
				SessionService.set("page", $scope.ordertodoTableParams.page());
				SessionService.set("count", $scope.ordertodoTableParams.count());
				$state.go('myOrder_transfer');
			}*/
		};
		
		//  确认付款
		$scope.banktf = function(orders, Nbatch){
			var orderids = Object.getOwnPropertyNames($scope.store);
			var orderNum = Nbatch ? orders.orderid : orderids.join("-");
			if(!orderNum) {
				toaster.pop('error', '请指定需要填写账款信息的订单！')
				window.event.returnValue=false;
				return ;
			}
			SessionService.set("ids", orderNum);
			SessionService.set("page", $scope.ordertodoTableParams.page());
			SessionService.set("count", $scope.ordertodoTableParams.count());
			$state.go('myOrder_transfer');
		};
		
		// 确认收货
		$scope.ensureAccept = function(order) {
			var orderids = Object.getOwnPropertyNames($scope.store);
			var ids = order ? order.id : orderids.join("-");
			OrderSimpleInfo.ensureAccept({ids: ids},{},function(data){
				$scope.ordertodoTableParams.page(1);
				$scope.ordertodoTableParams.reload();
				toaster.pop('success', '处理成功');
			}, function(res){
				console.log(res);
				toaster.pop('error', '失败！');
			});
		};
		
		//【批量】删除订单
		$scope.deleteOrder = function(order) {
			var orderids = Object.getOwnPropertyNames($scope.store);
			var ids = order ? order.id : orderids.join("-");
			var flag = window.confirm('删除订单');
			if (flag) {
				Order.deleteOrder({ids : ids}, function() {
					$scope.ordertodoTableParams.page(1);
					$scope.ordertodoTableParams.reload();
					toaster.pop('success', '删除成功');
				}, function() {
					toaster.pop('error', '操作失败！');
				});
			}
		};
		
		// 取消订单
		$scope.cancel = function(order) {
			$modal.open({
				animation : true,
				templateUrl : 'static/view/usercenter/modal/cancelOrder_modal.html',
				controller : 'OrderCancelCtrl',
				windowClass : 'modal-normal'
			}).result.then(function(data){
				// 处理模态框返回的数据
				if (order.status == 503 || order.status == 501) {
					if (order.status == 503) {
						OrderSimpleInfo.releaseOrder({orderid: enIdFilter(order.orderid)},{},function(){
							$scope.ordertodoTableParams.reload();
							toaster.pop('success', '取消订单成功');
							$scope.ordertodoTableParams.reload();
						}, function(){
							toaster.pop('error', '失败！');
						});
					}else {
						Order.cancle({orderid: enIdFilter(order.orderid)},{},function(){
							$scope.ordertodoTableParams.reload();
							toaster.pop('success', '取消订单成功');
							$scope.ordertodoTableParams.reload();
						}, function(){
							toaster.pop('error', '失败！');
						});
					}
				}else {
					toaster.pop('success', '提示', '此功能还未开放，请耐心等待!');
				}
			});
		};

		// 查询数据库统计购物车中的商品数量
		var countCarts = function () {
			Cart.getCount({}, function(data){
				$rootScope.countCart = data.count;
			}, function(res){
			});
		};
		
		// 还订这批
		$scope.bookAgain = function(order) {
			var carts = [];
			angular.forEach(order.orderDetails, function(orderDetail) {
				var cart = {
					batchCode : orderDetail.batchCode,
					number : orderDetail.number
				};
				carts.push(cart);
			});
			var json = {
				currency	: order.currency,
				arrOD		: carts
			};
			Order.saveByGroup({}, json, function(data){
				window.location.replace('products/orderEnsure/'+ enIdFilter(data.orderid));
			}, function(){
				toaster.pop('warnning', '警告', "商品的库存不足无法下单");
			});
		};

		$scope.urgeDelivery = function (order) {
			toaster.pop('warnning', '提示', '此功能还未开放，请耐心等待！');
		};
		
		if($stateParams.state) {
			$scope.setActive($stateParams.state);
		}

		/**
		 * 获取异常消息状态
         */
		var getExMsgState = function () {
			var applyIds = [], notifyIds = [];
			angular.forEach($scope.orders, function (order) {
			    if(order.launchOrExApplyId) {
                    applyIds.push(order.launchOrExApplyId);
                }
				if(order.puExInfoJson) {
				    angular.forEach(order.puExInfoJson, function (puEx) {
                        notifyIds.push(puEx.puExApplyId);
                    })
                }
			})
			buyerGetApplyMsgState(applyIds);
			buyerGetNotifyMsgState(notifyIds);
		}

		/**
		 * 买家获取异常申请消息状态
		 */
		var buyerGetApplyMsgState = function (applyIds) {
			AfterSale.buyerGetApplyMsgState({applyIds: applyIds}, function (data) {
				$scope.applyMsgState = data;
			}, function (error) {
				toaster.pop('error', '获取异常申请消息状态失败');
			})
		};

		/**
		 * 买家获取异常通知消息状态
		 */
		var buyerGetNotifyMsgState = function (notifyIds) {
			AfterSale.buyerGetNotifyMsgState({notifyIds: notifyIds}, null, function (data) {
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
        }

	}]);

	// 取消订单模态框用到的Ctrl
	app.register.controller('OrderCancelCtrl', ['$scope', 'toaster', '$modalInstance', function($scope, toaster, $modalInstance) {
		
		$scope.cancel = function () {
			$modalInstance.dismiss();
		};

		$scope.confirm = function() {
			$modalInstance.close('CONFIRM');
			return true;
		};
	}]);
	
});