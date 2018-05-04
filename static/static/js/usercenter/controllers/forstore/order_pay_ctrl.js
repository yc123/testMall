/**
 * Created by yujia on 2017/3/22.
 *  订单付款的界面
 */
define(['app/app'], function(app) {
	app.register.controller('orderPayCtrl', ['$scope', '$rootScope', '$stateParams', '$modal', '$state', 'Bill', 'toaster', 'Order', '$filter', 'ShippingAddress', 'Ysepay', '$q', 'NumberService', 'Cart', '$timeout', 'DistributionRule', 'TakeSelf', 'StoreInfo', function($scope, $rootScope, $stateParams, $modal, $state, Bill, toaster, Order, $filter, ShippingAddress, Ysepay, $q, NumberService, Cart, $timeout, DistributionRule, TakeSelf, StoreInfo) {

		document.title = '结算页-优软商城';
		$rootScope.active = 'buyer_cart';

		$scope.payment = {};

		//订单加密解析器
		var enIdFilter = $filter('EncryptionFilter');

		// TODO 暂时完善运费固定为0
		$scope.freight = 0;

		//存放发货地址的数组
		$scope.sendAddress = [];

		$scope.bills = [];

		//店铺的uuid
		$scope.storeUuids = [];

		$scope.storeContactInfos = {};

		//获取个人的发票信息
		var getBillInfo = function() {
			Bill.getListPersonal(null, function(data) {
				$scope.bill = {};
				$scope.bills = data;
				$scope.bill.kind = '1207';
				$scope.order.invoicetype = '1207';
				// angular.forEach($scope.bills, function(item) {
				//     if(item.kind == '1205') {
				//         $scope.bill = item;
				//     }
				// });
			}, function(response) {
				if(angular.equals('系统错误',  response.data)) {
					toaster.pop('error', '获取信息失败');
				}else {
					toaster.pop('error', '获取订单的信息失败，' + response.data);
				}
			});
		};

		$scope.deliveryMethod = {
			1301 : '第三方配送',
			1302 : '卖家配送',
			1303 : '上门自提'
		};

		//选择相应的发票信息
		$scope.selectBill = function(kind) {
			if(!kind || (kind != '1205' && kind != '1206' &&  kind != '1207')) {
				return ;
			}
			getTheKindBill(kind);
			$scope.order.invoicetype = kind;
			$scope.bill.kind = kind;
		};

		//传入发票的类型，获取对应的发票信息。
		var getTheKindBill = function(kind) {
			$scope.bill = {};
			if(!kind || (kind != '1205' && kind != '1206' &&  kind != '1207')) {
				return ;
			}
			angular.forEach($scope.bills, function(item) {
				if(item.kind == kind) {
					$scope.bill = item;
				}
			});
		};

		//查看价格分段。
		$scope.togglePrice = function (detail) {
			detail.display = detail.display == 'block' ? 'none' : 'block';
		};

		//获取订单的信息
		var getOrderData = function() {
			return Order.findStatusByOrderid({enOrderid : $stateParams.orderid}, function (response) {

				$scope.storeArray = [];
				$scope.ruleMap = {};
				if (response.status == 501){
					Order.orderContainGoods({enOrderid : $stateParams.orderid}, function(data) {
						$scope.order = data;
						$scope.$$orderDetailsMap = {};
						$scope.remarkList = {};//订单备注列表
						$scope.deliveryList = {};//配送方式列表
						$scope.takeSelfList = {};
						$scope.fareList = {};//运费列表
						if($scope.order.orderDetails.length == 0) {
							toaster.pop('warning', '您购买的商品已全部失效，请您前往购物车重新勾选');
							$timeout(function () {
								$state.go('buyer_cart');
							}, 1000);
						}
						angular.forEach($scope.order.orderDetails, function(detail) {
							if($scope.order.status == 501) { //如果不是待确认状态，则不需要计算
								$scope.calculatePrice(detail.number, detail, detail.currencyName);
							}
							if($scope.$$orderDetailsMap[detail.storeName]) {
								$scope.$$orderDetailsMap[detail.storeName].push(detail);
							}else {
								$scope.$$orderDetailsMap[detail.storeName] = [];
								$scope.remarkList[detail.storeid] = "";
								$scope.deliveryList[detail.storeid] = '';
								$scope.takeSelfList[detail.storeid] = null;
								$scope.fareList[detail.storeid] = 0;
								$scope.$$orderDetailsMap[detail.storeName].push(detail);
								$scope.storeUuids.push(detail.storeid);
							}
							$scope.disabledAddAndSub(detail);
						});
						StoreInfo.getContactInfo({storeids : angular.toJson($scope.storeUuids)}, function (data) {
							$scope.storeContactInfos = data;
						}, function (response) {
							toaster.pop('error', '获取店铺的联系信息失败');
						});
						if($scope.order.status == 501) { //如果不是待确认状态，则不需要计算
							//计算总价格
							$scope.calculateTotal();
							getTakeSelf();
						}
						angular.forEach($scope.$$orderDetailsMap, function (value, key) {
							var object = {
								uuid : value[0].storeid,
								fare : $scope.storePrice[key]
							};
							$scope.storeArray.push(object);
						});
						initOrder();
					}, function(response) {
						toaster.pop('error', "获取订单的类型失败。" + response.data);
					});
				} else {
					$scope.order = response;
					$scope.$$orderDetailsMap = {};
					if ($scope.order.orderRemark){
						$scope.remarkList = angular.fromJson($scope.order.orderRemark);
					}
					if ($scope.order.jsonRule){
						$scope.rule = angular.fromJson($scope.order.jsonRule);
					}
					if ($scope.order.jsonTakeSelf){
						$scope.takeSelf = angular.fromJson($scope.order.jsonTakeSelf);
					}
					if($scope.order.orderDetails.length == 0) {
						$state.go('buyer_order');
					}
					angular.forEach($scope.order.orderDetails, function(detail) {
						if($scope.$$orderDetailsMap[detail.storeName]) {
							$scope.$$orderDetailsMap[detail.storeName].push(detail);
						}else {
							$scope.storeArray.push(detail.storeid);
							$scope.$$orderDetailsMap[detail.storeName] = [];
							$scope.$$orderDetailsMap[detail.storeName].push(detail);
						}
					});
					if ($scope.order.jsonMoreRule){
						$scope.deliveryList = angular.fromJson($scope.order.jsonMoreRule);
					}
					if ($scope.order.jsonMoreTake){
						$scope.takeList = angular.fromJson($scope.order.jsonMoreTake);
					}
					if ($scope.storeArray.length != 1){
						$scope.calculateTotal();
					}
					initOrder();
				}
			});
		};

		getOrderData();
		// 联系卖家弹框
		$scope.contactBNox = false;
		$scope.contactSeller = function (key) {
			$scope.storeContactInfos[key].contactSeller = !$scope.storeContactInfos[key].contactSeller;
		};

		/**
		 * 监听点击的位置，隐藏相应的状态框
		 * @param event
		 */
		document.onclick = function (event) {
			var element = event.srcElement;
			if(!element) {
				return ;
			}
			var elementName =  element.getAttribute("name");
			$scope.$apply(function () {
				angular.forEach($scope.storeContactInfos, function (store, key) {
					if(typeof store == 'object') {
						var isThisTag = false;
						if(elementName && key == elementName) {
							isThisTag = true;
						}
						var parentEle = element.parentElement;
						if(!isThisTag) {
							while (parentEle && parentEle.tagName && parentEle.tagName != 'BODY') {
								var parentElementName =  parentEle.getAttribute("name");
								if(parentElementName && key == parentElementName) {
									isThisTag = true;
								}
								parentEle = parentEle.parentElement;
							}
						}
						if(!isThisTag) {
							store.contactSeller = false;
						}
					}
				});
			});
		};

		$scope.closeBox = function () {
			$scope.contactBNox = false;
		};

		var getTakeSelf = function () {
			if ($scope.order.status == 501){
				TakeSelf.findTakeSelfByStore({}, $scope.storeArray, function (data) {
					if(data){
						$scope.takeSelfMap = data;
					}
				})
			}
		};

		$scope.changeFare = function (details) {
			var storeid = details[0].storeid;
			var rule = $scope.deliveryList[storeid];
			$scope.fareList[storeid] = rule.fare;
			$scope.calculateFare();
		};

		/**
		 * 计算运费和店铺费用合计
		 */
		$scope.calculateFare = function () {
			var fare = 0;
			angular.forEach($scope.fareList, function (v) {
				fare = NumberService.add(v, fare);
			});
			$scope.order.ensurePrice = NumberService.add($scope.order.totalprice, fare);
		};


		/**
		 * 获取买家收货地址信息
		 */
		$scope.loadShippingAddress = function () {
			return ShippingAddress.get({send : false}, function(data) {
				$scope.sendAddress = data;
				if (data.length != 0){
					$scope.selectAdd($scope.sendAddress[0]);
				}
			}, function(response) {
				toaster.pop("error", "获取收货地址信息失败 "  + response.data);
			});
		};


		//立即购买的订单并且在待确认的状态下，是可以修改币别。
		$scope.changeCurrency = function(detail) {
			if(detail == null) {
				return;
			}
			if($scope.order.buyNow) {
				$scope.order.currency = detail.currencyName;
			}else {
				toaster.pop('warning', '当前的订单不能切换币别');
				return;
			}

			$scope.calculatePrice(detail.number, detail, detail.currencyName);
			//计算总价格
			$scope.calculateTotal();
		};
		//选择收货的地址。
		$scope.selectAdd = function(address) {
			$scope.payment.address = address;
			$scope.formatArea = $scope.payment.address.area.replace(/,/g,' ');
			if ($scope.order.status == 501){
				DistributionRule.findUsableRule({area:$scope.payment.address.area}, $scope.storeArray, function (data) {
					if (data){
						//更换地址后先清空数据
						$scope.deliveryList = {};
						$scope.fareList = {};
						angular.forEach($scope.storeArray, function (item) {
							$scope.ruleMap[item.uuid] = [];
							var arr = data[item.uuid];
							$scope.ruleMap[item.uuid] = arr;
							if (arr.length != 0){
								$scope.deliveryList[item.uuid] = arr[0];
								$scope.fareList[item.uuid] = arr[0].fare;
							}
						});
						$scope.calculateFare();
					}
				},function (error) {
					toaster.pop('info', '提示', error.data);
				})
			}
		};

		$scope.updateTakeSelf = function (uuid, item) {
			$scope.takeSelfList[uuid] = item;
		};

		// 添加按钮，每次加1
		$scope.add = function(detail){
			var num = NumberService.add(detail.number, detail.goodsHistory.perQty);
			if(Number(num) > detail.goodsHistory.reserve) {
				if(detail.goodsHistory.breakUp) {
					detail.number = detail.goodsHistory.reserve;
				}else {
					detail.number = Number(NumberService.sub(detail.goodsHistory.reserve, detail.goodsHistory.reserve %detail.goodsHistory.minPackQty));
				}
				toaster.pop('info','提示','库存不足');
			}else {
				detail.number = num;
			}
			$scope.disabledAddAndSub(detail);
			$scope.calculatePrice(detail.number, detail, detail.currencyName);
			//计算总价格
			$scope.calculateTotal();
			updateStoreArray(detail);
			$q.all([updateFare($scope.ruleMap[detail.storeid], $scope.storePrice[detail.storeName]).$promise]).then(function (data) {
				if (data && data.length > 0 && data[0]){
					var id = $scope.deliveryList[detail.storeid].id;
					var arr = data[0];
					$scope.ruleMap[detail.storeid] = arr;
					angular.forEach(arr, function (item) {
						if (item.id == id){
							$scope.deliveryList[detail.storeid] = item;
							$scope.fareList[detail.storeid] = item.fare;
						}
					});
					$scope.calculateFare();
				}else {
					$scope.calculateFare();
				}
			});
		};

		// 减少按钮，每次减minPackQty
		$scope.reduce = function(detail){
			var num = NumberService.sub(detail.number, detail.goodsHistory.perQty);
			if(Number(num) < detail.goodsHistory.minBuyQty) {
				toaster.pop('info', '提示','该商品最少购买'　+ detail.goodsHistory.minBuyQty + "件");
				detail.number = detail.goodsHistory.minBuyQty;
			}else {
				detail.number = num;
			}
			$scope.disabledAddAndSub(detail);
			$scope.calculatePrice(detail.number, detail, detail.currencyName);
			//计算总价格
			$scope.calculateTotal();
			updateStoreArray(detail);
			$q.all([updateFare($scope.ruleMap[detail.storeid], $scope.storePrice[detail.storeName]).$promise]).then(function (data) {
				if (data && data.length > 0 && data[0]){
					var id = $scope.deliveryList[detail.storeid].id;
					var arr = data[0];
					$scope.ruleMap[detail.storeid] = arr;
					angular.forEach(arr, function (item) {
						if (item.id == id){
							$scope.deliveryList[detail.storeid] = item;
							$scope.fareList[detail.storeid] = item.fare;
						}
					});
					$scope.calculateFare();
				}else {
					$scope.calculateFare();
				}
			});

		};

		/**
		 * 更新配送规则请求参数
		 */
		var updateStoreArray = function (detail) {
			angular.forEach($scope.storeArray, function (item) {
				if (item.uuid == detail.storeid){
					item.fare = $scope.storePrice[detail.storeName];
				}
			})
		};

		/**
		 * 更新运费列表
		 * @param ruleList
		 * @param price
		 * @returns {*|{url, method, isArray}}
		 */
		var updateFare = function (ruleList, price) {
			if(ruleList == null || ruleList.length < 1) {
				// toaster.pop('warning', '提示', "配送规则缺失，请联系卖家设置相应的配送规则");
				return 0;
			}
			return DistributionRule.findFareOfRule({price:price}, ruleList, function (data) {
				if (data){

				}
			}, function (error) {
				// toaster.pop("error", error.data);
			})
		};

		// 输入购买量限制
		$scope.blurNum = function (detail) {
			// detail.inputError = 0;
			// detail.noInputError = 0;
			detail.number = Number(detail.number);
			if (detail.number < detail.goodsHistory.minBuyQty || !detail.number) {
				// toaster.pop("info", "提示", "该商品最少购买" + detail.goodsHistory.minBuyQty + "件");
				if(detail.goodsHistory.breakUp) {
					// detail.noInputError = 1;
					toaster.pop('info','提示','最小起订量为' + detail.goodsHistory.minBuyQty);
					detail.number = detail.goodsHistory.minBuyQty;
					// $timeout(function () {
					// 	c.noInputError = 0;
					// }, 3000);
				}else{
					// detail.inputError = 1;
					toaster.pop('info','提示','最小起订量为' + detail.goodsHistory.minBuyQty);
					detail.number = detail.goodsHistory.minBuyQty;
					// $timeout(function () {
					// 	detail.inputError = 0;
					// },3000);
				}
			}else if(detail.number > detail.goodsHistory.reserve){
				if(detail.goodsHistory.breakUp) {
					// detail.noInputError = 2;
					toaster.pop('info','提示','库存不足');
					detail.number = detail.goodsHistory.reserve;
					// $timeout(function () {
					// 	c.noInputError = 0;
					// }, 3000);
				}else{
					// detail.inputError = 2;
					toaster.pop('info','提示','库存不足');
					detail.number = Number(NumberService.sub(detail.goodsHistory.reserve, detail.goodsHistory.reserve % detail.goodsHistory.minPackQty));
					// $timeout(function () {
					// 	detail.inputError = 0;
					// },3000);
				}
				// toaster.pop('info', '提示','库存不足');
			}else {
				if(!detail.goodsHistory.breakUp) {
					var remandar = detail.number % detail.goodsHistory.minPackQty;
					if(remandar != 0) {
						// detail.inputError = 3;
						toaster.pop("info", "提示", "不支持拆包且包装量为" + detail.goodsHistory.minPackQty);
						detail.number = Number(NumberService.add(NumberService.sub(detail.number, detail.number % detail.goodsHistory.minPackQty), detail.goodsHistory.minPackQty));
						if(detail.number > detail.goodsHistory.reserve) {
							detail.number = NumberService.sub(detail.goodsHistory.reserve, detail.goodsHistory.reserve % detail.goodsHistory.minPackQty);
						}
						// $timeout(function () {
						// 	detail.inputError = 0;
						// },3000);
					}
				}
			}
			$scope.disabledAddAndSub(detail);
			$scope.calculatePrice(detail.number, detail, detail.currencyName);
			//计算总价格
			$scope.calculateTotal();
			updateStoreArray(detail);
			$q.all([updateFare($scope.ruleMap[detail.storeid], $scope.storePrice[detail.storeName]).$promise]).then(function (data) {
				if (data && data.length > 0 && data[0]){
					var id = $scope.deliveryList[detail.storeid].id;
					var arr = data[0];
					$scope.ruleMap[detail.storeid] = arr;
					angular.forEach(arr, function (item) {
						if (item.id == id){
							$scope.deliveryList[detail.storeid] = item;
							$scope.fareList[detail.storeid] = item.fare;
						}
					});
					$scope.calculateFare();
				}else {
					$scope.calculateFare();
				}
			});
		};

		/**
		 * 是否失效- +
		 */
		$scope.disabledAddAndSub = function(detail) {
			if((Number(detail.number) - Number(detail.goodsHistory.perQty)) < Number(detail.goodsHistory.minBuyQty)) {
				detail.minusDisabled = true;
			}else {
				detail.minusDisabled = false;
			}
			if(Number(detail.number) + Number(detail.goodsHistory.perQty) > Number(detail.goodsHistory.reserve)) {
				detail.addDisabled = true;
			}else {
				detail.addDisabled = false;
			}
		};

		//验证配送规则
		var checkRule = function () {
			var value = true;
			angular.forEach($scope.ruleMap, function (v) {
				if (v.length == 0){
					value = false;
				}
			});
			return value;
		};
		//验证是否选择上门自提，却没有选择自提点
		var checkTakeSelf = function () {
			var value = true;
			angular.forEach($scope.deliveryList, function (v, k) {
				if (v.method == 1303){
					if ($scope.takeSelfList[k] == null){
						value = false;
					}
				}
			});
			return value;
		};
		//检查是否选择了寄售商品,选择了发票却没有完善专票信息
		var checkBill = function () {
			if($scope.order.invoicetype != '1207') {
				if($scope.hideNormal){
					var bill = getSpecial();
					if(!bill.id) {
						return false;
					}
				}
			}
			return true;
		};

		var getSpecial = function () {
			var billSpecial = {};
			angular.forEach($scope.bills, function (bill) {
				if (bill.kind == '1205'){
					billSpecial = bill;
				}
			});
			return billSpecial;
		};

		$scope.cancelFrame = function () {
			$scope.showBillFrame = false;
		};

		$scope.perfectLater = function () {
			$scope.showBillFrame = false;
			$scope.imperfect = true;
		};

		$scope.goToBillPage = function () {
			$scope.showBillFrame = false;
			window.open("user#/invoice", '_self');
		};

		//确认付款
		$scope.imperfect = false;//暂不完善
		$scope.confirmPay = function() {
			if($scope.order.status == 502 || $scope.order.status == 503) {
				var arr = [];
				if($scope.order.orderids) {
					arr = $scope.order.orderids.split(",");
				}else {
					arr.push($scope.order.orderid);
				}
				if ($scope.order.currency == 'RMB' && $scope.order.paytype == '1102') {
					paymentEnsure(arr);
				} else if($scope.order.paytype == '1103') {
					$state.go('order_transfer', {orderid : enIdFilter(arr.join("-"))});
				}else {
					toaster.pop('info', '美元请线下付款');
				}
				return ;
			}
			var validRule = checkRule();
			if (!validRule){
				toaster.pop("info", "当前地址部分卖家无法配送，请重新选择地址或与卖家协商处理");
				return ;
			}
			var validTakeSelf = checkTakeSelf();
			if (!validTakeSelf){
				toaster.pop("info", "请选择一个自提点");
				return ;
			}
			var orderInfos = [], orderInfo;
			orderInfo = generateOrderInfo();
			if(orderInfo == null) {
				return ;
			}
			orderInfos.push(orderInfo);
			if(!$scope.imperfect){
				var validBill = checkBill();
				if (!validBill){
					// toaster.pop('info', '请完善专票信息');
					$scope.showBillFrame = true;
					return ;
				}
			}

			Order.ensure({orderid: enIdFilter($scope.order.orderid)}, orderInfos, function(data){
				if(data.code == 1) {
					if (data.data && data.data[0]) {
						var arr = [];
						var batchCodes = [];
						for(var i = 0; i < data.data.length; i++) {
							arr.push(data.data[i].orderid);
							for(var j = 0; j < data.data[i].orderDetails.length; j++) {
								batchCodes.push(data.data[i].orderDetails[j].batchCode);
							}
						}
						if(!$scope.order.buyNow) {
							Cart.deleteByBatchCode({}, batchCodes, function(data) {
							}, function(response) {
							});
						}
						if ($scope.order.currency == 'RMB' && $scope.order.paytype == '1102') {
							paymentEnsure(arr);
						} else if($scope.order.paytype == '1103') {
							console.log(arr.length)
							if(arr.length != 1){
								$state.go('downPayment', {orderid : enIdFilter(arr.join('-'))});
							}else {
								$state.go('order_transfer', {orderid : enIdFilter(arr.join('-'))});
							}
						}else {
							toaster.pop('info', '美元请线下付款');
							$state.go('buyer_order');
						}

					}
				}else {
					if(data.code == 6) { //产品信息有更新
						toaster.pop('warning', data.message + ",请刷新界面之后重新操作");
					}else if(data.code == 7){
						toaster.pop('warning', data.message + ",将为您跳转到购物车界面");
						$timeout(function () {
							$state.go('buyer_cart');
						}, 1000);
					}else {
						toaster.pop('warning', data.message);
					}
				}

			}, function(response) {
				toaster.pop('error', '确认订单失败，' + response.data);
			});
		};

		// 跳银盛支付页面
		var paymentEnsure = function(arr) {
			var basePath = (function() {
				var pathName = window.location.pathname.substring(1);
				var webName = pathName == '' ? '': pathName.substring(0, pathName.indexOf('/'));
				if (webName == "") {
					return window.location.protocol + '//' + window.location.host;
				} else {
					return window.location.protocol + '//' + window.location.host + '/' + webName;
				}
			})();
			// 获取签名组成form
			Ysepay.paymentSign({basePath: basePath}, arr, function(data) {
				$scope.ysepayRequest = data;
				$scope.$apply();
				var form = document.getElementById('paymentForm');
				form.action = data.action;
				form.method = "POST";
				var submit = form.submit();
			},function(res){
				toaster.pop('error', '获取支付请求参数错误', res.data);
			});
		};

		// 产生要提交的单个订单数据
		var generateOrderInfo = function() {
			/*订单信息：orderInfo含有信息：id、orderid、deliverytype、add_id、invoicetype、invoiceid、paytype、totalprice(price)、
			 * currency、orderRemark、orderDetails(id, number, taxUnitprice)*/
			var orderInfo = {};

			orderInfo.id = $scope.order.id;
			orderInfo.orderid = $scope.order.orderid;
			// orderInfo.deliverytype = $scope.order.deliverytype; // 配送方式

			if($scope.order.currency == 'USD' && $scope.order.paytype == '1102') {
				toaster.pop('info', '美元请线下付款');
				return null;
			}
			if($scope.order.currency == 'USD' && $scope.order.invoicetype != '1207') {
				toaster.pop('info', '美元请选择暂不开票');
				return null;
			}

			// 收货地址，上门自提暂不提供
			if($scope.deliveryList){
				console.log("进来了");
				/*var address = angular.fromJson($scope.selectAddress);
				 delete address.isSelect;
				 orderInfo.jsonAddress = angular.toJson(address);*/
				if(!$scope.payment.address || !$scope.payment.address.id) {
					toaster.pop('info', '地址信息为空，请添加地址信息');
					return null;
				}
				if($scope.payment.address.area.indexOf('香港') > -1) {
					if(angular.equals('RMB',$scope.order.currency)) {
						toaster.pop('info', '提示', '当前选择的币别是RMB，地址却是香港');
						return null;
					}
				}else {
					if(angular.equals('USD',$scope.order.currency)) {
						toaster.pop('info', '提示', '当前选择的币别是USD，地址却是内陆');
						return null;
					}
				}
				orderInfo.add_id = $scope.payment.address.id;
			}
			// else if($scope.order.deliverytype == '1302'){
			// 	orderInfo.add_id = $scope.pickAddress.id;
			// }
			orderInfo.invoicetype = $scope.order.invoicetype; // 发票类型
			if($scope.order.invoicetype != '1207') {
				if(!$scope.bill.id) {
					toaster.pop('info', '请添加发票信息');
					return null;
				}
				orderInfo.invoiceid = $scope.bill.id; // 发票主键
			}

			orderInfo.totalprice = $scope.order.totalprice; // 应付总额,不含运费
			orderInfo.currency = $scope.order.currency; // 币别
			orderInfo.orderRemark = angular.toJson($scope.remarkList);//订单备注
			orderInfo.splitInfo = {
				ruleList : angular.toJson($scope.deliveryList),
				takeList : angular.toJson($scope.takeSelfList)
			};

			orderInfo.paytype =  $scope.order.paytype;
			orderInfo.orderDetails = convertOrderDetails(); // 订单明细信息：id、number

			return orderInfo;
		};

		// 提取要提交到服务器的订单明细数据
		var convertOrderDetails = function() {
			var orderDetails = [];
			angular.forEach($scope.order.orderDetails, function(v, k) {
				orderDetails.push({
					id: v.id,
					number: v.number,
					taxUnitprice: v.taxUnitprice,
					remark : v.remark,
					goodsnumber : v.goodsnumber,
					storeid : v.storeid
				});
			});
			return orderDetails;
		};

		// 初始化订单相关数据。由于订单确认页现在只处理单张且同一币别订单，因此只处理获取的订单中的第一张订单。
		var initOrder = function() {
			if($scope.order.status != 501) {
				$scope.sendAddress.push(angular.fromJson($scope.order.jsonAddress));
				$scope.selectAdd($scope.sendAddress[0]);
				if($scope.order.invoiceid) {
					Bill.getBillById({id : $scope.order.invoiceid}, function(data) {
						$scope.bill = data;
					}, function(response) {
                        toaster.pop('error', '获取发票信息失败 ' + response.data);
					});
				}
				return ;
			}
			// 人民币为专用增值税发票，美元不开发票    --1205专用增值税发票   --1206普通发票  --1207不开发票
			if($scope.order.currency == 'USD') {
				$scope.order.invoicetype = 1207;
				$scope.order.paytype = '1103';
			}else {
				$scope.order.invoicetype = 1205;
				$scope.order.paytype = '1102';
			}
			// 默认选择第三方配送  --1301第三方配送 --卖家配送  --1303上门自提
			$scope.order.deliverytype = 1301;

			//获取地址的信息
			$scope.loadShippingAddress();
			checkStoreType();
			//发票的信息
			getBillInfo();
		};

		var checkStoreType = function () {
			var uuidArray = [];
			angular.forEach($scope.storeArray, function (store) {
				uuidArray.push(store.uuid);
			});
			Order.checkConsignment({}, uuidArray, function (data) {
				if (data){
					$scope.hideNormal = data.data;
				}
			})
		};

		/**********************************************************************
		 * 地址信息管理
		 **********************************************************************/

		/**
		 * 添加收货地址信息
		 */
		$scope.addShippingAddress = function (addr, index) {
			/*$state.go('editShippingAddress');*/
			$scope.isnotCheck = true;
			$modal.open({
				templateUrl : $rootScope.rootPath + '/static/view/common/modal/edit_address_modal.html',
				controller : 'editAddrPayCtrl',
				size : 'lg',
				resolve : {
					addr : function(){
						return angular.copy(addr);
					},
					isModify : function () {
						if (addr){
							return true;
						}else {
							return false;
						}
					}
				}
			}).result.then(function(address){
				if(address.isSetTop) {
					$scope.loadShippingAddress();
				}else {
					if (addr) {
						$scope.sendAddress[index] = address;
					}else {
						$scope.sendAddress.push(address);
					}
				}
				$scope.selectAdd(address);
			}, function(){
				toaster.pop('info', '提示 ' + '您已取消收货地址的编辑');
			});
		};

		/**
		 * 展示所有收货地址信息
		 */
		$scope.toggleAddress = function () {
			$scope.expand = !$scope.expand;
		};

		/**********************************************************************
		 * 订单相关操作
		 **********************************************************************/

		/**
		 * 根据商品数量以及币别获取该订单明细的单价信息
		 *
		 * @param number		购买商品数量
		 * @param detailId		订单明细编号ID
		 * @param currency		币别
		 */
		$scope.calculatePrice = function (number, detail, currency) {
			if (!number || number <= 0 || !detail || !currency || currency == '') {
				return ;
			}

			const properPrice = detail.goodsHistory.prices.filter(function (price) {
				return number >= price.start && number <= price.end;
			});


			// 获取当前数量的对应价格区间的单据信息
			if(properPrice.length > 0) {
				detail.usdUnitPrice = properPrice[0].uSDPrice;
				detail.rmbUnitPrice = properPrice[0].rMBPrice;
			}else {
				detail.usdUnitPrice = detail.goodsHistory.prices[detail.goodsHistory.prices.length - 1].uSDPrice;
				detail.rmbUnitPrice = detail.goodsHistory.prices[detail.goodsHistory.prices.length - 1].rMBPrice;
			}

			if (currency == 'RMB') {
				detail.taxUnitprice = detail.rmbUnitPrice;
			} else if (currency == 'USD') {
				detail.taxUnitprice = detail.usdUnitPrice;
			}
		};

		/**
		 * 计算总金额
		 */
		$scope.calculateTotal = function () {
			$scope.order.totalprice = 0;
			$scope.storePrice = {};
			angular.forEach($scope.order.orderDetails, function(detail) {
				detail.ensurePrice = Number(NumberService.mul(detail.taxUnitprice, detail.number));
				if(!$scope.storePrice[detail.storeName]) {
					$scope.storePrice[detail.storeName] = 0;
				}
				$scope.storePrice[detail.storeName] = NumberService.add(detail.ensurePrice, $scope.storePrice[detail.storeName]);
			});
			angular.forEach($scope.$$orderDetailsMap, function (value, key) {
				$scope.storePrice[key] = Number(NumberService.toCeil($scope.storePrice[key], 2));
				$scope.order.totalprice = NumberService.add($scope.storePrice[key], $scope.order.totalprice)
			});
		};

		//发票编辑功能
		$scope.modifyInvoice = function(invoice) {
			$modal.open({
				templateUrl : 'static/view/prod/modal/edit-invoice-modal.html',
				controller : 'BillInputCtrl',
				size : 'lg',
				resolve : {
					invoice: function () {
						return angular.copy(invoice);
						// if (invoice.name) {
						// 	return angular.copy(invoice);
						// }
						// return {};
					}
				}
			}).result.then(function(invoice){
				$scope.bill = invoice;
				if(!invoice.name) {
					$scope.bills.push(invoice);
				}else {
					$scope.bills = $scope.bills.filter(function (item) {
						return item.id != invoice;
					});
					$scope.bills.push(invoice);
				}
			}, function(){
				toaster.pop('info', '提示 ' + '您已取消编辑发票信息');
			});
		};
	}]);

	//地址编辑模态框
	app.register.controller('editAddrPayCtrl', ['$scope', 'addr', '$modalInstance', 'toaster', '$http', 'ShippingAddress', 'isModify', function($scope, addr, $modalInstance, toaster, $http, ShippingAddress, isModify){
		if (addr){
			$scope.isSetTop = addr.num == 1;
		}else {
			$scope.isSetTop = false;
		}
		$scope.isModify = isModify;
		$scope.validEmail = function (email) {
			return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email)
		};

		$http.get('static/js/prod/data/city.json').success(function(data) {
			$scope.division = data;
			if(addr && addr.area){
				// $scope.address = addr;
				//拼装下拉选择框
				var arr = addr.area.split(',');
				addr.province = arr[0];
				addr.city = arr[1];
				addr.district = arr[2];
				$scope.address = addr;
				// $scope.addr = true;
			}
		}).error(function() {
			toaster.pop('error', '系统错误 ' + '加载城市信息失败');
		});

		//验证数据
		$scope.checkForm = function(num) {
			var size;
			if(num == 1) {
				if ($scope.address.name){
					size = $scope.address.name.replace(/[^\x00-\xff]/g,'**').length;
					if (size > 20) {
						$scope.userError = true;
						return;
					}
					$scope.userError = false;
				}
			} else if(num == 2) {
				if ($scope.address.tel){
					size = $scope.address.tel.replace(/[^\x00-\xff]/g,'**').length;
					if (size < 8 || size > 11) {
						$scope.telError = true;
						return;
					}
					$scope.telError = false;
					var telPatt = new RegExp("^[0-9]+$");
					if (telPatt.test($scope.address.tel)){
						$scope.telPatternError = false;
					}else {
						$scope.telPatternError = true;
					}
				}
			} else if(num == 3) {
				if ($scope.address.detailAddress){
					size = $scope.address.detailAddress.replace(/[^\x00-\xff]/g,'**').length;
					if (size > 60) {
						$scope.addrError = true;
						return;
					}
					$scope.addrError = false;
				}
			} else if(num == 4) {
				var emailPatt = new RegExp("^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$");
				if ($scope.address.email.length > 0 && !emailPatt.test($scope.address.email)){
					$scope.emailPatternError = true;
				}else {
					$scope.emailPatternError = false;
				}
			}
		};



		$scope.save = function () {
			var address = $scope.address;

			if (!address){
				toaster.pop('error', '请补充未填写的信息');
				return ;
			}
			if (!address.name || !address.province || !address.city || !address.district ||
				!address.detailAddress || !address.tel){
				toaster.pop('error', '请补充未填写的信息');
				return ;
			}
			if ($scope.userError || $scope.telError || $scope.addrError || $scope.telPatternError ||
				$scope.emailPatternError){
				toaster.pop('error', '请修改红色框内的信息');
				return ;
			}

			//拼装地区
			var strAres = address.province + ',' + address.city + ',' + address.district;
			address.area = strAres;

			// send属性 控制本地址是否是发货地址
			ShippingAddress.save({isSetTop: $scope.isSetTop, send: false, isPersonal: true}, address, function(data){
				toaster.pop('success', '成功 ', '保存收货地址成功');
				data.isSetTop = $scope.isSetTop;
				$modalInstance.close(data);
			}, function(res){
				toaster.pop('error', '系统错误 ', '保存收货地址失败' + res.data);
			});
		};

		$scope.cancel = function() {
			$modalInstance.dismiss();
		};
	}]);


	// 发票编辑模态框
	app.register.controller('BillInputCtrl', ['$scope', '$http', 'BaseService', 'Bill', 'toaster', '$stateParams', '$state', 'invoice', '$upload', '$modalInstance', '$q', function($scope, $http, BaseService, Bill, toaster, $stateParams, $state, invoice, $upload, $modalInstance, $q) {

		$scope.invoiceType = invoice.kind;
		$scope.isSpecial = true; //专票，等于true为不存在
		$scope.isNormal = true; //普票，等于true为不存在
		// 获取发票信息方法	1205为增值税专用发票	1206为增值税普通发票	1207为不开发票

		var getInvoiceInfo = function() {
			if(invoice&&invoice.kind) {
				$scope.bill = invoice;
				if($scope.bill.kind == 1205) {
					$scope.isNormal = false;
					$scope.isSpecial = true;
				}else {
					$scope.isSpecial = false;
					$scope.isNormal = true;
				}
				if($scope.bill.area){
					$scope.bill.address = {};
					//拼装下拉选择框
					var arr = $scope.bill.area.split(',');
					$scope.bill.address.province = arr[0];
					$scope.bill.address.city = arr[1];
					$scope.bill.address.district = arr[2];
					// console.log($scope.bill.address)
				}
				if ($scope.bill.name) {
					$scope.bill.is_agree = true;
				} else {
					$scope.bill.is_agree = false;
				}
			}
		};
		getInvoiceInfo();
		// $scope.bill = {};
		// 获取省市区地理信息
		var getGeoInfo = function () {
			$http.get('static/js/prod/data/city.json').success(function(data) {
				$scope.division = data;
				if($scope.bill.area){
					$scope.bill.address = {};
					//拼装下拉选择框
					var arr = $scope.bill.area.split(',');
					$scope.bill.address.province = arr[0];
					$scope.bill.address.city = arr[1];
					$scope.bill.address.district = arr[2];
				}
			}).error(function(e) {
				toaster.pop('error', '系统错误 ' + '加载城市信息失败， 请重新加载界面！');
			});
		};
		getGeoInfo();

		$scope.bill.address = {};

		//保存发票信息
		$scope.saveBill = function(flag) {
			var dataValidFlag = $scope.checkValidFrom();
			if (!flag && dataValidFlag && $scope.bill.is_agree) {
				if (!$scope.isAdd) { //修改
					doSave('修改发票信息');
				} else { // 新增
					doSave('添加发票');
				}
			} else if (flag || !dataValidFlag) {
				toaster.pop('error', '请填写正确的发票信息');
			} else {
				toaster.pop('error', '请勾选并阅读《发票须知》');
			}
		};
		var doSave = function (message) {
			$scope.bill.area = $scope.bill.address.province + "," + $scope.bill.address.city + "," + $scope.bill.address.district;
			var file = null;
			if($scope.bill.billInfo&&$scope.bill.billInfo[0]) {
				file = $scope.bill.billInfo[0];
			}
			$upload.upload({
				url: 'trade/bill/save',
				file: file,
				method: 'POST',
				data: {
					bill: $scope.bill
				}
			}).success(function(data){
				toaster.pop('success', message + '成功');
				$modalInstance.close(data);
			}).error(function(data){
				toaster.pop('error', message + '失败');
			});
		}

		$scope.isDoUpload = false;
		//上传发票许可证
		$scope.onUploadPermission = function () {
			$scope.isDoUpload = true;
			if (event.target.files[0].size < 3*1024*1024) {
				$scope.bill.attachUrl = event.target.files[0].name;
			} else {
				$scope.bill.attachUrl = '';
			}
		}

		//判断中文字符串的长度
		var getRealStringLen = function (str) {
			var realLength = 0, len = str.length, charCode = -1;
			for (var i = 0; i < len; i++) {
				charCode = str.charCodeAt(i);
				if (charCode >= 0 && charCode <= 128) realLength += 1;
				else realLength += 2;
			}
			return realLength;
		}

		$scope.validForm = {
			validBillHead: true,
			validBillName: true,
			validBankName: true,
			validDetailAddress: true,
			validCompanyAddress: true
		}

		$scope.initFormFlag = function () {
			$scope.initFlag = {
				initBillHead: true,
				initBillName: true,
				initBankName: true,
				initDetailAddress: true,
				initCompanyAddress: true,
				initCompanyPhone: true,
				initCompanyTaxNum: true,
				initBankAccount: true,
				initTelephone: true
			}
		}

		$scope.initFormFlag();

		$scope.checkValidFrom = function () {
			var flag = true
			angular.forEach($scope.validForm, function (item) {
				if (!item) {
					flag = false;
				}
			})
			return flag;
		}
		$scope.checkValidFrom();
		//发票抬头check
		$scope.checkBillHead = function () {
			var len = getRealStringLen($scope.bill.head);
			if (len > 100) {
				$scope.validForm.validBillHead = false;
			} else {
				$scope.validForm.validBillHead = true;
			}
		}

		//收票人check
		$scope.checkBillName = function () {
			var len = getRealStringLen($scope.bill.name);
			if (len > 20) {
				$scope.validForm.validBillName = false;
			} else {
				$scope.validForm.validBillName = true;
			}
		}

		//开户银行Check
		$scope.checkBankName = function () {
			var len = getRealStringLen($scope.bill.bankName);
			if (len > 60) {
				$scope.validForm.validBankName = false;
			} else {
				$scope.validForm.validBankName = true;
			}
		}

		//详细地址Check
		$scope.checkDetailAddress = function () {
			var len = getRealStringLen($scope.bill.detailAddress);
			if (len > 60) {
				$scope.validForm.validDetailAddress = false;
			} else {
				$scope.validForm.validDetailAddress = true;
			}
		}

		//单位地址check
		$scope.checkCompanyAddress = function () {
			var len = getRealStringLen($scope.bill.companyAddress);
			if (len > 100) {
				$scope.validForm.validCompanyAddress = false;
			} else {
				$scope.validForm.validCompanyAddress = true;
			}
		}

		$scope.exitEdit = function () {
			$modalInstance.dismiss();
		}

	}]);
});
