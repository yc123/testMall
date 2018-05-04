/**
 * 用户收货地址编辑 Controller
 */
define(['app/app'], function(app) {
	app.register.controller('ShippingAddressEditCtrl', ['$scope', '$rootScope', '$stateParams', function($scope, $rootScope, $stateParams) {

		$scope.payment = {};

		//订单加密解析器
		var enIdFilter = $filter('EncryptionFilter');

		//获取个人的增值税专用发票信息
		Bill.getPersonalSpecial(null, function(data) {
			if(data) {

			}
			$scope.bill = data;
		}, function(response) {
			toaster.pop('error', '获取专用发票失败。' + response.data);
		});

		//获取订单的信息
		Order.orderContainGoods({enOrderid : $stateParams.orderid}, function(data) {
			$scope.order = data;
			$scope.order.total = 0;
			angular.forEach($scope.order.orderDetails, function(detail) {
				detail.fragmentPrices = angular.fromJson(detail.goodsHistory.qtyPrice);
				detail.taxUnitprice =$scope.getPrice(detail.fragmentPrices, detail, detail.currencyName);
				detail.total = Number(detail.taxUnitprice) * Number(detail.number);
				$scope.order.total += detail.total;
			});
			initOrder();
		}, function(response) {
			toaster.pop('error', "获取订单的类型失败。" + response.data);
		});

		//获取发货地址信息
		ShippingAddress.get({send : true}, function(data) {
			$scope.sendAddress = data;
		}, function(response) {
			toaster.pop("error", "获取收货地址信息失败 "  + response.data);
		});

		//选择收货的地址。
		$scope.selectAdd = function(address) {
			$scope.payment.address = address;
		};

		// 物品分段单价获取
		$scope.getPrice = function(prices, detail, currency) {
			for(var i = 0; i < prices.length; i++) {
				if(prices[i].start <= detail.number && detail.number <= prices[i].end) {
					if(currency.indexOf("RMB") > -1 ) {
						detail.taxUnitprice = prices[i].rMBPrice;
					}else {
						detail.taxUnitprice = prices[i].uSDPrice;
					}
				}
			}
			return detail.taxUnitprice;
		};

		//确认付款
		$scope.confirmPay = function() {

			var orderInfos = [], orderInfo;
			orderInfo = generateOrderInfo();
			orderInfos.push(orderInfo);

			Order.ensure({orderid: enIdFilter($scope.order.orderid)}, orderInfos, function(data){
				paymentEnsure(data[0].orderid);
			}, function(response) {
				toaster.pop('error', '确认订单失败，' + response.data);
			});
		};

		// 跳银盛支付页面
		var paymentEnsure= function(orderid) {
			// 银盛支付
			$scope.ysepayRequest={};
			$scope.ysepayRequest.orderid = orderid;// 唯一订单号

			// 签名
			Ysepay.paymentSign({orderid:$scope.ysepayRequest.orderid},{},function(data) {
				$scope.ysepayRequest = data;
				$scope.$apply();
				var form = document.getElementById('paymentForm');
				form.action = "https://openapi.ysepay.com/gateway.do";
				form.method = "POST";
				var submit=form.submit();
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
			orderInfo.deliverytype = $scope.order.deliverytype; // 配送方式
			// 收货地址，上门自提暂不提供
			if($scope.order.deliverytype == '1301'){
				/*var address = angular.fromJson($scope.selectAddress);
				 delete address.isSelect;
				 orderInfo.jsonAddress = angular.toJson(address);*/
				orderInfo.add_id = $scope.payment.address.id;
			}else if($scope.order.deliverytype == '1302'){
				orderInfo.add_id = $scope.pickAddress.id;
			}

			orderInfo.invoicetype = $scope.bill.kind; // 发票类型
			orderInfo.invoiceid = $scope.bill.id; // 发票主键
			orderInfo.totalprice = $scope.order.total; // 应付总额
			orderInfo.currency = $scope.order.currency; // 币别
			orderInfo.orderRemark = $scope.order.orderRemark; // 交易备注
			orderInfo.paytype =  1102;
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
					taxUnitprice: v.taxUnitprice
					/*,currencyName: v.currencyName*/
				});
			});
			return orderDetails;
		};

		// 初始化订单相关数据。由于订单确认页现在只处理单张且同一币别订单，因此只处理获取的订单中的第一张订单。
		var initOrder = function() {
			// 默认为普通发票，美元不开发票    --1205专用增值税发票   --1206普通发票  --1207不开发票
			$scope.order.invoicetype = 1205;
			// if($scope.order.currency == 'USD') {
			//     $scope.order.invoicetype = 1207;
			// }else {
			//     if(!$scope.order.invoicetype) $scope.order.invoicetype = 1205;
			// }
			// 默认选择UU配送  --1301第三方配送  --1302卖家配送 --1303上门自提
			if(!$scope.order.deliverytype) $scope.order.deliverytype = 1301;
		};

		/**
		 * 添加收货地址信息
		 */
		$scope.addShippingAddress = function () {
			var isSetTop = true;
			var addr = {};
			$scope.isnotCheck = true;
			$modal.open({
				templateUrl : $rootScope.rootPath + '/static/view/prod/modal/editAddr_modal.html',
				controller : 'editAddrCtrl',
				size : 'lg',
				resolve : {
					isSetTop : function(){
						//必须用 angular.copy深拷贝一份
						return angular.copy(isSetTop);
					},
					addr : function(){
						return angular.copy(addr);
					}
				}
			}).result.then(function(address){
				if(!addr) {
					loadAddrs(true);
				}else {
					loadAddrs();
				}

			}, function(reason){
				toaster.pop('info', '提示 ' + '您已取消收货地址的编辑');
			});
		};

		/**
		 * 展示所有收货地址信息
		 */
		$scope.listShippingAddress = function () {
			window.alert("list shipping address");
		};

	}]);

	//地址编辑模态框
	app.register.controller('editAddrCtrl', ['$scope', 'isSetTop', 'addr', '$modalInstance', 'toaster', '$http', 'ShippingAddress', function($scope, isSetTop, addr, $modalInstance, toaster, $http, ShippingAddress){
		$scope.isSetTop = isSetTop;
		//验证数据
		$scope.checkeds = {};
		$scope.checkform = function(name,num) {
			if(num == 1) {
				if(angular.isUndefined(name)) {
					$scope.checkeds.name = false;
				} else {
					$scope.checkeds.name = true;
				}
			} else if(num == 2) {
				if(angular.isUndefined(name)) {
					$scope.checkeds.detailAddress = false;
				} else {
					$scope.checkeds.detailAddress = true;
				}
			} else if(num == 3) {
				if(angular.isUndefined(name)) {
					$scope.checkeds.tel = false;
				} else {
					$scope.checkeds.tel = true;
				}
			}
		};
		$http.get('static/js/prod/data/city.json').success(function(data) {
			$scope.division = data;
			if(addr && addr.area){
				$scope.address = addr;
				//拼装下拉选择框
				var arr = addr.area.split(',');
				addr.province = arr[0];
				addr.city = arr[1];
				addr.district = arr[2];
				$scope.address = addr;
				$scope.addr = true;
			}
		}).error(function(e) {
			toaster.pop('error', '系统错误 ' + '加载城市信息失败');
		});

		$scope.save = function () {
			var address = $scope.address;
			//拼装地区
			/**
			 * TODO 这里没做校验
			 */
			var strAres = address.province + ',' + address.city + ',' + address.district;
			address.area = strAres;

			// send属性 控制本地址是否是发货地址
			ShippingAddress.save({isSetTop: $scope.isSetTop, send: false, isPersonal: true}, address, function(data){
				toaster.pop('success', '成功 ', '保存收货地址成功');
				$modalInstance.close(data);
			}, function(res){
				toaster.pop('error', '保存收货地址失败 ', res.data);
			});
		}

		$scope.cancel = function() {
			$modalInstance.dismiss();
		};
	}]);
});
