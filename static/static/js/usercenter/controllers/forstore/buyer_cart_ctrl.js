/**
 * Created by yujia on 2017/3/22.
 */
define(["app/app", 'jquery-summernote'], function(app) {
	"use strict";
	app.register.controller("buyerCartCtrl", ["$scope", "$rootScope", 'toaster', '$modal', 'ngTableParams', 'BaseService', 'Cart', '$filter' , 'ComponentActive', '$location', 'Order', '$state', 'SessionService', 'EncryptionService', 'Recommendation', 'NumberService', 'Goods', 'collectionService', 'AuthenticationService', '$window', '$timeout', function($scope, $rootScope, toaster, $modal, ngTableParams, BaseService, Cart, $filter ,ComponentActive, $location, Order, $state, SessionService, EncryptionService, Recommendation, NumberService, Goods, collectionService, AuthenticationService, $window, $timeout) {
		$rootScope.active = "buyer_cart";
		document.title = '购物车-优软商城';
		/* TODO
		 * 需要把批次的库存带出来，并给颜色，提示用户删除或修改那一条记录
		 * */
		var enIdFilter = $filter('EncryptionFilter');
		$scope.cartExist = true;
		$scope.isDataLoading = false;
		$scope.errors = null;
		$scope.goodsInfo = [];
		$scope.carts = [];
		$scope.cartView = [];
		$scope.all = {};
		$scope.isMore = false;
		$scope.moneyInfo = {};
		//价格的统计信息
		$scope.totalMoneyInfo = {};
		$scope.totalMoneyInfo.RMBTotal = 0;
		$scope.totalMoneyInfo.USDTotal = 0;
		//现在只取一个币别，所以之用一个total存值
		$scope.totalMoneyInfo.total = 0;
		$scope.totalMoneyInfo.countBT = 0;
		//散乱的信息可以放在basic中
		$scope.basic = {};
		$scope.basic.status = '';
		$scope.newData = [];
		$scope.product = {};
		$scope.pageInfo = {};
		$scope.pageInfo.page = 1;
		$scope.pageInfo.count = 10;
		$scope.cartIsEmpty = true;
		$scope.countByPage = 0;
		$scope.cartMap = [];
		/**
		 * 全选状态信息
		 */
		$scope.isChooseAll = false;

		$scope.loadData = function (){
			Cart.getPageInfo($scope.pageInfo, function(data) {
				$scope.isDataLoading = false;
				$scope.total = data.totalElements;
				$scope.pageNum = data.totalPages;

				angular.forEach(data.content, function (cart) {
					cart.buyCurrency = cart.currencyName.indexOf("RMB") > -1 ? "RMB" : "USD";
					cart.isSelect = false;
					//计算分段和统计一下价格
					$scope.getPrice(cart);

					//便于后期循环
					$scope.carts.push(cart);
					$scope.disabledAddAndSub(cart);
					$scope.countByPage += 1;
					var isContain = false;
					for (var i = 0; i < $scope.cartMap.length; i++) {
						if(angular.equals($scope.cartMap[i].name, cart.storeName)) {
							$scope.cartMap[i].arr.push(cart);
							isContain = true;
						}
					}
					if(!isContain) {
						var obj = {};
						obj.name = cart.storeName;
						obj.arr = [];
						obj.arr.push(cart);
						$scope.cartMap.push(obj);
					}
				});
				$scope.cartIsEmpty = !$scope.carts.length ? true : false;
				//设置全选的复选框
				$scope.isChooseAll = $scope.isAllSelect($scope.carts);

				//设置店铺复选框的状态
				angular.forEach($scope.cartMap, function (store) {
					$scope.selectedStore[store.name] = $scope.isAllSelect(store.arr);
				});
			},function() {
				toaster.pop('error', "提示", "获取购物车信息失败，请刷新页面");
			});
		};

		$scope.loadData();

		/**
		 * 滚动加载数据
		 */
		$scope.scrollLoadData = function () {
			if($scope.pageInfo.page < $scope.pageNum) {
				if(!$scope.isDataLoading) {
					$scope.isDataLoading = true;
					$scope.pageInfo.page++;
					$scope.loadData();
				}
			}
		};

		// 添加按钮，每次加1
		$scope.add = function(cart) {
			if(cart.status == 1) {
				toaster.pop('info', '提示', '该商品已经失效，请选择其他商品');
				return ;
			}
			var num = Number(NumberService.add(cart.number, cart.goods.perQty));
			if(num > cart.goods.reserve) {
				// cart.number = cart.number - cart.goods.minPackQty;
				toaster.pop('info','提示','库存不足');
				return ;
			}else {
				cart.number = num;
			}
			$scope.disabledAddAndSub(cart);
			$scope.getPrice(cart);
			//计算总价格
			$scope.calculateAmount($scope.selectedStoreCarts);
		};

		// 减少按钮，每次减minPackQty
		$scope.reduce = function(cart){
			if(cart.status == 1) {
				toaster.pop('info', '提示', '该商品已经失效，请选择其他商品');
				return ;
			}
			var num = NumberService.sub(cart.number, cart.goods.perQty);
			if(Number(num) < cart.goods.minBuyQty) {
				toaster.pop('info','提示','该商品最少购买' + cart.goods.minBuyQty + "件");
				cart.number = cart.goods.minBuyQty;
			}else {
				cart.number = num;
			}
			$scope.disabledAddAndSub(cart);
			$scope.getPrice(cart);
			//计算总价格
			$scope.calculateAmount($scope.selectedStoreCarts);
		};

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
		};

		$scope.closeTable = function() {
			console.log('0kds');
		};
		// //监听点击的位置,隐藏价格梯度的信息
		// document.onclick = function(event) {
		// 	$scope.$apply(function () {
		// 		angular.forEach($scope.carts, function (cart) {
		// 			if(cart.id != event.srcElement.name) {
		// 				cart.display = 'none';
		// 			}
		// 		});
		// 	});
		// }

		//查看价格分段。
		$scope.togglePrice = function (cart) {
			cart.display = cart.display == 'block' ? 'none' : 'block';
		};
		// 统计已勾选批次
		var creatSelectArr = function(){
			var arr = [];
			angular.forEach($scope.carts, function(cart) {
				if (cart.isSelect) {
					arr.push(cart);
				}
			});
			return arr;
		};

		//选择币别
		$scope.selectCurr = function(cart, crName) {
			if(cart.isSelect) {
				toaster.pop('warning', '您已经选中了该批次，如果需要切换币别，请先取消勾选。');
				return;
			}
			if(cart.currencyName.indexOf(crName) > -1) {
				cart.buyCurrency = crName;
			}
			//计算分段和统计一下价格
			$scope.getPrice(cart);
		};

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
		$scope.blurNum = function (c) {
			// c.inputError = 0;
			// c.noInputError = 0;
			if(isNaN(c.number)) {
				toaster.pop('info','提示','请输入数字');
				c.number = c.goods.minBuyQty;
			}
			c.number = Number(c.number);
			if (c.number < c.goods.minBuyQty || !c.number) {
				// toaster.pop("info", "提示", "该商品最少购买" + c.goods.minBuyQty + "件");
				if (c.goods.breakUp) {
					toaster.pop('info','提示','最小起订量为' + c.goods.minBuyQty);
					// c.noInputError = 1;
					c.number = c.goods.minBuyQty;
					// $timeout(function () {
					// 	c.noInputError = 1;
					// }, 3000);
				} else {
					// c.inputError = 1;
					toaster.pop('info','提示','最小起订量为' + c.goods.minBuyQty);
					c.number = c.goods.minBuyQty;
					// $timeout(function () {
					// 	c.inputError = 0;
					// }, 3000);
				}
			}else if(c.number > c.goods.reserve){
				// toaster.pop("info", "提示", "库存不足");
				if(c.goods.breakUp) {
					toaster.pop("info", "提示", "库存不足");
					// c.noInputError = 2;
					c.number = c.goods.reserve;
					// $timeout(function () {
					// 	c.noInputError = 0;
					// }, 3000);
				}else {
					// c.inputError = 2;
					toaster.pop("info", "提示", "库存不足")
					c.number = Number(NumberService.sub(c.goods.reserve, c.goods.reserve % c.goods.minPackQty));
					// $timeout(function () {
					// 	c.inputError = 0;
					// }, 3000);
				}
				if(Number(c.number) < Number(c.goods.minBuyQty)) {
					c.number = c.goods.minBuyQty;
				}
			}else {
				if(!c.goods.breakUp) {
					var remander = c.number % c.goods.minPackQty;
					if(remander != 0) {
						// c.inputError = 3;
						toaster.pop("info", "提示", "不支持拆包且包装量为" + c.goods.minPackQty);
						c.number = NumberService.sub(c.number, c.number % c.goods.minPackQty);
						c.number = NumberService.add(c.number, c.goods.minPackQty);
						// $timeout(function () {
						// 	c.inputError = 0;
						// }, 3000);
					}
					if(Number(c.number) > Number(c.goods.reserve)) {
						c.number = NumberService.sub(c.goods.reserve, c.goods.reserve % c.goods.minPackQty);
					}
				}
			}

			$scope.disabledAddAndSub(c);
			$scope.getPrice(c);
			//计算总金额，统计购买器件数
			$scope.calculateAmount($scope.selectedStoreCarts);
		};

		/**
		 * 是否失效- +
		 */
		$scope.disabledAddAndSub = function(c) {
			if((Number(c.number) - Number(c.goods.perQty)) < Number(c.goods.minBuyQty)) {
				c.minusDisabled = true;
			}else {
				c.minusDisabled = false;
			}
			if(Number(c.number) + Number(c.goods.perQty) > Number(c.goods.reserve)) {
				c.addDisabled = true;
			}else {
				c.addDisabled = false;
			}
		};

		// 数量修改提醒
		$scope.maxNum = function (c) {
			if (c.number > c.goods.reserve) {
				toaster.pop("warning","警告","输入数量无法超过该商品最大库存，请重新确认");
				c.number = c.goods.reserve;
			} else if (c.number < 0) {
				toaster.pop("error","错误","输入数量有误，请重新确认");
				c.number = c.goods.minBuyQty;
			}
		};

		//判断购物车是否为空
		Cart.getCount({}, function(data){
			$rootScope.countCart = data.count;
			if ($rootScope.countCart == 0) {
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
		};

		//是否选择批次
		$scope.check = function(cart) {
			if(cart.status == 1) {
				cart.isSelect = false;
				toaster.pop('info', '该批次已经失效，请选择其他商品购买');
				return ;
			}
			if(cart.isSelect) {
				if($scope.totalMoneyInfo.countBT == 0) {
					$scope.totalMoneyInfo.currencyName = cart.buyCurrency
				}else {
					if($scope.totalMoneyInfo.currencyName != cart.buyCurrency) {
						cart.isSelect = false;
						toaster.pop('info', '选择的币别不一致，请重新选择');
						return ;
					}
				}
                $scope.totalMoneyInfo.countBT++;
                $scope.selectedStoreCarts.push(cart);
			}else {//取消勾选
				$scope.totalMoneyInfo.countBT--;
				$scope.selectedStoreCarts = $scope.selectedStoreCarts.filter(function(item) {
					return item.id != cart.id;
				});
			}
			//设置全选的复选框
			$scope.isChooseAll = $scope.isAllSelect($scope.carts);

			//设置店铺复选框的状态
			angular.forEach($scope.cartMap, function (store) {
				if(angular.equals(store.name, cart.storeName)) {
					$scope.selectedStore[cart.storeName] = $scope.isAllSelect(store.arr);
				}
			});
			//计算结果。
			$scope.calculateAmount($scope.selectedStoreCarts);
		};

		// 物品分段单价获取
		$scope.getPrice = function(c) {
			for(var i = 0; i < c.goods.prices.length; i++) {
				if(c.goods.prices[i].start <= c.number && c.number <= c.goods.prices[i].end) {
					c.rMBPrice = c.goods.prices[i].rMBPrice;
					c.uSDPrice = c.goods.prices[i].uSDPrice;
					//计算包含的总价，不管选择的币别。
					if(c.goods.currencyName.indexOf("RMB") > -1) {
						c.RMBCount = NumberService.mul(c.rMBPrice, c.number);
					}
					if(c.goods.currencyName.indexOf("USD") > -1) {
						c.USDCount = NumberService.mul(c.uSDPrice, c.number);
					}
					//添加相应的数据。
					if(c.buyCurrency.indexOf("RMB") > -1 ) {
						c.price = "￥"+ $filter('formateNumber')(c.rMBPrice, 6);
					}else {
						c.price = "$" + $filter('formateNumber')(c.uSDPrice, 6);
					}
					return;
				}
			}
		};

        // 清空失效产品
        $scope.deleteInvalid = function(){
			var arr = [];
            angular.forEach($scope.carts, function(cart){
                if(cart.status == 1){
                    arr.push(cart.id);
                }
            });
            if(arr.length <= 0) {
                toaster.pop('warning', '提示', '购物车内目前没有失效的产品');
                return ;
            }
            var ids = angular.toJson(arr);
            $modal.open({
                templateUrl : 'static/view/common/modal/invalid_delete_modal.html',
                controller : 'cartDeleteCtrl',
                size : 'md',
                resolve : {
                    description : function () {
                        return '是否删除购物车内的无效商品';
                    },
                    ids : function () {
                        return ids;
                    }
                }
            }).result.then(function () {
				afterDeleteRefreshInfo(arr);
			}, function () {
            });
        };

		var afterDeleteRefreshInfo = function (arr) {
			if(arr.length < 1) {
				return ;
			}
			$rootScope.countCart = $rootScope.countCart - arr.length;

			//更新选中的购物车信息
			$scope.selectedStoreCarts = $scope.arrayFilterId($scope.selectedStoreCarts, arr);
			//更新购物车信息
			$scope.carts = $scope.arrayFilterId($scope.carts, arr);
			//判断是否全部删除，如果全部删除，就将全选置为取消状态。
			if($scope.carts.length == 0) {
				$scope.isChooseAll = false;
				$scope.cartIsEmpty = true;
			}

			//更新map中购物车信息
			var deleteStoreName = [];
			angular.forEach($scope.cartMap, function(store) {
				if(store.arr && store.arr.length > 0) {
					store.arr = $scope.arrayFilterId(store.arr, arr);
					if(!store.arr || !store.arr.length || store.arr.length == 0) {
						deleteStoreName.push(store.name);
					}
				}
			});

			//删除$scope.cartMap多余的部分。
			angular.forEach(deleteStoreName, function(storeName) {
				$scope.cartMap = $scope.cartMap.filter(function (store) {
					return store.name != storeName;
				});
			});

			$scope.pageInfo.count = arr.length;
			$scope.scrollLoadData();
			$scope.pageInfo.count = 10;

			//计算总金额
			$scope.calculateAmount($scope.selectedStoreCarts);
		}

        $scope.deleteById = function(id){
            var arr = [];
            if(id != null){
                arr.push(id);
            }else {
                angular.forEach($scope.carts, function(cart){
                    if(cart.isSelect){
                        arr.push(cart.id);
                    }
                });
            }
            if(arr.length <= 0) {
				toaster.pop('warning', '提示', '请选择需要删除的商品');
				return ;
			}
            var ids = angular.toJson(arr);
			$modal.open({
				templateUrl : 'static/view/common/modal/delete_modal.html',
				controller : 'cartDeleteCtrl',
				size : 'md',
				resolve : {
					description : function () {
						return '是否删除此商品';
					},
                    ids : function () {
                        return ids;
                    }
				}
			}).result.then(function () {
				afterDeleteRefreshInfo(arr);
			}, function () {
			});
		};

		/**
		 * 过滤数组的方法
		 * @param array 需要过滤的数组
		 * @param ids 传入的id
		 * @returns {*}
		 */
		$scope.arrayFilterId = function(array, ids) {
			if(!ids || !ids.length || ids.length == 0) {
				return array;
			}
			return array.filter(function(item) {
				var contain = false;
				angular.forEach(ids, function(id) {
					if(id == item.id) {
						contain = true;
					}
				});
				return !contain;
			});
        };
        //判断是空对象
		$scope.isNullObject = function(obj) {
			var isObject = true;
			for(var k in obj) {
				isObject = false;
			}
			return isObject;
		};

		/**
		 * 根据店铺获取购物车的信息，如果店铺名为空，则获取所有购物车信息
		 *
		 * @param storeName		店铺名称
		 */
		var getCartsByStoreName = function (storeName) {
			if (storeName && storeName != '') {
				for(var i = 0; i < $scope.cartMap.length; i++){
					if(angular.equals($scope.cartMap[i].name, storeName)) {
						return $scope.cartMap[i].arr;
					}
				}
			} else {
				return $scope.carts;
			}
		};


		/**
		 * 控制联系卖家的模态框
		 * @param value
		 */
		$scope.showContact = function (value) {
			value.contactSeller = !value.contactSeller;
			angular.forEach($scope.carts, function (cart) {
				if(cart.id != value.id) {
					cart.contactSeller = false;
				};
			});
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
			if(!elementName) {
				return ;
			}
			$scope.$apply(function () {
				angular.forEach($scope.carts, function (cart) {
					if(cart.id != event.srcElement.name) {
						cart.display = 'none';
					}
				});
				for(var i = 0; i < $scope.carts.length; i++) {
					var isThisTag = false;
					if(elementName && $scope.carts[i].id == elementName) {
						isThisTag = true;
					}
					var parentEle = element.parentElement;
					if(!isThisTag) {
						while (parentEle && parentEle.tagName && parentEle.tagName != 'BODY') {
							var parentElementName =  parentEle.getAttribute("name");
							if(parentElementName && $scope.carts[i].id == parentElementName) {
								isThisTag = true;
							}
							parentEle = parentEle.parentElement;
						}
					}
					if(!isThisTag) {
						$scope.carts[i].contactSeller = false;
					}
				}
			});
		};



		/**********************************************************************
		 * 选中操作
		 **********************************************************************/

		/**
		 * 全选操作
		 */
		$scope.chooseAllCarts = function () {
			$scope.isChooseAll = !$scope.isChooseAll;
			$scope.setAllCartCheck($scope.isChooseAll);
			$scope.calculateAmount($scope.carts);
		};

		//遍历所有的购物车信息，设置勾选状态
		$scope.setAllCartCheck = function(checked) {
			$scope.selectedStoreCarts = [];
			angular.forEach($scope.cartMap, function(store) {
					if(store.arr && store.arr.length > 0) {
						var storeChecked = false;
						angular.forEach(store.arr, function (cart) {
							if(cart.status != 1 && checked) {//购物车的信息是否有效【是否下架】
								cart.isSelect = checked;
								storeChecked = true;
								$scope.selectedStoreCarts.push(cart);
							}else {
								cart.isSelect = false;
							}
						});
						if(storeChecked) {
							$scope.selectedStore[store.name] = checked;//店铺的复选框也需要同步
						}else {
							$scope.selectedStore[store.name] = false;//如果没有执行过storeChecked = true,则该店铺代表所有的都没有勾选
						}
					}

			});
		};

		//检查是否所有的状态都已经选中或者取消了。
		$scope.isAllSelect = function (carts) {
			var isAllChecked = true;//假定都选中
			var isAlldisabled = true;
			for(var i = 0; i < carts.length; i++) {
				var cart = carts[i];
				if(cart.status != 1) {
					isAlldisabled = false;
					if(!cart.isSelect) {
						isAllChecked = false;
					}
				}
			}
			return !isAlldisabled&&isAllChecked;
        };
        /**
		 * 店铺选中状态信息
		 */
		$scope.selectedStore = {};

		/**
		 * 存放选中店铺的购物车信息
		 */
		$scope.selectedStoreCarts = [];

		/**
		 * 选中某店铺所有购物车
		 *
		 * @param storeName		店铺名称
		 */
		$scope.chooseStoreCarts = function (storeName) {
			if (storeName && storeName != '') {
				var selectedCarts = getCartsByStoreName(storeName);
				//过滤本店铺的所有已选中购物车的信息
				$scope.selectedStoreCarts = $scope.selectedStoreCarts.filter(function (item) {
					return item.storeName !=  storeName;
				});
				var childCartCanSelected = false;
				angular.forEach(selectedCarts, function (cart) {
					if ($scope.selectedStore[storeName]&& cart.status != 1) {
						$scope.selectedStoreCarts.push(cart);
						cart.isSelect = true;
						childCartCanSelected = true;
					}else {
						cart.isSelect = false;
					}
				});
				//childCartCanSelected 需要与 $scope.selectedStore[storeName] 值一样
				if($scope.selectedStore[storeName] && !childCartCanSelected) {
					$scope.selectedStore[storeName] = childCartCanSelected;
					toaster.pop('warning', '提示', '当前店铺没有可勾选的商品');
				}
				$scope.isChooseAll = $scope.isAllSelect($scope.carts);
				$scope.calculateAmount($scope.selectedStoreCarts);
			}
		};

		/**
		 * 计算总金额
		 */
		$scope.calculateAmount = function(carts) {
			// 初始化
			$scope.totalMoneyInfo.countBT = 0;
			$scope.totalMoneyInfo.total = 0.0;
			$scope.totalMoneyInfo.currencyName = null;
			if(carts.length > 0) {
				$scope.totalMoneyInfo.currencyName = carts[0].buyCurrency
			}else {
				return ;
			}

			angular.forEach(carts, function (cart) {
				if (cart.isSelect && $scope.totalMoneyInfo.currencyName != cart.buyCurrency) {
					//如果发现币别不一致，则需要取消选择。
					cart.isSelect = false;
					$scope.selectedStore[cart.storeName] =false;
				}
				if (cart.isSelect) {
					$scope.totalMoneyInfo.countBT++;
					if($scope.totalMoneyInfo.currencyName == "RMB" ) {
						$scope.totalMoneyInfo.total = NumberService.add(NumberService.mul(cart.rMBPrice, cart.number), $scope.totalMoneyInfo.total);
					}else {
						$scope.totalMoneyInfo.total =NumberService.add(NumberService.mul(cart.uSDPrice, cart.number), $scope.totalMoneyInfo.total);
					}
				}
			});
			$scope.totalMoneyInfo.total = Number(NumberService.toCeil($scope.totalMoneyInfo.total, 2));

		};

		/**********************************************************************
		 * 分页功能
		 **********************************************************************/

		$scope.toPage = $scope.pageInfo.page;

		$scope.jumpToPage = function (number) {
			if (!number || number == '' || number < 1) {
				$scope.pageInfo.page = 1;
			} else if(number <= $scope.pageNum){
				$scope.pageInfo.page = number;
			} else {
				$scope.pageInfo.page = $scope.pageNum;
			}
			$scope.toPage = $scope.pageInfo.page;
			$scope.loadData();
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
				obj.storeid = cg.storeUuid;
				obj.minPackQty = cg.minPackQty;
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
			});
			value.isSelectAll = false;
			return tip;
		};

		$scope.submitOrder = function(){
			var result = creatObjOrderDetail();
			if(result.arrOD.length == 0) {
				toaster.pop('info', '您还没有选择任何产品');
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
			Order.saveByGroup({}, jsonOrderDetails, function(result){
				if(result.code == 1) {
					if(result.message) {
						toaster.pop('info', result.message);
					}
					$state.go('order_pay', {orderid :  enIdFilter(result.data.orderid)});
				}else if(result.code == 7){
					toaster.pop('info', '提示', "选中的购物车信息已经失效，将为您刷新界面之后重新操作");
					$timeout(function () {
						window.location.reload();
					}, 1500);
				}else {
					toaster.pop('info', '提示', result.message);
				}
			}, function(res){
				toaster.pop('error', '警告', res.data);
			});

		};

		// var getRecommendGoodsForUser = function (userUU, usedFor, pageable) {
		// 	// Recommendation.getRecommendationGoods({userUU:userUU, usedFor: usedFor, page: pageable.page, size: pageable.size}, function (data) {
		// 	// 	$scope.recommendGoods = data;
		// 	// }, function (error) {
		// 	// 	toaster.pop('error', '获取推荐产品失败', error);
		// 	// })
		// 	Recommendation.getRecommendationGoods({page: pageable.page, size: pageable.size}, function (data) {
		// 		$scope.recommendGoods = data.content;
		// 	}, function (error) {
		// 		toaster.pop('error', '获取推荐产品失败', error);
		// 	})
		// };
		// getRecommendGoodsForUser();

		var getRecommendComps = function (userUU, usedFor, pageable) {
			Recommendation.getRecommendComps({page: pageable.page, size: pageable.size}, function (data) {
				$scope.recommendComps = data.content;
			}, function (error) {
				toaster.pop('error', '获取推荐器件失败');
			})
		};
		// getRecommendComps(null, null, {page: 0, size: 12});
		/*相似产品*/
		$scope.similarOpen = function (cart) {
			angular.forEach($scope.carts, function (ca) {
				if(ca.id != cart.id) {
					ca.similarShow = false;
				}
			});
			cart.similarShow = !cart.similarShow;
			if(!cart.similarities || cart.similarities.length < 1 ) {
				Goods.getSimilarityPro({page : 1, size : 6, code : cart.code, batchCode : cart.batchCode}, function (data) {
					cart.similarities = data.data.content;
				}, function (error) {
					toaster.pop('error', '获取相似产品失败！'+ error.data);
				});
			}

		};
		// 移入收藏后删除购物车操作
		$scope.collectDelete = function(id){
			var arr = [];
			if(id != null){
				arr.push(id);
			}else {
				angular.forEach($scope.carts, function(cart){
					if(cart.isSelect){
						arr.push(cart.id);
					}
				});
			}
			var ids = angular.toJson(arr);
			Cart.deleteById({ids : ids}, function(data){
				$rootScope.countCart = $rootScope.countCart - arr.length;

				//更新选中的购物车信息
				$scope.selectedStoreCarts = $scope.arrayFilterId($scope.selectedStoreCarts, arr);
				//更新购物车信息
				$scope.carts = $scope.arrayFilterId($scope.carts, arr);
				//判断是否全部删除，如果全部删除，就将全选置为取消状态。
				if($scope.carts.length == 0) {
					$scope.isChooseAll = false;
					$scope.cartIsEmpty = true;
				}

				//更新map中购物车信息
				var deleteStoreName = [];
				angular.forEach($scope.cartMap, function(store) {
					if(store.arr && store.arr.length > 0) {
						store.arr = $scope.arrayFilterId(store.arr, arr)
						if(!store.arr || !store.arr.length || store.arr.length == 0) {
							deleteStoreName.push(store.name);
						}
					}
				});
				//删除$scope.cartMap多余的部分。
				angular.forEach(deleteStoreName, function(storeName) {
					$scope.cartMap = $scope.cartMap.filter(function (store) {
						return storeName != store.name;
					});
				});

				//计算总金额
				$scope.calculateAmount($scope.selectedStoreCarts);

            }, function (res) {
                toaster.pop('error', '系统错误', res.data);
            });


		};
		// 移入收藏
		$scope.collect = function(uuid, id) {
			if(uuid){
                ComponentActive.getSimpleInfoByUuid({uuid: uuid}, { }, function(data){
                    var obj = {'componentid': data.id, 'kind': 2};
                    collectionService.saveEntity({ }, obj, function(data) {
                        $scope.collectDelete(id);
                        toaster.pop('success', '收藏成功');
                    }, function(response) {
                        toaster.pop('error', response.data);
                    })
                });
			}else{
				var uuids = [];
				angular.forEach($scope.cartMap, function(store){
					angular.forEach(store.arr, function (data) {
						if(data.isSelect){
							uuids.push(data.uuid);
						}
					});
				});
				if (uuids.length == 0){
					toaster.pop('info', '你还未选择任何产品');
					return;
				}
                collectionService.saveStores({ }, uuids, function(response){
					if(response.data == "success"){
                        $scope.collectDelete();
                        toaster.pop('success', '收藏成功');
					}
				},function (response) {
                    toaster.pop('error', response.data);
                })
			}
		}


		// 直接购买或加入购物车
		$scope.addToCart = function(commodity, isBuy, number, currency) {
			if (!commodity || !number || number < 1 || !currency) {
				return;
			}
			if (commodity.reserve < commodity.minBuyQty) {
				toaster.pop('warning', '库存量已经不能满足最小起订量！');
				return;
			}
			if (!$rootScope.userInfo || !$rootScope.userInfo.userUU) {
				AuthenticationService.redirectSignin();
				return -1;
			}
			var cart = {
				uuid: commodity.uuid,
				batchCode: commodity.batchCode,
				number: number ? number : commodity.minBuyQty,
				currencyName: currency ? currency == 'RMB-USD' ? 'RMB' : currency : '',
				minPackQty : commodity.minPackQty,
				storeUuid : commodity.storeid
			};
			var goodsList = [];
			goodsList.push(cart);

			// 1、加入购物车
			// 2、更新购物车状态显示
			Cart.addOneCartRecord({}, cart, function (resp) {
				if (resp.success) {
					toaster.pop("success", '成功加入购物车');
					$rootScope.countCart++;
					$timeout(function () {
						$window.location.reload();
					}, 500);

				} else {
					toaster.pop("info", resp.message);
				}
			});
		}
	}]);

    /**
     * 删除的逻辑
     */
	app.register.controller('cartDeleteCtrl', ['$scope', 'description', 'Cart', '$modalInstance', 'toaster', 'ids', function ($scope, description, Cart, $modalInstance, toaster,ids) {

        $scope.confirmDelete = function () {
            Cart.deleteById({ids : ids}, function(data){
                toaster.pop('success', '成功删除');
                $modalInstance.close()
            }, function (res) {
                toaster.pop('error', '系统错误', res.data);
            });
        };

        $scope.confirmDeleteInvalid = function () {
            Cart.deleteById({ids : ids}, function(data){
                toaster.pop('success', '成功清除购物车内的无效产品');
                $modalInstance.close()
            }, function (res) {
                toaster.pop('error', '系统错误', res.data);
            });
        };

		$scope.cancleDelete = function () {
			$modalInstance.dismiss();
		}

	}]);

	// 定义滚动指令
	app.register.directive('whenScrolled', ['$window', '$document', function($window, $document) {
		return function(scope, elm, attr) {
			// 内层DIV的滚动加载
			var initTop = 0;
			var window = angular.element($window);
			var docu = angular.element($document);
			window.on('scroll', function () {
				var scrollTop = docu.scrollTop();
				if(scrollTop > initTop) { //向下滚动时
					if((scrollTop + window.height() > docu.height() - 330)) {
						scope.$apply(attr.whenScrolled);
					}
				}
				initTop = scrollTop;
			});
		};
	}]);
});
