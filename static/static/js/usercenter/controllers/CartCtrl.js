define([ 'app/app', 'jquery-summernote' ], function(app) {
	'use strict';
	app.register.controller('CartCtrl', ['$scope', 'toaster', '$modal', 'ngTableParams', 'BaseService', 'Cart', '$filter' , 'ComponentActive', '$location', 'Order', '$state', 'SessionService', function($scope, toaster, $modal, ngTableParams, BaseService, Cart, $filter ,ComponentActive, $location, Order, $state, SessionService) {
		BaseService.scrollBackToTop();
		
		/* TODO 
		 * 需要把批次的库存带出来，并给颜色，提示用户删除或修改那一条记录
		 * */
		var enIdFilter = $filter('EncryptionFilter');
		$scope.cartExist = true;
		$scope.errors = null;
		$scope.cart = [];
		$scope.all = {};
		$scope.isMore = false;
		$scope.moneyInfo = {};
		$scope.totalMoneyInfo = {};
		
		var page = 1;
		
		var loadData = function (page){
			Cart.getPageInfo({page : page}, function(data) {
				for ( var key in data) {
					if (key == "error") {
						$scope.errors = angular.copy(data.error);
						if (data.error.length != 0) {
							angular.forEach(data.error, function(cart) {
								toaster.pop('warning', '提示', cart.batchCode + ':此批次已下架，请您手动移除，并重新选购')
							})
						}
						delete data.error;
					} else if (key != "$promise" && key !="$resolved") {
						data[key].isSelectAll = false;
						data[key].collapsed = true;
					}
				}
				$scope.newCart = data;
				$scope.all.isSelectTotal = false;
				$scope.cart.push($scope.newCart);
			},function(response) {
				toaster.pop('error', "提示", "获取购物车信息失败，请刷新页面");
			});
		}
		
		loadData(page);
		
		// 加载更多购物车信息
		$scope.loadMore = function(){
			page += 1;
			if ($scope.countExist > page * 10) {
				$scope.isMore = true;
			} else {
				$scope.isMore = false;
			}
			loadData(page);
			cartIsSelect($scope.cart);
		}
		
		//判断购物车是否为空
		Cart.getCount({}, function(data){
			$scope.countExist = data.count;
			if ($scope.countExist > page * 10) {
				$scope.isMore = true;
			} else {
				$scope.isMore = false;
			}
			if ($scope.countExist == 0) {
				$scope.cartExist = false;
			} else {
				$scope.cartExist = true;
			}
		}, function(res){
			toaster.pop('error', '系统错误', '获取购物车失败' + res.data);
		});
		//加入购物车
//		$scope.addToCart = function(uuid, isBuy ,value){
//			//唤起此器件批次选择的模态框
//			var modalInstance = $modal.open({
//				templateUrl : 'static/view/prod/product_goodChoose_modal.html',  //指向上面创建的视图
//	            controller : 'GoodChooseCtrl',// 初始化模态范围
//	            size : 'lg', //大小配置
//	            resolve : {
//	            	uuid : function(){
//                    	//必须用 angular.copy深拷贝一份
//                        return angular.copy(uuid);
//                    },
//                    isBuy : function(){
//                    	//必须用 angular.copy深拷贝一份
//                        return angular.copy(isBuy);
//                    },
//                    value : function(){
//                    	if (null == value){
//                    		return {};
//                    	} else {
//                    		//如果value有值，必须用angular.cope深拷贝一份
//                    		return angular.copy(value);
//                    	}
//                    }
//                }
//	        });
//	        modalInstance.opened.then(function(){
//	        	
//	        });
//	        modalInstance.result.then(function(data){
//	        	//刷新界面
//	        	location.reload('product#/cart'); 
//	        }, function(reason){
//	        	
//	        });
//		};
		
		// 已选数量计算
		$scope.countNum = function(value) {
			var count = 0;
			angular.forEach(value, function(c) {
				if (c.isSelect) {
					count += c.number;
				}
			});
			return count;
		}
		
		//小计价格的计算
		$scope.count = function(value) {
			if(typeof(value) == 'object') {
				value.moneyInfo = {};
			}
			angular.forEach(value, function(c) {
				if (c.isSelect) {
					if(value.moneyInfo[c.currencyName]) {
						value.moneyInfo[c.currencyName] += (c.unitprice * c.number);
					}else {
						value.moneyInfo[c.currencyName] =  (c.unitprice * c.number);
					}
				}
			});
		};
		
		//现货小计
		$scope.countSpot = function(value){
			var count = 0;
			angular.forEach(value, function(c){
			if(c.isSelect){
					if(c.type == 1051){
						count += (c.unitprice * c.number);
					}
				}
			});
			return count;
		};
		
		//期货小计
		$scope.countFuture = function(value){
			var count = 0;
			angular.forEach(value, function(c){
			if(c.isSelect){
					if(c.type == 1052){
						count += (c.unitprice * c.number);
					}
				}
			});
			return count;
		};
		
		//单个删除购物车选购批次
		$scope.deleteBatch = function(batchCode){
			var arr = [];
			arr.push(batchCode);
			var batchCodes = angular.toJson(arr);
			Cart.deleteByBatchCode({}, batchCodes, function() {
				toaster.pop('success', '提示 ', '购物车信息删除成功');
				location.reload('product#/cart');
			}, function() {
				toaster.pop('error', '系统错误', '购物车信息删除失败');
			});
		}
		
		//批量删除购物车信息
		$scope.deleteBatches = function(){
			var arrOD = creatObjOrderDetail();
			if (arrOD.length == 0) {
				toaster.pop('error', '提示', '请选择购物车信息');
			} else {
				var batchCodeSet = [];
				angular.forEach(arrOD, function (a) {
					batchCodeSet.push(a.batchCode);
				});
				var batchCodes = angular.toJson(batchCodeSet);
				Cart.deleteByBatchCode({}, batchCodes, function() {
					toaster.pop('success', '提示 ', '购物车信息删除成功');
					location.reload('product#/cart'); 
				}, function() {
					toaster.pop('error', '系统错误', '购物车信息删除失败');
				});
			}
		}
		
		// 检测全选框状态
		$scope.checkSelect = function(value, cartGroup) {
			cartGroup.isSelect = !cartGroup.isSelect;
			$scope.valueIsSelect(value);
			cartIsSelect($scope.cart);
			$scope.count(value);
			$scope.getTotal();
		}
		
		// 全部器件全选按钮状态
		var cartIsSelect = function(cart) {
			// TODO
			var b = true;
			angular.forEach(cart, function(code) {
				angular.forEach(code, function(value) {
					if (typeof(value.collapsed) != "undefined") {
						angular.forEach(value, function(cartGroup) {
							if (cartGroup.batchCode) {
								(typeof(cartGroup.isSelect) == "undefined") ? false : cartGroup.isSelect;
								b = b && cartGroup.isSelect;
							}
						});
					}
				});
			});
			$scope.all.isSelectTotal = b;
		}
		
		// 全部器件全选事件
		$scope.checkTotal = function(){
			$scope.all.isSelectTotal = !$scope.all.isSelectTotal;
			angular.forEach($scope.cart, function(code) {
				angular.forEach(code, function(value) {
					if (typeof(value.collapsed) != "undefined") {
						value.isSelectAll = $scope.all.isSelectTotal;
					}
					angular.forEach(value, function(cartGroup){
						if (cartGroup.batchCode) {
							cartGroup.isSelect = $scope.all.isSelectTotal;
						}
					});
				});
			});
			$scope.getTotal();
		};
		
		// 单个器件全选按钮状态
		$scope.valueIsSelect = function(value) {
			var b = true;
			angular.forEach(value, function(cartGroup){
				b = b && cartGroup.isSelect;
			});
			value.isSelectAll = b;
		};
		
		// 单个器件全选事件
		$scope.checkOrder = function(value){
			value.isSelectAll = !value.isSelectAll;
			angular.forEach(value, function(cartGroup){
				cartGroup.isSelect = value.isSelectAll;
			})
			cartIsSelect($scope.cart);
			$scope.count(value);
			$scope.getTotal();
		};
		
		//判断是空对象
		$scope.isNullObject = function(obj) {
			var isObject = true;
			for(var k in obj) {
				isObject = false;
			}
			return isObject;
		}
		
		// 统计已勾选批次
		var creatSelectArr = function(cart){
			var arr = [];
			angular.forEach(cart, function(code) {
				angular.forEach(code, function(value) {
					angular.forEach(value, function(cartGroup) {
						if (cartGroup.isSelect) {
							arr.push(cartGroup);
						}
					});
					$scope.count(value);
				});
				
			});
			return arr;
		};
		
		// 总计已选数量
		$scope.getChoose = function() {
			var count = 0;
			var arr = creatSelectArr($scope.cart);
			angular.forEach(arr, function(cartGroup){
				count += cartGroup.number;
			});
			return count;
		}
		
		
		// 总计已选金额
		$scope.getTotal = function() {
			$scope.totalMoneyInfo = {};
			var arr = creatSelectArr($scope.cart);
			angular.forEach(arr, function(cartGroup){
				if($scope.totalMoneyInfo[cartGroup.currencyName]) {
					$scope.totalMoneyInfo[cartGroup.currencyName] += (cartGroup.unitprice * cartGroup.number);
				}else {
					$scope.totalMoneyInfo[cartGroup.currencyName] = cartGroup.unitprice * cartGroup.number
				}
			});
		};
		
		//装载orderDetail对象数组
		var creatObjOrderDetail = function(){
			var arr = creatSelectArr($scope.cart);
			var arrOD = [];
			angular.forEach(arr, function(cg){
				var obj = {};
				obj.batchCode = cg.batchCode;
				obj.number = cg.number;
				obj.taxes = cg.taxes;
				arrOD.push(obj);	
			});
			return arrOD;
		};
		
		// 判断批次是否有效
		$scope.checkBatchCode = function(cartGroup,value) {
			var tip = true;
			angular.forEach($scope.errors, function(data) {
				console.log($scope.errors);
				if (cartGroup.batchCode == data.batchCode) {
					tip = false;
					cartGroup.isSelect = false;
				}
			})
			value.isSelectAll = false;
			return tip;
		};
		
		$scope.submitOrder = function(){
			var arrOD = creatObjOrderDetail();
			if(arrOD.length == 0) {
				toaster.pop('info', '请勾选要生成订单的批次');
				return ;
			}
			var jsonOrderDetails = angular.toJson(arrOD);
			Order.saveByGroup({}, jsonOrderDetails, function(data){
				//将已生成订单的批次号 在购物车中对应的信息删除
				var batchCodeSet = [];
				angular.forEach(arrOD, function (a) {
					batchCodeSet.push(a.batchCode);
				});
				var batchCodes = angular.toJson(batchCodeSet);
				Cart.deleteByBatchCode({}, batchCodes, function() {
					toaster.pop('success', '提示 ', '您购物车对应信息已删除');
				}, function() {
					toaster.pop('error', '系统错误', '购物车对应信息删除失败');
				});
				toaster.pop('success', '成功', '订单生成成功。请您确认订单并付款');
				var orderurl = "";
				if(data.length>1) {//如果生成了多张订单（代表存在不同的币别），就跳转到待确认的订单列表
					angular.forEach(data,function(order) {
						orderurl = orderurl + order.orderid + ",";
					})
					toaster.pop('success', '订单号', orderurl);
					SessionService.set('todoState', 'tobeconfirmed');
					$state.go('myOrder_todo');
				}else {
					window.location.replace('products#/orderEnsure/'+ enIdFilter(data[0].orderid));
				}
			}, function(res){
				toaster.pop('error', '警告', res.data);
			});
			
		};
	}]);
	
});