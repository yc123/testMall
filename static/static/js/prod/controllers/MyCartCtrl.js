define([ 'app/app', 'jquery-summernote' ], function(app) {
	'use strict';
	app.register.controller('MyCartCtrl', ['$rootScope','$scope', 'toaster', '$modal', 'ngTableParams', 'BaseService', 'Cart', '$filter' , 'ComponentActive', '$location', 'Order', '$state', 'SessionService', 'Goods', 'EncryptionService', function($rootScope, $scope, toaster, $modal, ngTableParams, BaseService, Cart, $filter ,ComponentActive, $location, Order, $state, SessionService, Goods, EncryptionService) {
		
		/* TODO 
		 * 需要把批次的库存带出来，并给颜色，提示用户删除或修改那一条记录
		 * */
		var enIdFilter = $filter('EncryptionFilter');
		$scope.cartExist = true;
		$scope.errors = null;
		$scope.goodsInfo = [];
		$scope.cart = [];
		$scope.cartView = [];
		$scope.all = {};
		$scope.isMore = false;
		$scope.moneyInfo = {};
		//价格的统计信息
		$scope.totalMoneyInfo = {};
		$scope.totalMoneyInfo.RMBTotal = 0;
		$scope.totalMoneyInfo.USDTotal = 0;
		//散乱的信息可以放在basic中
		$scope.basic = {};
		$scope.basic.status = '';
		$scope.newData = [];
		$scope.product = {};
		
		var loadData = function (){
			Cart.getCarts(null, function(data) {
				var crName = "";
				var isOnlyOne = 1;
				angular.forEach(data, function(cart) {
					if (typeof cart == 'object') {
						if(cart.goods) {
							$scope.getPrice(cart);
						}
						if(!crName) {
							crName = cart.goods.currencyName;
						}else {
							if(crName != cart.goods.currencyName) {
								isOnlyOne = 0;
							}
						}
						$scope.newData.push(cart);
					}
				});
				if(isOnlyOne) {
					if(crName.indexOf('-') < 0) {
						$scope.totalMoneyInfo.currencyName = crName;
					}
				}
				// cartView用于显示
				$scope.all.isSelectTotal = false;
				$scope.cartView.push($scope.newData);
				// cart用于判断状态
				$scope.cartInfo = $scope.newData;
			},function(response) {
				toaster.pop('error', "提示", "获取购物车信息失败，请刷新页面");
			});
		}
		
		loadData();
		
		//根据搜索词过滤购物车信息，对类目、品牌、器件筛选
		$scope.cartFilterCurrency = function(cartGroup) {
			var result = false;
			if((!$scope.product.keyword) && (!$scope.totalMoneyInfo.currencyName)) {
				result = true;
			}else if($scope.product.keyword) {
				if(cartGroup.kiName.toLowerCase().indexOf($scope.product.keyword.toLowerCase()) > -1
						|| cartGroup.brName.toLowerCase().indexOf($scope.product.keyword.toLowerCase()) > -1
						|| cartGroup.code.toLowerCase().indexOf($scope.product.keyword.toLowerCase()) > -1) {
					if($scope.totalMoneyInfo.currencyName) {
						if(cartGroup.currencyName.indexOf($scope.totalMoneyInfo.currencyName) > -1) {
							result = true;
						}	
					}else {
						result = true;	
					}
				}
			}else if($scope.totalMoneyInfo.currencyName){
				if(cartGroup.currencyName.indexOf($scope.totalMoneyInfo.currencyName) > -1) {
					result = true;
				}
			}
			return result;	
		}
		
		//筛选有效 、失效状态的信息
		$scope.cartFilterStatus = function(cartGroup) {
			if(angular.equals($scope.basic.status, 1)) {
				if(cartGroup.isActive) {
					return true;
				}
			}else if(angular.equals($scope.basic.status, 0)){
				if(!cartGroup.isActive) {
					return true;
				}
			}else {
				return true;
			}
		}
		
		//下拉框的隐藏或显示的方法
		$scope.showDrop = function(dropMenu) {
			$scope[dropMenu] = !$scope[dropMenu];
		}
		
		//选择币别
		$scope.selectCurr = function(crName) {
			$scope.totalMoneyInfo.currencyName = crName;
			$scope.selectCurrency = false;
			angular.forEach($scope.cartView[0], function(cartGroup) {
				cartGroup.isSelect = false;
			});
			$scope.getTotal();
			$scope.getTaxes();
		}
		
		//选择状态
		$scope.selectSta = function(isActive) {
			if(!angular.equals($scope.basic.status, '') && !angular.equals($scope.basic.status, isActive)) {
				angular.forEach($scope.cartInfo, function(cart) {
					cart.isSelect = false;
				});
			}
			$scope.basic.status = isActive;
			$scope.selectStatus = false;
		};
		
		// 输入购买量限制
		$scope.changeNum = function (c) {
			c.number = parseInt(c.number);
			if (c.number < c.goods.minBuyQty || !c.number) {
				toaster.pop("warning", "提示", "购买数量应不少于商品最小起订量");
				c.number = c.goods.minBuyQty;
			}
			$scope.getPrice(c);
			$scope.getTotal();
			$scope.getTaxes();
		}
		
		// 数量修改提醒
		$scope.maxNum = function (c) {
			if (c.number > c.goods.reserve) {
				toaster.pop("warning","警告","输入数量无法超过该商品最大库存，请重新确认");
				c.number = c.goods.reserve;
			} else if (c.number < 0) {
				toaster.pop("error","错误","输入数量有误，请重新确认");
				c.number = c.goods.minBuyQty;
			}
		}
		
		//判断购物车是否为空
		Cart.getCount({}, function(data){
			$scope.countExist = data.count;
			if ($scope.countExist == 0) {
				$scope.cartExist = false;
			} else {
				$scope.cartExist = true;
			}
		}, function(res){
			toaster.pop('error', '系统错误', '获取购物车失败' + res.data);
		});
		
		// 已选数量计算
		$scope.countNum = function(value) {
			var count = 0;
			angular.forEach(value, function(c) {
				if (c.isSelect) {
					count += c.number;
				}
			});
			return count;
		};
		
		$scope.onSearch = function() {
			console.log($scope.keyword);
		}
		
		// 物品分段单价获取
		$scope.getPrice = function(c) {
			for(var i = 0; i < c.goods.prices.length; i++) {
				if(c.goods.prices[i].start <= c.number && c.number <= c.goods.prices[i].end) {
					c.rMBPrice = c.goods.prices[i].rMBPrice;
					c.uSDPrice = c.goods.prices[i].uSDPrice;
					if(c.goods.currencyName.indexOf("RMB") > -1) {
						c.RMBCount = c.rMBPrice * c.number;
					}
					if(c.goods.currencyName.indexOf("USD") > -1) {
						c.USDCount = c.uSDPrice * c.number;
					}
					return;
				}
			}
		};
		
		//单个删除购物车选购批次
		$scope.deleteBatch = function(cart){
			var arr = [];
			arr.push(cart.batchCode);
			var batchCodes = angular.toJson(arr);
			Cart.deleteByBatchCode({}, batchCodes, function() {
				// 因为cart包含的是一个数组对象和两个状态信息，所以cart[0]是表示cartView。而cart[0][goods.uuid]才表示cartView[0]，即购物车
				// 而在修改了页面显示的cartView之后，也要修改用于计算的cart
				var index1 = $scope.cartView[0].indexOf(cart);
				$scope.cartView[0].splice(index1, 1);
				toaster.pop('success', '提示 ', '购物车信息删除成功');
				// 删除购物车信息不刷新，但是需要重新获取其他值
				$scope.batchChoose();
				$scope.compChoose();
				$scope.getChoose();
				Cart.getCount({}, function(data){
					$rootScope.countCart = data.count;
				}, function(res){
					toaster.pop('error', '系统错误', '获取购物车商品数量失败');
				});
				if ($scope.cartView[0].length == 0) {
					location.reload('product#/cart');
				}
			}, function() {
				toaster.pop('error', '系统错误', '购物车信息删除失败');
			});
		}
		
		// 清空购物车
		$scope.deleteAll = function(){
			var batchCodeSet = [];
			angular.forEach($scope.newData, function (a) {
				batchCodeSet.push(a.batchCode);
			});
			var batchCodes = angular.toJson(batchCodeSet);
			Cart.deleteByBatchCode({}, batchCodes, function() {
				toaster.pop('success', '提示 ', '购物车删除成功');
				location.reload('product#/cart'); 
			}, function() {
				toaster.pop('error', '系统错误', '购物车删除失败');
			});
		}
		
		// 检测全选框状态
		$scope.checkSelect = function(value, cartGroup) {
			if ((typeof(cartGroup.goods) == "undefined") || (cartGroup.goods.isActive == 0)) {
				toaster.pop('info', '此批次已经下架，请您手动移除，并重新选购');
				cartGroup.isSelect = false;
			} else {
				if(cartGroup.isSelect) {
					if(!$scope.totalMoneyInfo.currencyName) {
						toaster.pop('info', '请先选择币别');
						cartGroup.isSelect = false;
					}else if(cartGroup.goods.currencyName.indexOf($scope.totalMoneyInfo.currencyName) < 0){
						cartGroup.isSelect = false;
						toaster.pop('info', '您选择的币别与之前选择的币别不一致！');
						return ;
					}
				}
				$scope.getTotal();
				$scope.getTaxes();
			}
		}
		
		//判断是空对象
		$scope.isNullObject = function(obj) {
			var isObject = true;
			for(var k in obj) {
				isObject = false;
			}
			return isObject;
		}
		
		// 统计已勾选批次
		var creatSelectArr = function(carts){
			var arr = [];
			angular.forEach(carts, function(cart) {
				if (cart.isSelect) {
					arr.push(cart);
				}
			});
			return arr;
		};
		
		// 总计已选数量
		$scope.getChoose = function() {
			var count = 0;
			var arr = creatSelectArr($scope.cartInfo);
			angular.forEach(arr, function(cartGroup){
				count += Number(cartGroup.number);
			});
			return count;
		}	
		
		// 总计已选批次数
		$scope.batchChoose = function() {
			var count = 0;
			var arr = creatSelectArr($scope.cartInfo);
			angular.forEach(arr, function(cartGroup){
				count += 1;
			});
			if(count == 0) {
				$scope.totalMoneyInfo.RMBTotal = 0;
				$scope.totalMoneyInfo.USDTotal = 0;
			}
			return count;
		}
		
		// 总计已选型号
		$scope.compChoose = function() {
			var count = 0;
			$scope.chooseComp = {};
			var arr = creatSelectArr($scope.cartInfo);
			angular.forEach(arr, function(cartGroup) {
				if (!$scope.chooseComp[cartGroup.code]) {
					count += 1;
					$scope.chooseComp[cartGroup.code] = cartGroup.code;
				}
			});
			return count;
		}
		
		// 总计已选金额
		$scope.getTotal = function() {
			$scope.totalMoneyInfo.RMBTotal = 0;
			$scope.totalMoneyInfo.USDTotal = 0;
			var arr = creatSelectArr($scope.cartInfo);
			angular.forEach(arr, function(cartGroup){
				if(cartGroup.currencyName.indexOf($scope.totalMoneyInfo.currencyName) > -1) {
					if($scope.totalMoneyInfo.currencyName == "RMB") {
						$scope.totalMoneyInfo.RMBTotal = Number($scope.totalMoneyInfo.RMBTotal) + Number(cartGroup.RMBCount);
					}else if($scope.totalMoneyInfo.currencyName == "USD"){
						$scope.totalMoneyInfo.USDTotal = Number($scope.totalMoneyInfo.USDTotal) + Number(cartGroup.USDCount);
					}else if($scope.totalMoneyInfo.currencyName == "RMB-USD"){
						$scope.totalMoneyInfo.RMBTotal = Number($scope.totalMoneyInfo.RMBTotal) + Number(cartGroup.RMBCount);
						$scope.totalMoneyInfo.USDTotal = Number($scope.totalMoneyInfo.USDTotal) + Number(cartGroup.USDCount);
					}else {
						toaster.pop("error", "您当前选择的币别信息有误，请刷新界面重新操作");
						return ;
					}
				}
			});
		};
		
		// 总计税额
		$scope.getTaxes = function() {
			$scope.totalTaxes = {};
			if($scope.totalMoneyInfo.currencyName == "USD" || !$scope.totalMoneyInfo.currencyName) {
				return ;
			}
			var arr = creatSelectArr($scope.cartInfo);	
			angular.forEach(arr, function(cartGroup){
				var tax = (cartGroup.tax || 17) * 0.01;
				if ($scope.totalTaxes["RMB"]) {
					$scope.totalTaxes["RMB"] += (cartGroup.RMBCount * tax)/(1+ tax);
				} else {
					$scope.totalTaxes["RMB"] = (cartGroup.RMBCount * tax)/(1+ tax);
				}
			});
		};
		
		//装载orderDetail对象数组
		var creatObjOrderDetail = function(){
			var arr = creatSelectArr($scope.cartInfo);
			var arrOD = [];
			var result = {};
			result.currency = $scope.totalMoneyInfo.currencyName;
			angular.forEach(arr, function(cg){
				var obj = {};
				obj.batchCode = cg.batchCode;
				obj.number = cg.number;
				obj.taxes = cg.taxes;
				arrOD.push(obj);	
			});
			result.arrOD = arrOD;
			return result;
		};
		
		// 判断批次是否有效
		$scope.checkBatchCode = function(cartGroup,value) {
			var tip = true;
			angular.forEach($scope.errors, function(data) {
				if (cartGroup.batchCode == data.batchCode) {
					tip = false;
					cartGroup.isSelect = false;
				}
			})
			value.isSelectAll = false;
			return tip;
		};
		
		$scope.submitOrder = function(){
			var result = creatObjOrderDetail();
			if(result.arrOD.length == 0) {
				toaster.pop('info', '请勾选要生成订单的批次');
				return ;
			}
/*			if(angular.equals($scope.totalMoneyInfo.currencyName, 'RMB')) {
				if($scope.totalMoneyInfo.RMBTotal < 500) {
					toaster.pop('info', '购买人民币的总金额必须不小于500');
					return ;
				}
			}else {
				if($scope.totalMoneyInfo.USDTotal < 100) {
					toaster.pop('info', '购买美金的总金额必须不小于100');
					return ;
				}
			}*/
			SessionService.set("buyNow",false);
			var jsonOrderDetails = angular.toJson(result);
			Order.saveByGroup({}, jsonOrderDetails, function(data){
				//将已生成订单的批次号 在购物车中对应的信息删除
				var batchCodeSet = [];
				angular.forEach(result.arrOD, function (a) {
					batchCodeSet.push(a.batchCode);
				});
				var batchCodes = angular.toJson(batchCodeSet);
				Cart.deleteByBatchCode({}, batchCodes, function() {
					toaster.pop('success', '提示 ', '您购物车对应信息已删除');
				}, function() {
					toaster.pop('error', '系统错误', '购物车对应信息删除失败');
				});
				toaster.pop('success', '成功', '订单生成成功。请您确认订单并付款');
				window.location.replace('products#/orderEnsure/'+ enIdFilter(data.orderid));
			}, function(res){
				toaster.pop('error', '警告', res.data);
			});
			
		};
	}]);
	
});