define([ 'app/app' ], function(app) {
	'use strict';

	app.controller('GoodsPickUpCtrl', ['$scope', '$rootScope', '$filter', 'AuthenticationService', 'BaseService', 'toaster', 'Cart', 'Order', 'SessionService', function ($scope, $rootScope, $filter, AuthenticationService, BaseService, toaster, Cart, Order, SessionService) {
		var enIdFilter = $filter('EncryptionFilter');
		/*$scope.componentTableParams = new ngTableParams({
		 page : 1,
		 count : 10
		 }, {
		 total : 0,
		 getData : function($defer, params) {
		 $scope.paginationParams = params;
		 var pageParams = params.url();
		 var param = BaseService.parseParams(pageParams);
		 if($scope.kindId) {
		 pageParams.filter = {kindid: parseInt($scope.$parent.kindId)};
		 }
		 param.keyword = $scope.$parent.keyword;
		 param.original = $scope.$parent.original;
		 Goods.findGoodsByKeyword(param, function (data) {
		 $scope.components = data.content;
		 $defer.resolve(data.content);
		 params.total(data.totalElements);
		 }, function () {
		 toaster.pop('error', '获取信息失败');
		 })
		 }
		 });

		 $scope.$parent.setComponentTableParams($scope.componentTableParams);

		 $scope.toggle = function(compGoods) {
		 if(compGoods.toggle || compGoods.prices.length < 2) {
		 compGoods.toggle = 0;
		 }else {
		 compGoods.toggle = 1;
		 }
		 };

		 //免费申请样品
		 $scope.applysample = function(compGoods) {
		 if(!$rootScope.userInfo || !$rootScope.userInfo.userUU) {
		 AuthenticationService.redirectSignin();
		 return;
		 }
		 //首先判断是否已送样
		 Goods.isSample({id: compGoods.goId}, {}, function(data){
		 if(data.id) {
		 window.open("product#/proofings/" + enIdFilter(compGoods.batchCode));
		 }else {
		 toaster.pop('info', '该批次已申请样品', '请勿重复申请');
		 }
		 }, function(){
		 toaster.pop('error', '系统异常', '产品现货批次数据加载失败');
		 });
		 };

		 // 展开或隐藏分段价格
		 $scope.showPrices = function(detail, currency) {
		 if(currency === 'RMB') {
		 detail.$pricesShowRmb = !detail.$pricesShowRmb;
		 }else if(currency === 'USD') {
		 detail.$pricesShowUsd = !detail.$pricesShowUsd;
		 }

		 };

		 // 获取商品是否加入购物车状态信息
		 var getCarts = function() {
		 $scope.flag = {};
		 if($rootScope.userInfo) {
		 Cart.getCarts({}, function(data) {
		 angular.forEach(data,function(cart){
		 $scope.flag[cart.batchCode] = true;
		 });
		 });
		 }

		 };

		 // 直接购买或加入购物车
		 $scope.addToCart = function(goods, isBuy){
		 if(!$rootScope.userInfo || !$rootScope.userInfo.userUU) {
		 AuthenticationService.redirectSignin();
		 return;
		 }
		 var a = {};
		 a.uuid = goods.uuid;
		 //TODO 先设置为点击加入购物车加入最小起订量，方便修改页面
		 a.number = goods.minBuyQty;
		 a.batchCode = goods.batchCode;
		 a.taxes = goods.taxes;
		 var goodsList = [];
		 goodsList.push(a);
		 SessionService.set("buyNow", false);
		 if(isBuy){// 1、如果是立即购买，跳转订单确认页面
		 if(a.number > 0) {
		 var newWindow = window.open('product#/cart');
		 Order.buyNow({}, goodsList, function(data){
		 var orderids = [];
		 angular.forEach(data, function(order) {
		 orderids.push(order.orderid );
		 });
		 // 控制订单确认页，直接购买不显示进度条
		 SessionService.set("buyNow", true);
		 newWindow.location.href = 'products#/orderEnsure/'+ enIdFilter(data.orderid);
		 // toaster.pop('success', '成功', '订单生成成功，订单号为【' + orderids.join(',') + '】。请您确认订单并付款');
		 }, function(res){
		 newWindow.close();
		 toaster.pop('error', '警告', res.data);
		 });
		 }else {
		 toaster.pop('warning', '提示', '该商品库存为0，请等待上货或咨询客服');
		 }
		 } else {// 2、如果是加入购物车，组装cart对象，提交
		 if (a.number > 0) {
		 Cart.save({uuid: a.uuid}, a, function(){
		 toaster.pop('success', '保存成功', '添加购物车成功');
		 Cart.getCount({}, function(data){
		 $rootScope.countCart = data.count;
		 }, function(res){
		 });
		 // 每次修改购物车信息之后，都获取当前状态
		 getCarts();
		 }, function(res){
		 toaster.pop('error', '警告', res.data);
		 getCarts();
		 });
		 } else {
		 toaster.pop('warning', '提示', '该商品库存为0，请等待上货或咨询客服');
		 }
		 }
		 };

		 $scope.downloadpdf = function(attach) {
		 if(!$rootScope.userInfo || !$rootScope.userInfo.userUU) {
		 AuthenticationService.redirectSignin();
		 return;
		 }else {
		 window.open(attach);
		 }
		 }

		 // 删除购物车对应商品
		 $scope.deleteFromCart = function(batchCode) {
		 var arr = [];
		 arr.push(batchCode);
		 var batchCodes = angular.toJson(arr);
		 Cart.deleteByBatchCode(batchCodes,function(){
		 toaster.pop('info', '取消成功', '撤销商品成功');
		 Cart.getCount({}, function(data){
		 $rootScope.countCart = data.count;
		 }, function(res){
		 });

		 // 每次修改购物车信息之后，都获取当前状态
		 getCarts();
		 }, function(){
		 toaster.pop('error', '取消失败', '商品已从购物车删除，请重新选择');
		 getCarts();
		 });
		 };*/

		$scope.historyAddCart = function(history){
            $scope.addCart(history).then(function (data) {
                $scope.addToCart(data, false, data.minBuyQty, data.currencyName);
            }, function (error) {
            });
        }

		// 直接购买或加入购物车
		$scope.addToCart = function(commodity, isBuy, number, currency){
			if(!commodity || !number || number < 1 || !currency) {
                return ;
            }
            if(commodity.reserve < commodity.minBuyQty) {
                toaster.pop('warning', '库存量已经不能满足最小起订量！');
                return ;
            }
			if(!$rootScope.userInfo || !$rootScope.userInfo.userUU) {
				AuthenticationService.redirectSignin();
				return -1;
			}
			var rootPath = BaseService.getRootPath();
			var cart = {
				uuid : commodity.uuid,
				batchCode : commodity.batchCode,
				number : number ? number : commodity.minBuyQty,
				currencyName : currency ? currency == 'RMB-USD' ? 'RMB' :  currency : '',
				storeid : commodity.storeid,
				minPackQty : commodity.minPackQty
			};
			var goodsList = [];
			goodsList.push(cart);
			if (isBuy) {
				if(cart.number > 0) {
					var newWidow = window.open(rootPath + '/product#/cart');
					// 1、生成订单
					Order.buyNowInStore({}, goodsList, function(data){
						if(data.message) {
							toaster.pop('info', data.message);
						}
						// 控制订单确认页，直接购买不显示进度条
						SessionService.set("buyNow", true);
						// 2、跳转到订单确认页面，进行付款操作
						newWidow.location.href = rootPath + '/user#/order/pay/'+ enIdFilter(data.data.orderid);
					}, function(res){
						newWidow.close();
						toaster.pop('error', '警告', res.data);
					});
				}else {
					toaster.pop('warning', '提示', '该商品库存为0，请等待上货或咨询客服');
				}
			} else {
				// 1、加入购物车
				// 2、更新购物车状态显示
				cart.storeUuid = commodity.storeid;
				Cart.addOneCartRecord({}, cart, function (resp) {
					if (resp.success) {
						Cart.getCount({}, function(data){
							$rootScope.countCart = data.count;
						}, function(res){
						});
						if(resp.message) {
							toaster.pop("info", "已成功加入购物车，" + resp.message);
						}else {
							toaster.pop("info", "商品加入购物车成功");
						}
					} else {
						toaster.pop("info", resp.message);
					}
				});
			}
		};
	}]);

});
