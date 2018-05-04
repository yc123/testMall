
define(['app/app'], function(app) {
	"use strict";
	app.register.controller('orderDetailCtrl', ['$scope', 'Order', 'Logistics', 'ComponentActive', 'toaster', '$stateParams', 'KdnLogistics', '$state', 'StoreInfo', 'NumberService', function($scope, Order, Logistics, ComponentActive, toaster, $stateParams, KdnLogistics, $state, StoreInfo, NumberService) {

		document.title = '订单详情-优软商城';
		// 保存订单编号信息
		$scope.orderId = $stateParams.orderid;

		// 记录状态激活信息
		$scope.steps = {
			step1 : false,
			step2 : false,
			step3 : false,
			step4 : false,
			step5 : false
		};

		//物流信息的数组，待付款（503-504） 待发货（505-406-407-403-408）状态下是没有物流信息的。
		$scope.noLogisticInfoArray = {
			503: true,
			504: true,
			505: true,
			406: true,
			407: true,
			403: true,
			408: true,
			603: true
		};

		//配送方式列表
		$scope.deliveryMethod = {
			1301 : '第三方配送',
			1302 : '卖家配送',
			1303 : '上门自提'
		};

		// TODO 暂时假设运费固定为0
		$scope.freight = 0;

		/**********************************************************************
		 * 初始化
		 **********************************************************************/

		/**
		 * 处理错误信息
		 */
		$scope.error = function (message) {
			toaster.pop('error', message);
			$state.go('index');
		};

		/**
		 * 根据状态码获取状态码对应的时间
		 *
		 * @param status	订单状态码
		 */
		$scope.getTimeOfStatus = function (status) {
			var time = null;
			angular.forEach($scope.order.orderHistory, function (history) {
				if (history.status == status) {
					time = history.time;
				}
			});
			return time;
		};

		/**
		 * 确认当前订单所属状态
		 */
		// 联系卖家弹框
		$scope.contactBNox = false;
		$scope.contactSeller = function () {
			$scope.contactBNox = !$scope.contactBNox;
		};
		$scope.closeBox = function () {
			$scope.contactBNox = false;
		};
		$scope.stepStyle = function (status) {
			if (!status || status == '') {
				$scope.error('订单状态不能为空');
				return ;
			}

			angular.forEach($scope.steps, function (value, key) {
				if (value) {
					$scope.steps[key] = false;
				}
			});

			if (status == 501 || status == 503 || status == 504 || status == 524 || status == 525) {
				$scope.steps.step1 = true;
				$scope.steps.time1 = $scope.getTimeOfStatus(status);
			} else if (status == 505 || status == 406 || status == 407 || status == 403 || status == 408) {
				$scope.steps.step2 = true;
				$scope.steps.time1 = $scope.getTimeOfStatus(501);
				$scope.steps.time2 = $scope.getTimeOfStatus(status);
			} else if (status == 404) {
				$scope.steps.step3 = true;
				$scope.steps.time1 = $scope.getTimeOfStatus(501);
				$scope.steps.time2 = $scope.getTimeOfStatus(505);
				$scope.steps.time3 = $scope.getTimeOfStatus(status);
			} else if (status == 405) {
				$scope.steps.step4 = true;
				$scope.steps.time1 = $scope.getTimeOfStatus(501);
				$scope.steps.time2 = $scope.getTimeOfStatus(505);
				$scope.steps.time3 = $scope.getTimeOfStatus(404);
				$scope.steps.time4 = $scope.getTimeOfStatus(status);
			} else if (status == 520){
				$scope.steps.step5 = true;
				$scope.steps.time1 = $scope.getTimeOfStatus(501);
				$scope.steps.time2 = $scope.getTimeOfStatus(505);
				$scope.steps.time3 = $scope.getTimeOfStatus(404);
				$scope.steps.time4 = $scope.getTimeOfStatus(405);
				$scope.steps.time5 = $scope.getTimeOfStatus(status);
			}
		};

		// 根据收货地址字符串获取地址信息
		$scope.handlerAddressJSON = function (addressJson) {
			if (addressJson) {
				$scope.address = angular.fromJson(addressJson);
				$scope.address.area = $scope.address.area.replace(/,/g, ' ');
			}
		};

		/**
		 *  查询物流信息(接口需要真实运单号)
		 *
		 *  @param  kdnCompanyName	快递公司名称
		 *  @param	logisticsCode	运单号
		 *
		 */
		$scope.hasInfo = false;
		$scope.canShowInfo = false;
		var queryLogistics = function(lgtId){
			if (lgtId) {
				Logistics.findLogisticsById({lgtid: lgtId}, function(data){
					$scope.logistics = data;
					var params = {};
					console.log($scope.logistics);
					params.companyName = $scope.logistics.companyName;
					KdnLogistics.kdnQueryCompany({companyName:$scope.logistics.companyName}, function(response){
						console.log(response);
						if (response.code){
							$scope.canShowInfo = true;
						}else{
							$scope.canShowInfo = false;
						}
					},function (ex) {
						$scope.canShowInfo = false;
					});
					params.logisticsCode = $scope.logistics.number;
					KdnLogistics.kdnQuery(params, {}, function(response){
						if(!response.errorInfo) {
							$scope.logisticsInfo = eval ("(" + response.traces + ")");
                            if($scope.logisticsInfo.length != 0) {
                                $scope.hasInfo = true;
                            }
						}
					}, function(){
					});
				}, function(){
					toaster.pop('info', '根据快递ID查询跟订单相关联的物流信息失败');
				});
			}
		};

		$scope.findStoreInfoByStoreUuid = function (storeUuid) {
			if (storeUuid) {
				StoreInfo.findByUuid({ uuid : storeUuid}, {}, function (store) {
					if (store) {
						$scope.order.storeName = store.storeName;
					}
				});
			}
		};


		// 检测采购单编号ID是否存在，如果不存在跳转卖家中心首页
		if (!$scope.orderId || $scope.orderId == '') {
			$scope.error('订单编号ID不能为空');
		} else {

			/**
			 * 根据订单编号ID获取订单信息
			 */
			Order.getBuyerOrderDetail({orderid: $scope.orderId}, {}, function(data){
				if (!data || !data.id) {
					$scope.error("没有查询到该订单编号对应的订单信息");
					return ;
				}
				$scope.order = data;
				$scope.order.orderHistory = angular.fromJson($scope.order.statushistory);
				if ($scope.order.orderRemark){
					$scope.remarkList = angular.fromJson($scope.order.orderRemark);
				}
				if ($scope.order.jsonRule){
					$scope.rule = angular.fromJson($scope.order.jsonRule);
				}
				//自提点信息
				if ($scope.order.jsonTakeSelf){
					$scope.takeSelf = angular.fromJson($scope.order.jsonTakeSelf);
					$scope.takeSelf.area = $scope.takeSelf.area.replace(/,/g,' ');
				}
				// 设置状态样式
				$scope.stepStyle($scope.order.status);
				// 获取物流信息
				queryLogistics($scope.order.lgtId);
				// 发货地址信息
				$scope.handlerAddressJSON($scope.order.jsonAddress);
				// 查询店铺信息
				$scope.findStoreInfoByStoreUuid($scope.order.storeid);

				//订单备注
				if ($scope.order.orderRemark){
					$scope.remarkList = angular.fromJson($scope.order.orderRemark);
				}

				//发票信息
				$scope.order.invoiceInfo = angular.fromJson($scope.order.invoiceAddress);

				// 取消原因
				$scope.order.unavailableReason = angular.fromJson($scope.order.unavailableReason);

				//收货地址
				$scope.order.deliveryAddress = angular.fromJson($scope.order.jsonAddress);

				//发货地址
				if($scope.order.jsonSdAddress) {
					$scope.order.sendAddress = angular.fromJson($scope.order.jsonSdAddress);
				}

				// 计算
				$scope.order.price += $scope.freight;
                $scope.order.price = Number(NumberService.toCeil($scope.order.price, 2));

				console.log($scope.order);
			}, function () {
				$scope.error('获取订单信息请求失败');
			});
		}

	}]);

	app.register.filter('noLogisticFilter', function () {
		return function (status) {
			var result = "";
			switch(status) {
				case 404:
				case 520:
				case 405:
					result = "暂无物流信息";
					break;
				case 602:
				case 603:
				case 315:
				case 604:
				case 605:
				case 606:
					result = "该订单已经被取消，未找到对应的物流信息";
					break;
			}
			return result;
		}
	});
});
