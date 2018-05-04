/**
 * Created by yujia on 2017/3/19.
 *  订单中心首页
 */
define(['app/app'], function (app) {
	'use strict';
	app.register.controller('orderCtrl', ['$scope', '$rootScope', 'Order', 'toaster', '$filter', 'OrderSimpleInfo', 'Recommendation', '$modal', 'tradeMessageNoticeService', 'tradeBasicProperties', 'NumberService', 'ChatBusinessLayer','Rate', function($scope, $rootScope, Order, toaster, $filter, OrderSimpleInfo, Recommendation, $modal, tradeMessageNoticeService, tradeBasicProperties, NumberService, ChatBusinessLayer, Rate) {

		document.title = '已买到的产品-优软商城';
		//初始化数据
		$rootScope.active = 'buyer_order';
		$scope.param = {};
		$scope.param.page = 1;
		$scope.param.count = 5;
		$scope.param.sorting = {creattime : "DESC"};

		//获取当前页订单信息
		//TODO  先获取全部的订单
		$scope.status = 'all';
		$scope.param.status = getState();

		//存放勾选的订单
		$scope.store = {};
		$scope.startDate = null;
		$scope.endDate = null;

		// 加密订单的ID过滤器
		var enIdFilter = $filter('EncryptionFilter');

		$scope.status = 'all';

		$scope.toggleStatus = function(status) {
			$scope.status = status;
            $scope.param.page = 1;
            $scope.param.currentPage = $scope.param.page;
			$scope.param.status = getState();
			if ($scope.status === 'tobecomment'){
                $scope.param.isRate = true;
			}else{
                $scope.param.isRate = false;
			}
			$scope.param.keyword = $scope.keyword;
			// $scope.param.startDate = $scope.startDate ? $scope.startDate.getTime() : null;
			// $scope.param.endDate = $scope.endDate ? $scope.endDate.getTime() + 86400000 : null;
			$scope.startDate = null;
			$scope.endDate = null;
			$scope.param.startDate = null;
			$scope.param.endDate = null;
			$scope.childStatus ='';
            $scope.childStatusName = '订单状态';
			loadData();
			getCounts();
		};
        //设置子状态码的映射
        $scope.childStatus = '';
        $scope.childStatusName = '订单状态';
		$scope.setChildStatus = function (status,name) {
            $scope.childStatus = status;
            $scope.childStatusName = name;
			$scope.param.page = 1;
            if ($scope.childStatus!==''){
                $scope.param.status = $scope.childStatus;
            }else{
                $scope.param.status = getState();
            }
			loadData();
			getCounts();
		};

		$scope.deleteOrder = function (order) {
			Order.changeOrderUsed({orderid: order.orderid}, {}, function (data) {
				order.showDelete = false;
				$scope.reload();
			});
		};

		// 根据当前状态获取对应的状态码值
		function getState() {
			var state = null;
			switch($scope.status) {
				case 'all' : // 全部
					state = '503-504-524-525-505-406-407-403-408-404-405-520-523-522-602-603-315-604-605-606'; break;
				case 'tobepaid' : // 待付款
					state = '503-504-524-525'; break; // 504-已付款， 放在待付款下面，商城确认收款后再放到待发货
				case 'tobedeliver' : // 待发货
					state = '505-406-407-403-408'; break;
				case 'tobereceive' : // 待收货
					state = '404'; break;
				case 'received' : // 已收货
					state = '405'; break;
				case 'success': // 已完成
					state = '520-405'; break;
				case 'unavailable' : // 已失效
					state = '602-603-315-604-605-606'; break;
				case 'tobecomment' :
					state = '520-405'; break;
				//下面的状态栏新增的状态
				case 'tobepay':
					state = '503'; break;
				case 'tobeconfirmedpay':
					state = '504'; break;
                case 'cancel':
                    state = '602-603-315-604-605'; break;
                case 'tradeclose':
                    state = '606'; break;
			}
			return state;
		}

		// 获取各种状态订单的数量信息
		var getCounts = function() {
			Order.getAllStatusCounts({}, function(data) {
				$scope.counts = angular.copy(data);
			});
		};

		getCounts();

		$scope.sortingState = {
			state:'orderBycreatetimeDesc'
		};

		$scope.changeOrderState = function (state) {
			if ($scope.sortingState.state === state){
				$scope.param.sorting = {creattime : 'DESC'};
				$scope.sortingState.state = 'orderBycreatetimeDesc';
				$scope.reload();
				return false;
			} else {return true;}
		};
		$scope.orderBybatchQtyDesc = function(){
			if($scope.changeOrderState('orderBybatchQtyDesc')){
				$scope.param.sorting={batchQty : 'DESC'};
				$scope.sortingState.state = 'orderBybatchQtyDesc';
				$scope.reload();
			}
		};
		$scope.orderBybatchQtyAsc = function(){
			if ($scope.changeOrderState('orderBybatchQtyAsc')){
				$scope.param.sorting={batchQty : 'ASC'};
				$scope.sortingState.state = 'orderBybatchQtyAsc';
				$scope.reload();
			}
		};
		$scope.orderByensurePriceDesc = function(){
			if ($scope.changeOrderState('orderByensurePriceDesc')){
				$scope.param.sorting={currency : 'ASC',ensurePrice : 'DESC',creattime : 'DESC'};
				$scope.sortingState.state = 'orderByensurePriceDesc';
				$scope.reload();
			}
		};
		$scope.orderByensurePriceAsc = function(){
			if ($scope.changeOrderState('orderByensurePriceAsc')){
				$scope.param.sorting={currency : 'DESC',ensurePrice : 'ASC',creattime : 'DESC'};
				$scope.sortingState.state = 'orderByensurePriceAsc';
				$scope.reload();
			}
		};

		var loadData = function() {
			Order.getIndividualOrder($scope.param, function(data) {
                if (!$scope.startDate && !$scope.endDate && !$scope.keyword){
                    $scope.AllOrderInfo = data;
                    if($scope.childStatus ==''){
                        $scope.AllOrderInfo[$scope.status] = data.totalElements;
                    }
				}
                $scope.isSearch = false;
				$scope.currenctOrders = data.content;
				angular.forEach($scope.currenctOrders, function(data){
                    data.ensurePrice = Number(NumberService.toCeil(data.ensurePrice, 2));
					Rate.getRateBuyer({orderId:data.orderid},{},function (result) {
						if (result.data){
							data.isEachRate = true;
						}
					});
				});
				$scope.accumulateNotifyTime($scope.currenctOrders);
				$scope.param.currentPage = data.number;
				$scope.acculatePages(data.number, data.totalPages);

				angular.forEach($scope.currenctOrders, function (data) {
					// 循环判断一期都没有付款并且延期的
					if (data.installmentId && data.installment.status == 503) {
						angular.forEach(data.installment.installmentDetails, function (detailslist) {
							var nowTime = new Date();
							if (detailslist.status == 503 && nowTime.getTime() > detailslist.deadline){
								data.Overtime = true;
							}
						})
					}
					if (data.installmentId && data.installment.status == 504) {
						angular.forEach(data.installment.installmentDetails, function (detailslist) {
							if (detailslist.status == 504) {
								data.againUpload = true;
							}
						})
					}
					// 循环判断已付款未收款卖家可取消的

				});

			}, function(response) {
				toaster.pop('error', '获取订单失败 ' + response.data);
			});
		};

		/**
		 * 1054 是 代表提醒发货的类型
		 */
		tradeBasicProperties.get({type : 1054} ,function (data) {
			$scope.notifySellerShip = parseInt(data.info);
			if($scope.notifySellerShip < 1) {
				toaster.pop('error', '商城的配置信息（提醒发货时间）有误，请联系商城管理员');
			}
		}, function (res) {
			toaster.pop('error', '获取商城的配置信息失败');
		});

		/**
		 * 计算距离的时间
		 * 1：订单收款时间 (距离现在多少个小时)
		 * 2：上一次发货提醒的时间 (距离现在多少个小时)
		 * 3：如果是待收货，则计算具体自动收货还有多少时间
		 */
		$scope.accumulateNotifyTime = function (orders) {
			if(!orders || !orders.length) {
				return ;
			}
			for(var i = 0; i < orders.length; i++) {
				var order = orders[i];
				if(order.status == 505 || order.status == 406 || order.status == 407
					|| order.status == 403 || order.status == 408) {
					order.paidTimeFromNow = getHoursFromNow(order.paytime);
					order.lastNotiDelivery = getHoursFromNow(order.lastNotifyDeliveryTime);
				}
				if(order.status == 404) {
					var statusArray = angular.fromJson(order.statushistory);
					for(var j = 0; j < statusArray.length; j++){
						if(statusArray[j].status == 404) {
							order.shipOutTime = getHoursFromNow(statusArray[j].time);
						}
					}
				}
			}
		}

		/**
		 * 传入时间，计算距离现在的时间是多少小时了
		 * @param time
		 * @returns hours 多少个小时
		 */
		var getHoursFromNow = function(time) {
			if (!time) {
				return 0;
			}
			var newTime = new Date();
			var msec = newTime.getTime() - time;
			var hours = parseInt(parseInt(msec) / (1000 * 60 * 60));
			return hours;
		};

		loadData();

		// 确认收货
		$scope.ensureAccept = function(order) {
			var orderids = Object.getOwnPropertyNames($scope.store);
			var ids = order ? order.id : orderids.join("-");
			OrderSimpleInfo.ensureAccept({ids: ids},{},function(data){
				loadData();
				getCounts();
				toaster.pop('success', '成功' ,'确认收货成功');
			}, function(res){
				toaster.pop('error', '失败！' + res.data);
			});
		};

		//取消订单状态码
		$scope.cancelOrderArray = {
			602: true,
			603: true,
			315: true,
			604: true,
			605: true,
			606: true
		};

		var getRecommendComps = function (userUU, usedFor, pageable) {
			Recommendation.getRecommendComps({page: pageable.page, size: pageable.size}, function (data) {
				$scope.recommendComps = data.content;
			}, function (error) {
				toaster.pop('error', '获取推荐器件失败');
			})
		};
		getRecommendComps(null, null, {page: 0, size: 12});

		// 重新加载数据
		$scope.reload = function () {
			loadData();
		};

		// 同意卖家取消订单
		$scope.requestCancelBox = false;
		$scope.requestCancel = function (item, id) {
			$scope.requestCancelBox = true;
			$scope.cancleOrder = {};
			$scope.cancleOrder = item;
		};
		$scope.cancelRequestCancelBox = function () {
			$scope.requestCancelBox = false;
		};
		// 同意取消
		$scope.confirmRequest = function () {
			OrderSimpleInfo.userAuditCancelOrder({orderid: $scope.cancleOrder.orderid},null, function () {
				toaster.pop('success', '已同意卖家取消订单申请');
				$scope.requestCancelBox = false;
				loadData();
			}, function (response) {
				toaster.pop('error', response.data);
				$scope.requestCancelBox = false;
			});
		};
		// 拒绝取消
		$scope.cancelRequest = function () {
			OrderSimpleInfo.userUnauditCancelOrder({orderid: $scope.cancleOrder.orderid},null, function () {
				toaster.pop('success', '已拒绝卖家取消订单申请');
				loadData();
				$scope.requestCancelBox = false;
			}, function (response) {
				toaster.pop('error', response.data);
				$scope.requestCancelBox = false;
			});
		};
		/**
		 * 取消订单
		 * @param id 传入的订单id
		 */
		$scope.cancle = function (orderid) {
			if(!orderid) {
				return ;
			}
			$modal.open({
				templateUrl: 'static/view/usercenter/modal/cancelOrder_modal.html',
				size : 'md',
				controller : 'cancelControler',
				resolve : {
					orderid : function () {
						return orderid;
					}
				}
			}).result.then(function () {
				$scope.reload();
			}, function () {
				toaster.pop('info', '提示 ' + '您取消了对订单的操作');
			});
		};

		/**
		 * 买家提醒买家发货
		 */
		$scope.remindShip = function (order) {
			if(order.paidTimeFromNow < $scope.notifySellerShip) {
				toaster.pop('info', '距离付款的时间还不到' + $scope.notifySellerShip +'小时，不能提醒发货');
				return ;
			}
			//如果第一次提醒，则order.lastNotiDelivery应该为0
			if(order.lastNotiDelivery < $scope.notifySellerShip && order.lastNotiDelivery != 0) {
				toaster.pop('info', '距离上次付款的时间还不到' + $scope.notifySellerShip +'小时，不能提醒发货');
				return ;
			}
			tradeMessageNoticeService.notifySellerShip({id : order.id}, null, function (data) {
				if(data.code == 1) {
					//设置买家发货提示为真
					$scope.noticeSellerShipTip = true;
					var returnResult = data.data;
					if(returnResult.status == 505 || returnResult.status == 406 || returnResult.status == 407
						|| returnResult.status == 403 || returnResult.status == 408) {
						returnResult.paidTimeFromNow = getHoursFromNow(returnResult.paytime);
						returnResult.lastNotiDelivery = getHoursFromNow(returnResult.lastNotifyDeliveryTime);
					}
					//替换当前这一条订单的订单
					for (var i = 0; i < $scope.currenctOrders.length; i++) {
						if($scope.currenctOrders[i].orderid == returnResult.orderid) {
							$scope.currenctOrders[i] = returnResult;
							break;
						}
					};
				}else {
					toaster.pop('warning', '提醒发货失败：' + data.message);
				}
			}, function (res) {
				console.log(res);
				toaster.pop('error', '提醒发货失败');
			});
		};

		$scope.condition = {
			startDateOpen: false,
			endDateOpen: false
		};

		// 打开日期选择框
		$scope.openDatePicker = function($event, item, openParam, status) {
            if (status != null) {
                if (status == 1) {
                    if ($scope.startDate != null) {
                        return;
                    }
                }
                if (status == 2) {
                    if ($scope.endDate != null) {
                        return;
                    }
                }
            }
			$event.preventDefault();
			$event.stopPropagation();
			item[openParam] = !item[openParam];
			if (openParam == 'startDateOpen'){
				if (item['endDateOpen']){
                    item['endDateOpen'] = !item['endDateOpen'];
				}
			} else if(openParam == 'endDateOpen'){
                if (item['startDateOpen']){
                    item['startDateOpen'] = !item['startDateOpen'];
                }
            }
		};

		// 选择查找日期
		$scope.onDateCondition = function(isStart){
			if(typeof $scope.startDate == 'undefined' || typeof $scope.endDate == 'undefined'){
				alert("日期格式错误，请重新输入！");
				$scope.startDate = null;
				$scope.endDate = null;
				return;
			}
			if ($scope.condition.endDateOpen) {
				$scope.endDate = $scope.endDate.toString().replace(/[0-9]{2}:[0-9]{2}:[0-9]{2}/g, '23:59:59');//;'23.59';//DateUtil.yyyyMmDd($scope.endDate.getTime() + 86399000);
				$scope.endDate = new Date(formatDateTime(new Date($scope.endDate.toString())));
			}
			if ($scope.endDate !== null && $scope.startDate>$scope.endDate){
				if (isStart){
					alert("开始日期大于结束日期，请重新输入！");
					$scope.startDate = null;
				} else {
					alert("开始日期大于结束日期，请重新输入！");
					$scope.endDate = null;
				}
				return;
			}
			$scope.param.startDate = $scope.startDate ? $scope.startDate.getTime() : null;
			$scope.param.endDate = $scope.endDate ? $scope.endDate.getTime()  : null;

			//loadData();
			//getCounts();
		};
        var formatDateTime = function (date) {
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? ('0' + m) : m;
            var d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            var h = date.getHours();
            var minute = date.getMinutes();
            var sec = date.getSeconds();
            minute = minute < 10 ? ('0' + minute) : minute;
            return y + '-' + m + '-' + d+' '+h+':'+minute+':'+sec;
        };

		/**
		 * 订单搜索
		 */
		$scope.search = function () {
			if ($scope.param.startDate != null && $scope.param.endDate != null){
				if ($scope.param.startDate > $scope.param.endDate){
					alert("开始时间不得超过结束时间！");
					return;
				}
			}
			$scope.param.page = 1;
			$scope.param.status = getState();
			$scope.param.keyword = $scope.keyword;
            $scope.setChildStatus('','订单状态')
			loadData();
			//getCounts();
		};

		$scope.noticeShipConfirm = function () {
			$scope.noticeSellerShipTip = false;
		};

		$scope.showDeleteOrder = function (order) {
			order.showDelete = !order.showDelete;
			var showid = order.id;
			angular.forEach($scope.currenctOrders, function (data) {
				if(data.id != showid){
					data.showDelete = false;
				}
			});
		};

		$scope.contactSeller = function(order){
			// 联系卖家，卖家信息弹出对话框
            order.active = !order.active;
            var activeid = order.id;
            angular.forEach($scope.currenctOrders, function(data){
                if(data.id != activeid){
                    data.active = false;
                }
            });
		};

		document.onclick = function (event) {
			var element = event.srcElement;
			if(!event.srcElement) {
				return ;
			}
			var elementName =  element.getAttribute("name");
			$scope.$apply(function () {
				if (!$scope.currenctOrders){
					$scope.currenctOrders = {};
				}
				for(var i = 0; i < $scope.currenctOrders.length; i++) {
					var isThisTag = false;
					if(elementName && $scope.currenctOrders[i].id == elementName) {
						isThisTag = true;
					}
					var parentEle = element.parentElement;
					if(!isThisTag) {
						while (parentEle && parentEle.tagName && parentEle.tagName != 'BODY') {
							var parentElementName =  parentEle.getAttribute("name");
							if(parentElementName && $scope.currenctOrders[i].id == parentElementName) {
								isThisTag = true;
							}
							parentEle = parentEle.parentElement;
						}
					}
					if(!isThisTag) {
						$scope.currenctOrders[i].active = false;
					}
				};
			});
		};

		/******************根据页数设置翻页的信息********start**************************/

		//输入框监听Enter事件
		$scope.listenEnter = function () {
            if(event.keyCode == 13) {
                $scope.setPage("page", $scope.param.currentPage);
            }
        };

		$scope.setPage = function(type, number) {
			if(type != 'prev' &&  type != 'page' && type != 'next' && type != 'last' && type != 'first') {
				return ;
			};
			var page = -1;
			switch (type) {
				case "page":
					if(number < 1) {
						page = 1;
					}else if(number > $scope.AllOrderInfo.totalPages) {
						page = $scope.AllOrderInfo.totalPages;
					}else {
						page = number;
					};
					break;
				case "prev":
					if($scope.param.page <= 1) {
						page = 1;
					}else {
						page =$scope.param.page - 1;
					};
					break;
				case "next":
					if($scope.param.page >= $scope.AllOrderInfo.totalPages) {
						page = $scope.AllOrderInfo.totalPages
					}else {
						page =$scope.param.page + 1;
					}
					break;
				case "first":
					page = 1;
					break;
				case "last":
					page = $scope.AllOrderInfo.totalPages;
					break;
			}
			if(page == $scope.param.page || page < 1 || page > $scope.AllOrderInfo.totalPages) {
				$scope.param.currentPage = $scope.param.page;
				return ;
			}
			$scope.param.page = page;
			loadData();
		};

		//当前页在前段的计算方式
		$scope.frontSegment = function (currentPage, totalElementPages) {
				angular.forEach($scope.pages, function (page) {
					switch (page.number) {
						case 8:
							page.type = 'more';
							page.active = false;
							break;
						case 0:
							if(currentPage == 1) {
								page.active = false;
							}
						default : {
							page.current = (currentPage == page.number);
						}
					}
				});
		};

		//当前页在后端计算方式
		$scope.endSegment = function (currentPage, totalElementPages) {
				angular.forEach($scope.pages, function (page) {
					switch (page.number) {
						case 2:
							page.active = false;
							page.type = 'more';
							break;
						case 10:
							if(currentPage == totalElementPages) {
								page.active = false;
							}
							break;
						case 0:
						case 1:
							break;
						default:
							if(page.number != totalElementPages) {
								page.number = totalElementPages - 9 + page.number;
							}
							page.current = (currentPage == page.number);
							break;
					}
				});
		};

		//当前页在中间计算方式
		$scope.middleSegment = function (currentPage) {
			angular.forEach($scope.pages, function (page) {
				switch (page.number) {
					case 2:
					case 8:
						page.type ='more';
						page.active = false;
						break;
					case 3:
						page.number = currentPage - 2;
						break;
					case 4:
						page.number = currentPage - 1;
						break;
					case 5:
						page.number = currentPage;
						page.current = true;
						break;
					case 6:
						page.number = currentPage + 1;
						break;
					case 7:
						page.number = currentPage + 2;
						break;
				}
			});
		}

		//初始化页数信息
		$scope.initPages = function (totalElementPages) {
			var pageNum = [];
			if(totalElementPages == 1) {
				return ;
			}else if(totalElementPages < 10) {
				for(var i = 0; i < totalElementPages + 2; i++) {
					pageNum.push(i);
				}
			}else {
				pageNum = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
			}
			angular.forEach(pageNum, function (number) {
				var page = {active : true, type : 'page', number : number};
				if(number == 0) {
					page.type = 'prev';
				}else if(number == 1) {
					page.type = 'first';
				}else if(number == pageNum.length - 2) {
					page.type = 'last';
					page.number = totalElementPages;
				}else if(number == pageNum.length - 1){
					page.type = 'next';
				}
				$scope.pages.push(page);
			});
		}

		//计算页数的方式。
		$scope.acculatePages = function(currentPage, totalElementPages) {
            $scope.pages = [];
            if(totalElementPages < 1)  {
                return ;
            }
			//初始化页面数据
			$scope.initPages(totalElementPages);
			if(totalElementPages < 10) {
				angular.forEach($scope.pages, function (page) {
					if(page.number == currentPage) {
						page.current = true;
					}
				});
			}else if(currentPage < 6) {//当期页小于6
				$scope.frontSegment(currentPage, totalElementPages);
			}else if(currentPage > totalElementPages - 5) { //当期页在后面
				$scope.endSegment(currentPage, totalElementPages);
			}else { //当期页在中间
				$scope.middleSegment(currentPage);
			}
		};
		/******************根据页数设置翻页的信息********end**************************/

	}]);

	app.register.filter('statusFilter', function () {
		return function (status) {
			var result = '无当前状态';
			switch (status) {
				case 501:
				case 502:
				case 503:
                case 524:
					result = '待付款';
					break;
				case 504:
					result = '付款确认中';
					break;
				case 525:
					result = '卖家请求取消';
					break;
				case 505:
				case 406:
				case 407:
				case 403:
				case 408:
					result = '待卖家发货';
					break;
				case 404:
					result = '待收货';
					break;
				case 520:
				case 405:
					result = '交易完成';
					break;
                /*case 523:
                    result = '待追评';
                    break;
				case 522:
					result = '已完成评价';
					break;*/
				case 602:
				case 603:
				case 315:
				case 604:
				case 605:
				case 606:
					result = '已取消';
					break;
			}
			return result;
		}
	});

	app.register.controller('cancelControler', ['$scope','orderid', 'OrderSimpleInfo', '$modalInstance', 'toaster', function ($scope, orderid, OrderSimpleInfo, $modalInstance, toaster) {

		$scope.order = {};
		$scope.orderid = orderid;

		/**
		 * 确认取消订单
		 */
		$scope.confirm = function () {
			if(!$scope.order.reason) {
				toaster.pop('info','请选择取消订单的原因');
				return ;
			}
			OrderSimpleInfo.releaseOrder({orderid : orderid}, {reason : $scope.order.reason}, function () {
				toaster.pop('success','取消订单成功');
				$modalInstance.close();
			}, function (res) {
				console.log(res);
				toaster.pop('error','取消订单失败，请重新操作');
			});
		}

		/**
		 * 取消操作
		 */
		$scope.cancel = function () {
			$modalInstance.dismiss();
		}

	}]);

	/**
	 * 与现在的时间对比，距离多少天多少小时
	 */
	app.register.filter('restTime', ['NumberService', function (NumberService) {
		var day = 0, hours = 0;
		return function (time) {
			if(!time) {
				return null;
			}
			var nowTime = new Date();
			var s1 = time - nowTime.getTime();
			if(parseInt(s1) <= 0) {
				return "到期未付款";
			}else {
				var totalHours = Math.ceil(s1/(1000*60*60));//算多少个小时
				day = parseInt(totalHours) / 24;
				hours = parseInt(totalHours) % 24;
				var str = "还剩";
				if(parseInt(day) > 0) {
					str = str + parseInt(day) + "天";
				}
				if(parseInt(hours) > 0) {
					str = str + parseInt(hours) + "小时";
				}
				return str;
			}


		}
	}]);

	/**
	 * totalHours传入小时，被减去minuesTime转换成天数
	 * 返回格式时  x天y小时
	 */
	app.register.filter('hoursToDay', function () {
		var day = 0, hours = 0;
		return function (totalHours, minuesdTime) {
			var h = minuesdTime - totalHours;
			day = parseInt(h) / 24;
			hours = parseInt(h) % 24;
			return "还剩 " + parseInt(day) + "天" + parseInt(hours) + "小时";
		}
	});
});
