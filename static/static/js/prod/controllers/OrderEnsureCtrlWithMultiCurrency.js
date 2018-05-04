define([ 'app/app' ], function(app) {
	'use strict';
	
	app.register.controller('OrderEnsureCtrl', [ '$scope', '$stateParams', '$location', '$modal', '$filter', 'toaster', 'Order', 'OrderSimpleInfo', 'Cart', 'ShippingAddress', 'PickUpAddress' , 'SessionService', '$window' ,'Bill', 'bankInfoService', '$interval', 'ExpressPrice', '$q', '$rootScope', 'Ysepay', 'AuthenticationService', function($scope, $stateParams, $location, $modal, $filter,  toaster, Order, OrderSimpleInfo , Cart, ShippingAddress, PickUpAddress, SessionService, $window, Bill, bankInfoService,  $interval, ExpressPrice, $q, $rootScope, Ysepay, AuthenticationService) {
		
		/************************************************************************
		 * general
		 ************************************************************************/

		var enIdFilter = $filter('EncryptionFilter');
		// 使银行账号只显示最后四位
		var hideBankFilter = $filter("hideBankFilter");
		
		// 直接购买不显示进度条
		var a = SessionService.get("buyNow")? SessionService.get("buyNow") : 'false';
		if (a == 'true') {
			$scope.isBuyNow = true;
		} else {
			$scope.isBuyNow = false;
		}		
		
		//定时器
		var setTime = function() {
			if($scope.time > 0) {
				setTimeout(function() {
					$scope.$apply(function() {
						$scope.time--;
						setTime();
					});
				}, 1000);
			}else {
				if($scope.errorData) {
					var spit = $scope.errorData.split(':');
					if(spit.length == 3) {
						OrderSimpleInfo.setUnavailable({orderid: enIdFilter(spit[1])}, null, function(data) {
							SessionService.set('todoState','unavailable');
							window.location.replace('user#/home/myOrder_todo');
							toaster.pop('sucess', '失效成功，此订单因库存不足已失效');
						}, function(res){
							toaster.pop('info', '订单未失效，请刷新界面');
						})
					}else {
						toaster.pop('error', '订单确认失败，');
						window.location.replace('user#/home/myOrder_todo');
					}
				}
			}
		};
		
		// 失效订单
		var unavailable = function() {
			$scope.loading = true;
			$scope.errorloading = true; 
			$scope.time = 5;
			setTime();
			$scope.$watch('time', function(newValue, oldValue, scope) {
				if(!newValue) {
					//跳转到未完成订单界面
					SessionService.set('todoState','unavailable');
					$window.location.href = "user#/home/myOrder_todo";
				}
			});
		};
		
		// 每个下拉框是否显示
		$scope.dropdownState = {
			deliveryMode: false,
			receivingInfo: false,
			paytype: false,
			invoiceType: false,
			selectCurrency: false
		};
		// 显示或关闭某个下拉列表
		$scope.showDropdown = function(item) {
			switch (item) {
				case 'deliveryMode': $scope.dropdownState.deliveryMode = !$scope.dropdownState.deliveryMode; break;
				case 'receivingInfo': $scope.dropdownState.receivingInfo = !$scope.dropdownState.receivingInfo; break;
				case 'paytype': $scope.dropdownState.paytype = !$scope.dropdownState.paytype; break;
				case 'invoiceType': $scope.dropdownState.invoiceType = !$scope.dropdownState.invoiceType; break;
				case 'selectCurrency': $scope.dropdownState.selectCurrency = !$scope.dropdownState.selectCurrency; break;
			};
		};
		
		// 检查订单是否可提交
		var checkCanSubmitOrderOrNot = function() {
			if($scope.order && $scope.selectAddress) {
				for(var i = 0; i < $scope.order.orderDetails.length; i++) {
					var detail = $scope.order.orderDetails[i];
					if($scope.qtyInvalid(detail)) {
						$scope.canSubmitOrder = false; return;
					};
				};
				if($scope.order.invoicetype != 1207 && angular.equals($scope.selecInvoice, {})) {
					$scope.canSubmitOrder = false;
					return;
				};
				if($scope.order.currency === 'USD' && $scope.order.paytype === 1102) {
					$scope.canSubmitOrder = false;
					return;
				}
				$scope.canSubmitOrder = true; return;
			}else if($scope.order && !$scope.selectAddress) {
				$scope.canSubmitOrder = false; return;
			};
		};
		
		/************************************************************************
		 * main init
		 ************************************************************************/
		// 直接初始化不需要从服务器获取的数据，这样不会产生异步。
		var initCommonData = function() {
			$scope.orderid =  $stateParams.orderid;
			$scope.purchaseSub = false;//购买主体，默认是公司
			$scope.select = {};
			$scope.select.purKind = false;//应付账户的类别, 默认是企业
			$scope.select.sellerKind = false;//应收账户的类别，默认是企业
			$scope.canSubmitOrder = false;
		};
		initCommonData();	
			
		// 初始化订单明细
		var initOrderDetails = function(order) {
			angular.forEach(order.orderDetails, function(detail, k) {
				if(detail.number <= detail.reserve) {
					detail.canAddToCart = true;
				}else {
					detail.canAddToCart = false;
				}
				refreshUnitrice(detail);
			})
		};
		
		// 初始化订单相关数据。由于订单确认页现在只处理单张且同一币别订单，因此只处理获取的订单中的第一张订单。
		var initOrder = function() {
			// 默认为普通发票    --1205专用增值税发票   --1206普通发票  --1207不开发票
			$scope.order.invoicetype = 1205;
			// 默认选择UU配送  --1301UU配送  --1302上门自提
			$scope.order.deliverytype = 1301;
			// 默认选择在线支付  --1102在线支付
			$scope.order.paytype = 1102;
		};
		
		var getOrderData = function() {
			//加载订单数据
			return Order.query({orderid: $scope.orderid}, function(data){
				//这里判断一下data里面的值是否有异常
				if(data[0].exception)  {
					toaster.pop('error', '订单确认失败 ', data[0].exception);
					unavailable();
					return;
				}
				$scope.orders = data;
				if($scope.orders.length != 0) {
					/*TODO 所有订单都需要的属性*/
					$scope.order = $scope.orders[0];
				}
				//检查订单状态
				if($scope.order.status != 501){
					/*TODO 订单无效的逻辑*/
					unavailable();
					toaster.pop('error', '错误', '此订单状态不可操作!!');
				}
			}, function(res){
				toaster.pop('error', '系统错误', '获取订单信息失败');
			});
		};
		
		// 加载用户收货地址
		var loadAddrs = function(isLast){
			return ShippingAddress.get({send: false}, function(data) {
				//为每个设置选择状态
				angular.forEach(data, function(addr){
					addr.isSelect = false;
				});
				$scope.addrs = data;
				if($scope.addrs.length > 0) {
					if(isLast) {
						$scope.addrs[$scope.addrs.length-1].isSelect = true;
						$scope.selectAddress = $scope.addrs[$scope.addrs.length-1];
					}
					if(!$scope.selectAddress) {
						$scope.addrs[0].isSelect = true;
						$scope.selectAddress = $scope.addrs[0];
					}else {
						// 如果原来保存的地址 被删除，就设置第一个为默认的地址
						var isExist = false;
						angular.forEach($scope.addrs, function(addr) {
							if(addr.id == $scope.selectAddress.id) {
								addr.isSelect = true;
								$scope.selectAddress = addr;
								$scope.selectAddress.isSelect = true;
								isExist = true;
							}
						});
						if(!isExist) {
							$scope.addrs[0].isSelect = true;
							$scope.selectAddress = $scope.addrs[0];
						}
					}
				}
				checkCanSubmitOrderOrNot(); //检查订单是否可提交
			}, function(response) {
				toaster.pop('error', '系统错误', '获取收货地址失败');
			});
		};
		
		// 获取发票信息方法	1205为增值税专用发票	1206为增值税普通发票	1207为不开发票
		var getInvoiceInfo = function() {
			return Bill.getListPersonal(null, function(data) {
				$scope.specialInvoice = {};
				angular.forEach(data, function(bill) {
					if(bill.kind == 1205) {
						$scope.specialInvoice = bill;
					}
				});
			}, function(response) {
                toaster.pop('error', '获取发票信息失败 ' + response.data);
			});
		};
		
		// 计算运费
		var calculateFright = function() {
			var address = $scope.selectAddress.area + "," + $scope.selectAddress.detailAddress;
			var volume = 0;
			var weight = 0;
			angular.forEach($scope.order.orderDetails, function(v, k) {
				weight += v.weight||0;
				volume += v.volume||0;
			});
			weight = weight === 0 ? 1 : weight; // 默认1克
			volume = volume === 0 ? 1 : volume; // 默认1立方厘米
			ExpressPrice.getFreight({address : address, volume : volume, weight : weight}, function(data) {
				$scope.freight = data.freight;
			})
		};
		
		// 初始化币别
		var initCurrency = function() {
			$scope.order.currency = "RMB";
			if($scope.selectAddress) {
				if($scope.selectAddress.area.startsWith("香港")) {
					$scope.order.currency = "USD";
					$scope.order.invoicetype = "1207";
					$scope.order.selecInvoice = {};
				}else {
					$scope.order.currency = "RMB";
					$scope.order.invoicetype = "1205";
					$scope.order.selecInvoice = $scope.specialInvoice;
				}
			}
		}
		
		// 计算商品数量、金额
		var calculateQtyAndAmount = function() {
			$scope.totalQty = 0; // 已选购的总数量
			$scope.productsAmount = 0; // 已选购的商品总额
			var importedAmount = 0.0; // 进口商品人民币总价
			var cmps = [];
			angular.forEach($scope.order.orderDetails, function(detail, k) {
				$scope.totalQty += Number(detail.number);
				// 保留两位小数，第三位存在则加一，如99.021 -> 99.03
				$scope.productsAmount += Math.ceil(detail.taxUnitprice * detail.number * 100) / 100;
				
				if(cmps.indexOf(detail.cmpCode) === -1) {
					cmps.push(detail.cmpCode);
				}
				
				if(detail.currencyLackOfPrice === 'RMB' && $scope.order.currency === "RMB") {
					importedAmount += Math.ceil(detail.taxUnitprice * detail.number * 100) / 100;
				}
			});
			$scope.importExtraCharges = Math.ceil(importedAmount * $scope.order.importExtraChargeRate * 100) / 100; //进口额外支付费用
			if(0 < $scope.importExtraCharges && $scope.importExtraCharges < 300) {
				$scope.importExtraCharges = 300;
			}
			$scope.cmpNum = cmps.length;
		};
		
 		//  订单、地址、运费初始化。运费必须在订单与地址获取并resolve之后才能初始化，因此使用Promise.all或$q.all来保证所有promise解析之后再计算运费
		var init = function() {
			/*Promise.all([getOrderData(), loadAddrs()]).then(initFright)	两种方式都可以*/
			$q.all([getOrderData().$promise, loadAddrs().$promise, getInvoiceInfo().$promise]).then(function(){
				initOrder();// 订单初始化
				initCurrency(); // 初始化币别
				$scope.selectInvoiceType($scope.order.invoicetype);
				initOrderDetails($scope.order); //订单明细初始化，需要根据币别来计算taxUnitPrice，因此需在获取地址后进行。
				calculateQtyAndAmount();
				//calculateFright(); // 需求变更，暂不做运费处理，保留接口
				checkCanSubmitOrderOrNot(); //检查订单是否可提交
			}); 
		};
		init();
		
		
		/************************************************************************
		 * product confirm
		 ************************************************************************/
		// 展开或隐藏分段价格
		$scope.showPrices = function(detail, currency) {
			if(currency === 'RMB') {
				detail.$pricesShowRmb = !detail.$pricesShowRmb;
			}else if(currency === 'USD') {
				detail.$pricesShowUsd = !detail.$pricesShowUsd;
			}
			
		};
		
		// 选择币别
		$scope.selectCurrency = function(currency) {
			if($scope.order.currency !== currency) {
				if($scope.selectAddress) {
					var prevAddress = angular.fromJson(SessionService.get($scope.order.orderid + 'addr'));
					if(currency === "USD" && !$scope.selectAddress.area.startsWith("香港")) {
						$scope.order.invoicetype = "1207";
						$scope.selecInvoice = {};
						if(prevAddress && prevAddress.area.startsWith("香港")) {
							$scope.selectAddress = prevAddress;
						} else {
							var isExistHKAddr = false;
							for(var i = 0; i < $scope.addrs.length; i++) {
								var addr = $scope.addrs[i];
								if(addr.area.startsWith("香港")) {
									if($scope.selectAddress) {
										$scope.selectAddress.isSelect = false;
									};
									addr.isSelect = true;
									SessionService.set($scope.order.orderid + 'addr', angular.toJson($scope.selectAddress));
									$scope.selectAddress = addr;
									isExistHKAddr = true;
									break;
								}
							}
							if(!isExistHKAddr) {
								alert("只能在香港以美元购买商品，请添加香港收货地址，并修改收货地址为香港");
								return;
							}
						}
					}
					if(currency === "RMB" && $scope.selectAddress.area.startsWith("香港")) {
						$scope.order.invoicetype = "1205";
						$scope.selecInvoice = $scope.specialInvoice; 
						if(prevAddress && !prevAddress.area.startsWith("香港")) {
							$scope.selectAddress = prevAddress;
						} else {
							var isExistMainlandAddr = false;
							for(var i = 0; i < $scope.addrs.length; i++) {
								var addr = $scope.addrs[i];
								if(!addr.area.startsWith("香港")) {
									if($scope.selectAddress) {
										$scope.selectAddress.isSelect = false;
									};
									addr.isSelect = true;
									SessionService.set($scope.order.orderid + 'addr', angular.toJson($scope.selectAddress));
									$scope.selectAddress = addr;
									isExistMainlandAddr = true;
									break;
								}
							}
							if(!isExistMainlandAddr) {
								alert("只能在大陆以人民币购买商品，请添加大陆收货地址，并修改收货地址为大陆收货地址");
								return;
							}
						}
					}
					
					$scope.order.currency = currency;
					angular.forEach($scope.order.orderDetails, function(detail, k) {
						refreshUnitrice(detail);
					})
					calculateQtyAndAmount();
					$scope.dropdownState.selectCurrency = false;
				}else {
					alert("币别与收货地址相关，请您先添加收货地址");
				}
			}
		}
		
		// 验证批次购买数量是否无效
		$scope.qtyInvalid = function(detail) {
			if(!detail.number) {
				detail.noBuyQty = true;
				detail.ltMinPackQty = false;
				detail.notMultipleOfminPackQty = false;
				detail.greaterThanReserve = false;
				return true;
			};
			detail.number = Number(detail.number);
			if(detail.number < detail.minBuyQty) {
				detail.ltMinPackQty = true;
				return true;
			}
			if(detail.number % detail.minPackQty) {
				detail.notMultipleOfminPackQty = true;
				return true;
			}
			if(detail.number > detail.reserve) {
				detail.greaterThanReserve = true;
				return true;
			}
			detail.noBuyQty = false;
			detail.ltMinPackQty = false;
			detail.notMultipleOfminPackQty = false;
			detail.greaterThanReserve = false;
			return false;
		};
		
		// 增加或减少购买数量
		$scope.changeBuyQty = function(detail, qty){
			detail.number = Number(detail.number) + qty;
			$scope.refresh(detail); // ng-change监测不到页面输入以外造成的改变
		};
		
		// 按分段更新单价
		var refreshUnitrice = function(detail) {
			for(var i = 0; i < detail.rmbPrices.length; i++){
				var price = detail.rmbPrices[i];
				if(price.start <= detail.number && detail.number <= price.end) {
					detail.rmbTaxUnitprice = price.taxPrice;
					detail.rmbUnitprice = price.price;
					if($scope.order.currency === "RMB") {
						detail.taxUnitprice = price.taxPrice;
					}
					break;
				}
			}
			for(var i = 0; i < detail.usdPrices.length; i++){
				var price = detail.usdPrices[i];
				if(price.start <= detail.number && detail.number <= price.end) {
					detail.usdTaxUnitprice = price.taxPrice;
					detail.usdUnitprice = price.price;
					if($scope.order.currency === "USD") {
						detail.taxUnitprice = price.taxPrice;
					}
					break;
				}
			}
		};
		
		// 更新商品总数量、总金额、运费
		$scope.refresh = function(detail) {
			if(!$scope.qtyInvalid(detail)) {
				detail.number = Number(detail.number);
				refreshUnitrice(detail);
				//calculateFright(); // 需求变更，暂不做运费处理，保留接口
				calculateQtyAndAmount();
				detail.canAddToCart = true;
			}else {
				detail.canAddToCart = false;
			}
			checkCanSubmitOrderOrNot(); //检查订单是否可提交
		};
		
		// 取消订单明细
		$scope.cancelOrderDetail = function(detail, order) {
			Order.deleteDetails({},{
				detailIds : detail.id,
				orderid: order.orderid
			}, function(data) {
				var index = $scope.order.orderDetails.indexOf(detail);
				$scope.order.orderDetails.splice(index, 1);
				calculateQtyAndAmount();
				toaster.pop('sucess', '取消订单明细成功');
				if($scope.order.orderDetails.length === 0) {
					$scope.loading = true;
					toaster.pop('sucess', '订单为空，即将返回商品首页重新购买商品');
					$location.path("product#/home");
					$scope.time = 5;
					setTime();
				}
			}, function(err) {
				toaster.pop('error', '取消失败' + err);
			});
		};
		
		// 加入购物车
		$scope.addToCart = function(detail){
			$scope.qtyInvalid(detail);
			
			if(!$rootScope.userInfo || !$rootScope.userInfo.userUU) {
				AuthenticationService.redirectSignin();
				return;
			}
			var goods = {};
			goods.uuid = detail.uuid;
			goods.number = detail.number;
			goods.batchCode = detail.batchCode;
			goods.taxes = detail.taxes;
			if($scope.isBuy){// 1、如果是立即购买，直接生成订单，返回订单
				
			} else {// 2、如果是加入购物车，组装cart对象，提交
				if (goods.number > 0) {
					Cart.save({uuid: goods.uuid}, goods, function(data){
						toaster.pop('success', '保存成功', '添加购物车成功');
						Cart.getCount({}, function(data){
							$rootScope.countCart = data.count;
						}, function(res){
						});
					}, function(res){
						toaster.pop('error', '警告', res.data);
					});
				} else {
					toaster.pop('warning', '提示', '该商品库存为0，请等待上货或联系客服');
				}
			}
		};
		
		
		/************************************************************************
		 * logistics confirm
		 ************************************************************************/
		//选择送货方式--1301为UU配送    1302  为上门自提
		$scope.selectDelivery = function(code){
			delete $scope.pickAddress;
			$scope.order.deliverytype = code;
			$scope.dropdownState.deliveryMode = false;
		};
		
		/**
		 * 送货方式为1302(上门自提)时，需要选择提货地址
		 */
		//获取提货地址列表
		$scope.getPickUpAddress = function(code){
			$scope.selectDelivery(code);
			PickUpAddress.get({}, function(data){
				$scope.pickUpAddress = data;
				$scope.pickUpAddress[0].isActive = true;
				$scope.pickAddress = $scope.pickUpAddress[0];
			});
		}
		
		$scope.setBorderGray = function(index){
			$scope.pickUpAddress[index].isFocus = true;
		};

		$scope.cancelBorderGray = function(index){
			$scope.pickUpAddress[index].isFocus = false;
		};
		
		//选择自取地址
		$scope.selectPick = function(pick, pickUpAddress){
			angular.forEach(pickUpAddress, function(p) {
				p.isActive = false;
			});
			pick.isActive = true;
			$scope.pickAddress = pick;
		};
		
		//选择收货地址
		$scope.selectAddr = function(addr, addrs){
			if(addr !== $scope.selectAddress) {
				if(addr.area.startsWith("香港")) {
					$scope.order.currency = "USD";
					$scope.order.invoicetype = "1207";
					$scope.selecInvoice = {};
				}else {
					$scope.order.currency = "RMB";
					$scope.order.invoicetype = "1205";
					$scope.selecInvoice = $scope.specialInvoice;
				}
				
				angular.forEach(addrs, function(ad) {
					ad.isSelect = false;
				});
				addr.isSelect = true;
				$scope.selectAddress = addr;
				angular.forEach($scope.order.orderDetails, function(detail, k) {
					refreshUnitrice(detail);
				})
				calculateQtyAndAmount();
				checkCanSubmitOrderOrNot(); //检查订单是否可提交
			}
			$scope.dropdownState.receivingInfo = false;
		};
		
		//删除收货地址
		$scope.deleteAddr = function(addr){
			$scope.isnotCheck = true;
			var isSure = confirm('确认删除？删除后不可恢复，请谨慎操作！');
			if(isSure) {
				var id = addr.id;
				ShippingAddress.del({addid: id}, {}, function(data){
					//重新加载购物数据
					loadAddrs();
				}, function(res){
					toaster.pop('error', '系统错误', '删除收货地址失败');
				});
			}
		};
		
		//编辑收货地址
		$scope.editAddr = function(isSetTop, addr) {
			$scope.isnotCheck = true;
			$modal.open({
				templateUrl : 'static/view/prod/modal/editAddr_modal.html',
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
		
		
		/************************************************************************
		 * pay confirm
		 ************************************************************************/
		$scope.selecInvoice = {};
		// 选择发票类型
		$scope.selectInvoiceType = function(type) {
			$scope.order.invoicetype = type;
			switch(type) {
			case 1207:
				$scope.selecInvoice = {};
				$scope.needCreateInvoice = false;
				break;
			case 1205:
				$scope.selecInvoice = $scope.specialInvoice; 
				if(!$scope.specialInvoice) {
					$scope.needCreateInvoice = true;
				};
				break;
			};
			$scope.dropdownState.invoiceType = false; // 关闭下拉选择列表
			checkCanSubmitOrderOrNot(); //检查订单是否可提交
		}
		
		// 新建发票类型	1205专用增值税发票   --1206普通发票  --1207不开发票
		$scope.addInvoiceInfo = function () {
			$modal.open({
				templateUrl : 'static/view/prod/modal/edit-invoice-modal.html',
				controller : 'BillInputCtrl',
				size : 'lg',
				resolve : {
					invoiceInfo: function() {
						if($scope.order.invoicetype == 1205) {
							return 1205 + "";
						}
						if($scope.order.invoicetype == 1206) {
							return 1206 + "";
						}
					}
				}
			}).result.then(function(invoice){
				if(invoice) {
					$q.all([getInvoiceInfo().$promise]).then(function() {
						// 1205专用增值税发票  1206普通发票
						if(invoice.kind == 1205) {
							$scope.selectInvoiceType(1205);
						}else if(invoice.kind == 1206) {
							$scope.selectInvoiceType(1206);
						}
					})
				}
			}, function(reason){
				toaster.pop('info', '提示 ' + '您已取消新建发票信息');
			});
		}
		
		$scope.deleteById = function(id) {
			var isToDelete = confirm("确定要删除吗？");
			if(!isToDelete) {
				return ;
			}
			Bill.deleteById({id: id}, function(data) {
				toaster.pop('success', '删除成功');
				$q.all([getInvoiceInfo().$promise]).then(function(){
					$scope.selectInvoiceType($scope.order.invoicetype);
					checkCanSubmitOrderOrNot(); //检查订单是否可提交
				}); 
			}, function(reponse) {
				toaster.pop('error', '删除发票资料失败');
			});
		}
		
		$scope.viewDetail = function(bill) {
			var modalInstance = $modal.open({
				templateUrl : 'static/view/common/billInfoModal.html',
				controller : 'BillInfoCtrl',
				resolve : {
					bill : function() {
						//深拷贝一份
						return angular.copy(bill);
					}
				}
			});
		}
		
		$scope.modify = function(invoiceId) {
			$modal.open({
				templateUrl : 'static/view/prod/modal/edit-invoice-modal.html',
				controller : 'BillInputCtrl',
				size : 'lg',
				resolve : {
					invoiceInfo: function() {
						if($scope.order.invoicetype == 1205) {
							return 1205 + "-" +invoiceId;
						}
						if($scope.order.invoicetype == 1206) {
							return 1206 + "-" +invoiceId;
						}
					},
				}
			}).result.then(function(invoice){
				if(invoice) {
					$q.all([getInvoiceInfo().$promise]).then(function() {
						// 1205专用增值税发票  1206普通发票
						if(invoice.kind == 1205) {
							$scope.selectInvoiceType(1205);
						}else if(invoice.kind == 1206) {
							$scope.selectInvoiceType(1206);
						}
					})
				}
			}, function(reason){
				toaster.pop('info', '提示 ' + '您已取消编辑发票信息');
			});
		}
		
		//选择付款方式,获取订单数据时已初始化为1102。 1102为线上支付，1103为公司转账
		$scope.selectPayType = function(code){
			$scope.order.paytype = code;
			checkCanSubmitOrderOrNot(); //检查订单是否可提交
			$scope.dropdownState.paytype = false;
		};
		
		//解析数据，从返回的数据中找到要解析的数据
		var resolveData = function(data) {
			var arr = new Array();
			for(var key in data) {
				var numb= Number(key);
				if(angular.isNumber(numb)&&(!isNaN(numb))) {
					arr.push(data[key]);
				}
			}
			return arr;
		};
		
		// 获取数据的第一行
		var getFirst = function(data) {
			var result = {};
			if(data&&data.length) {
				result = data[0];
			}else {
				result = null;
			}
			return result;
		};
		
		//获取管理平台账户信息
		var getSellerAccount = function() {
			if(!$scope.select.sellerKind) {//获取企业的账户信息
				bankInfoService.getAdminEnterAccount('', function(data) {
					$scope.saleAccountInfos = resolveData(data);
					angular.forEach($scope.saleAccountInfos, function(saleAccountInfo) {
						// saleAccountInfo.filterAccount = hideBankFilter(saleAccountInfo.number);
						if(saleAccountInfo.currency === 'RMB') {
							$scope.saleRMBAccount = saleAccountInfo;
						}
						if(saleAccountInfo.currency === 'USD') {
							$scope.saleUSDAccount = saleAccountInfo;
						}
					});
					$scope.saleEnterAccounts = $scope.saleAccountInfos;
				}, function(res) {
					toaster.pop('error', '错误', '获取商城账户信息失败');
				});
			}
		}
		getSellerAccount();
		
		
		/***********************************************************************
		 * order info 
		 ***********************************************************************/
		$scope.orderResult = true;//存放订单提交结果 orderInfo
		
		// 提取要提交到服务器的订单明细数据
		var convertOrderDetails = function() {
			var orderDetails = [];
			angular.forEach($scope.order.orderDetails, function(v, k) {
				orderDetails.push({
					id: v.id,
					number: v.number,
					taxUnitprice: v.taxUnitprice
				});
			});
			return orderDetails;
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
				orderInfo.add_id = $scope.selectAddress.id;
			}else if($scope.order.deliverytype == '1302'){
				orderInfo.add_id = $scope.pickAddress.id;
			}
			
			orderInfo.invoicetype = $scope.order.invoicetype; // 发票类型
			orderInfo.invoiceid = $scope.selecInvoice.id // 发票主键
			orderInfo.paytype = $scope.order.paytype; // 支付类型
			orderInfo.totalprice = $scope.productsAmount + $scope.importExtraCharges; // 应付总额
			orderInfo.currency = $scope.order.currency; // 币别
			orderInfo.orderRemark = $scope.order.orderRemark; // 交易备注
			orderInfo.orderDetails = convertOrderDetails(); // 订单明细信息：id、number
			
			return orderInfo;
		}
		
		/***********************************************************************
		 * order submit 
		 ***********************************************************************/
		// 是否显示取消订单的警告
		$scope.showCancelTip = function(show){
			$scope.isShowCancelTip = show;
		};
		
		//返回之前的地方
		$scope.back = function(){
			/*TODO 
			 * 这里需求是如果有来源信息（由【购物车】，【立即购买】跳转而来），返回按钮才回显示出来。
			 * */
			//将此订单失效掉
			Order.cancle({orderid: $scope.orderid}, {}, function(data){
				
			}, function(res){
				
			});
			window.location.replace('product#/cart');
		};
			
		// 确认付款
		var paymentEnsure= function() {		
			// 银盛支付
			$scope.ysepayRequest={};	
			$scope.ysepayRequest.orderid = $scope.order.orderid;// 唯一订单号

			// 签名
			Ysepay.paymentSign({orderid:$scope.ysepayRequest.orderid},{},function(data) {
				$scope.ysepayRequest = data;
				console.log($scope.ysepayRequest);
				$scope.$apply();
				var form = document.getElementById('paymentForm');
				form.action = "https://openapi.ysepay.com/gateway.do";
				form.method = "POST";
				form.submit();
			},function(res){
				toaster.pop('error', '获取支付请求参数错误', res.data);
			});
		};
		
		// 根据订单明细id得到购买数量
		var getPurchaseNumber = function(id, orderDetails) {
			for(var i = 0; i < orderDetails.length; i++) {
				var detail = orderDetails[i];
				if(detail.id == id) {
					return detail.number;
				}
			}
		}
		
		// 填充之前用户输入的数据
		var fillPrevUserInput = function() {
			var orderInfo = angular.fromJson(SessionService.get($scope.order.orderid + "-" + "ensureOrderInput"));
			// 填充购买数量
			if(orderInfo) {
				angular.forEach($scope.order.orderDetails, function(detail, k) {
					detail.number = getPurchaseNumber(detail.id, orderInfo.orderDetails);
				})
				$scope.order.deliverytype = orderInfo.deliverytype; // 1301UU配送、1302上门自提
				$scope.order.invoicetype = orderInfo.invoicetype; // 1205专用增值税发票、1206普通发票、1207不开发票
				$scope.order.paytype = orderInfo.paytype; // 1102在线支付、1103线下付款
				$scope.order.currency = orderInfo.currency; // 币别
				$scope.order.orderRemark = orderInfo.orderRemark; // 交易备注
			}
		}
		
		// 确认提交订单
		$scope.ensureOrder = function() {
			var orderInfos = [], orderInfo;
			orderInfo = generateOrderInfo();
			orderInfos.push(orderInfo);
			SessionService.set($scope.order.orderid + "-" + "ensureOrderInput", angular.toJson(orderInfo)); // 保存用户输入的信息，用于订单确认失败时恢复
			Order.ensure({orderid: $scope.orderid}, orderInfos, function(data){
				var availabletime = $filter('date')(data[0].availabletime,'yyyy-MM-dd HH:MM');
				toaster.pop('success', '提示 ', '您成功确认订单，请于' + availabletime + '之前付款');
				if($scope.order.paytype == 1102) {
					paymentEnsure();
				}else {
					$location.path("orderEnsured/" +$scope.orderid);
				}
			}, function(res){
				$scope.loading = true;
				toaster.pop('error', '订单确认失败', res.data + '<br>正在为你更新订单数据，请重新确认...', 3000, 'trustedHtml');
				/*$scope.time = 5;
				$scope.errorData = res.data;
				setTime();*/
				$q.all([getOrderData().$promise]).then(function() {
					fillPrevUserInput();
					$scope.selectInvoiceType($scope.order.invoicetype);
					initCurrency(); // 初始化币别
					initOrderDetails($scope.order); //订单明细初始化，需要根据币别来计算taxUnitPrice，因此需在获取地址后进行。
					calculateQtyAndAmount();
					checkCanSubmitOrderOrNot(); //检查订单是否可提交
					$scope.loading = false;
				})
			});
		};
	}]);
	
	
	app.register.controller('BankInfoCtrl', ['$scope', '$modalInstance', 'account', 'kind', function($scope, $modalInstance, account, kind){
		$scope.account = account;
		if($scope.account) {
			$scope.eidt = true;
		} else {
			delete $scope.eidt;
		}
		$scope.kind = kind;
		if($scope.account) {
			$scope.title = "修改账户";
		}else {
			$scope.title = "新增账户";
			$scope.account = {};
		}
		
		$scope.set = function(kind) {
			$scope.kind = kind;
		}
		
		$scope.confirm = function() {
			$scope.account.kind = $scope.kind;
			$modalInstance.close($scope.account);
		}
		
		$scope.cancel = function() {
			$modalInstance.dismiss();
		}
		
	}]);
	
	//申请议价
	app.register.controller('applyChargeCtrl', ['$scope', '$modalInstance', 'toaster', '$http', 'detail', 'Order', function($scope, $modalInstance, toaster, $http, detail, Order){
		$scope.charge = detail;
		$scope.charge.originalPrice = $scope.charge.unitprice;
		$scope.save = function () {
			//检查一下数据是否有缺失
			if($scope.charge) {
				Order.applyCharge({detailid:$scope.charge.id}, $scope.charge, function(data) {
					toaster.pop('success', '申请议价成功！');
					$modalInstance.close(data);
				}, function(res){
					toaster.pop('info', '状态非法，不允许议价');
				})
			}
	    }
	    
		$scope.cancel = function() {
			$scope.ysepayRequest={};
			$modalInstance.dismiss();
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
		}
		$http.get('static/js/prod/data/city.json').success(function(data) {
			$scope.division = data;
			if(addr){
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
	    		toaster.pop('error', '保存收货地址失败', res.data);
	    	});
	    }
	    
		$scope.cancel = function() {
			$modalInstance.dismiss();
		};
	}]);
	
	// 发票编辑模态框
	app.register.controller('BillInputCtrl', ['$scope', '$http', 'BaseService', 'Bill', 'toaster', '$stateParams', '$state', 'invoiceInfo', '$upload', '$modalInstance', function($scope, $http, BaseService, Bill, toaster, $stateParams, $state, invoiceInfo, $upload, $modalInstance) {
		//BaseService.scrollBackToTop();
		
		/*$scope.bill = {};
		$scope.bill.address = {};
		$scope.bill.is_agree = true;
		$scope.bill.kind = 1206;
		$scope.isNormal = true;
		$scope.isSpecial = true;
		$scope.invoiceType = Number(invoiceInfo.split("-")[0]);
		if(invoiceInfo.split("-").length == 2) {
			$scope.invoiceId = Number(invoiceInfo.split("-")[1]);
		}
		$scope.setType = function() {
			switch($scope.invoiceType) {
			case 1206:
				$scope.bill.kind = 1206;
				$scope.isNormal = true;
				$scope.isSpecial = false; break;
			case 1205:
				$scope.bill.kind = 1205;
				$scope.isNormal = false;
				$scope.isSpecial = true; break;
				default:
					$scope.isNormal = true;
					$scope.isSpecial = true;
			}
		}
		
		$scope.setType();
		
		$scope.getData = function() {
			if($scope.invoiceId) {
				Bill.getBillById({id: $scope.invoiceId}, function(data) {
					$scope.bill = data;
					if($scope.bill.kind == 1205) {
						$scope.isNormal = false;
					}else {
						$scope.isSpecial = false;
					}
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
					$scope.bill.is_agree = true;
				}, function(response) {
					toaster.pop('error', '获取指定的发票信息失败');
				});
			}else {
				$http.get('static/js/prod/data/city.json').success(function(data) {
					$scope.division = data;
				}).error(function(e) {
					toaster.pop('error', '系统错误 ' + '加载城市信息失败');
				});
			}
		}
		$scope.getData();
		
		$scope.saveBill = function() {
			$scope.bill.area = $scope.bill.address.province + "," + $scope.bill.address.city + "," + $scope.bill.address.district;
			var file = null
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
				toaster.pop('success', '保存发票信息成功');
				$modalInstance.close(data);
			}).error(function(data){
				toaster.pop('error', '保存发票信息失败');
			});
		};
		
		$scope.exit = function() {
			$modalInstance.dismiss();
		}*/

		$scope.bill = {};
		$scope.invoiceType = Number(invoiceInfo.split("-")[0]);
		if(invoiceInfo.split("-").length == 2) {
			$scope.invoiceId = Number(invoiceInfo.split("-")[1]);
		}
		$scope.isSpecial = true; //专票，等于true为不存在
		$scope.isNormal = true; //普票，等于true为不存在
		// 获取发票信息方法	1205为增值税专用发票	1206为增值税普通发票	1207为不开发票

		$scope.setType = function() {
			switch($scope.invoiceType) {
				case 1206:
					$scope.bill.kind = 1206;
					$scope.isNormal = true;
					$scope.isSpecial = false; break;
				case 1205:
					$scope.bill.kind = 1205;
					$scope.isNormal = false;
					$scope.isSpecial = true; break;
				default:
					$scope.isNormal = true;
					$scope.isSpecial = true;
			}
		};

		$scope.setType();

		$scope.getData = function() {
			if($scope.invoiceId) {
				Bill.getBillById({id: $scope.invoiceId}, function(data) {
					$scope.bill = data;
					if($scope.bill.kind == 1205) {
						$scope.isNormal = false;
					}else {
						$scope.isSpecial = false;
					}
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
					$scope.bill.is_agree = true;
				}, function(response) {
					toaster.pop('error', '获取指定的发票信息失败');
				});
			}else {
				$http.get('static/js/prod/data/city.json').success(function(data) {
					$scope.division = data;
				}).error(function(e) {
					toaster.pop('error', '系统错误 ' + '加载城市信息失败');
				});
			}
		};
		$scope.getData();

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

	// 订单详情模态框
	app.register.controller('BillInfoCtrl', ['$scope', '$modalInstance', 'bill', function($scope, $modalInstance, bill) {
		$scope.bill = bill;
		$scope.dismiss = function() {
			$modalInstance.dismiss();
		}
	}]);
});