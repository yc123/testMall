define([ 'angularAMD', 'common/services', 'common/directives', 'common/query/brand', 'common/query/kind', 'common/query/property',  'common/query/component', 'common/query/goods', 'common/query/cart', 'common/query/order', 'common/query/address', 'common/query/property', 'common/query/kindAdvice', 'common/query/propertyAdvice', 'common/query/urlencryption' ,'ui.router', 'ui-bootstrap', 'ui-form', 'ui-jquery', 'angular-toaster', 'ngDraggable', 'angular-sanitize', 'ngTable', 'dynamicInput', 'jquery-imagezoom', 'common/query/brand','common/query/collection', 'common/query/search', 'common/query/proofing', 'common/query/bill', 'common/query/bankInfo', 'common/query/currency', 'common/services', 'file-upload', 'common/query/payment', 'common/query/messageBoard', 'ngLocal', 'jquery-uploadify', 'common/query/bankTransfer', 'common/query/cms','common/query/storeInfo', 'common/query/commodity', 'common/query/commonCount', 'common/module/chat_web_module'], function(angularAMD) {

	'use strict';
	/**
	 * 自定义Array对象的属性last 方法
	 * 调用获取数组的最后一个元素
	 */
	Array.prototype.last = function() {
		return this.length > 0 ? this[this.length - 1] : null;
	};
	
	var app = angular.module('myApp', [ 'ui.router', 'ui.bootstrap', 'ui.form', 'ui.jquery', 'toaster', 'ngDraggable', 'ngSanitize', 'tool.directives', 'common.directives', 'common.query.kind', 'propertyServices', 'common.services', 'brandServices', 'componentServices', 'goodsServices', 'cartServices', 'orderServices', 'addressServices', 'common.query.propertyAdvice' , 'urlencryptionServices', 'propertyServices', 'common.query.kindAdvice', 'common.query.propertyAdvice', 'ngTable', 'ngDynamicInput', 'brandServices','collection', 'searchService','proofingServices', 'billServices', 'bankInfo', 'currencyService', 'common.services', 'angularFileUpload', 'PaymentService', 'messageBoardServices', 'table.directives', 'ng.local', 'bankTransfer', 'cmsService','storeInfoServices', 'commodityServices', 'commonCountServices', 'WebChatModule']);

	//初始化，启动时载入app
	app.init = function() {
		angularAMD.bootstrap(app);
	};
	
	// ui-router 路由配置
	app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
		$urlRouterProvider.otherwise("/brandList");
		
		$stateProvider.state('home', angularAMD.route({
			// 器件展示首页
			url: '/home',
			templateUrl: 'static/view/prod/product_home.html',
			controller: 'KindHomeCtrl',
			controllerUrl: 'app/controllers/KindHomeCtrl',
			title: '所有类目'
		})).state('componentEdit', angularAMD.route({
			//新-标准器件编辑界面
			url : '/componentEdit',
			templateUrl : 'static/view/prod/product_component_edit_test.html',
			controller : 'ComponentEditCtrl',
			controllerUrl : 'app/controllers/ComponentEditCtrl',
			title : '新-标准器件维护'
		})).state('componentEdit.detail', angularAMD.route({
			//新-标准器件编辑详情页面
			url : '/detail/:type/:uuid',
			templateUrl : 'static/view/prod/product_component_edit_detail.html',
			controller : 'ComponentEdit_detailCtrl',
			controllerUrl : 'app/controllers/ComponentEditCtrl',
			title : '新-标准器件编辑详情页面'
		})).state('brand_list', angularAMD.route({
			//查看品牌信息
			url: '/brandList',
			templateUrl : 'static/view/prod/product_brand_list.html',
			controller : 'BrandListCtrl',
			controllerUrl : 'app/controllers/BrandListCtrl',
			title: '品牌列表'
		})).state('brandEdit_reMaten', angularAMD.route({
			url: '/brandEdit/reMainten/:id',
			templateUrl : 'static/view/prod/product_brand_edit.html',
			controller : 'BrandEditCtrl',
			controllerUrl : 'app/controllers/BrandEditCtrl',
			title: '品牌维护'
		})).state('brandEdit', angularAMD.route({
			// 品牌信息编辑
			url: '/brandEdit/:type/:uuid',
			templateUrl : 'static/view/prod/product_brand_edit.html',
			controller : 'BrandEditCtrl',
			controllerUrl : 'app/controllers/BrandEditCtrl',
			title: '品牌维护'
		})).state('brand_detail', angularAMD.route({
			//查看品牌信息
			url: '/brand/:uuid/:version',
			templateUrl : 'static/view/prod/product_brand_detail.html',
			controller : 'BrandCtrl',
			controllerUrl : 'app/controllers/BrandCtrl',
			title: '品牌',
			resolve: {
				isPutOn: function() {return false;}
			}
		})).state('brand_detail_putOn', angularAMD.route({
			//查看品牌信息
			url: '/brand/:uuid/putOn/:version',
			templateUrl : 'static/view/prod/product_brand_detail.html',
			controller : 'BrandCtrl',
			controllerUrl : 'app/controllers/BrandCtrl',
			title: '品牌',
			resolve: {
				isPutOn: function() {return true;}
			}
		})).state('kind_detail', angularAMD.route({
			// 类目详情展示
			url: '/kinds/:id',
			templateUrl : 'static/view/prod/product_list_bykind.html',
			controller : 'ProductListByKindCtrl',
			controllerUrl : 'app/controllers/ProductListByKindCtrl',
			title: '产品列表'
		})).state('kind_detail_putOn', angularAMD.route({
			// 类目详情展示
			url: '/kinds/:id/putOn',
			templateUrl : 'static/view/prod/product_kind_detail.html',
			controller : 'KindDetailCtrl',
			controllerUrl : 'app/controllers/KindDetailCtrl',
			title: '发布产品类目详情',
			resolve: {
				isPutOn: function() {return true;}
			}
		})).state('kind_detail_maintenance', angularAMD.route({
			// 类目详情展示
			url: '/kinds/:id/maintenance',
			templateUrl : 'static/view/prod/product_kind_detailMaintenance.html',
			controller : 'KindDetailCtrl',
			controllerUrl : 'app/controllers/KindDetailCtrl',
			title: '类目详情',
			resolve: {
				isPutOn: function() {return 'maintenance';}
			}
		})).state('kindPropertyAdvice', angularAMD.route({
			// 对类目描述属性设置的调整建议
			url: '/propertyAdvice/:kindId',
			templateUrl: 'static/view/prod/product_propertyAdvice.html',
			controller: 'KindPropertyAdviceCtrl',
			controllerUrl: 'app/controllers/KindPropertyAdviceCtrl',
			title: '类目属性调整建议'
		})).state('kindAdvice', angularAMD.route({
			// 对类目结构设置的调整建议
			url: '/kindAdvice',
			templateUrl: 'static/view/prod/product_kindAdvice.html',
			controller: 'KindAdviceCtrl',
			controllerUrl: 'app/controllers/KindAdviceCtrl',
			title: '类目结构调整建议'
		})).state('component_detail', angularAMD.route({
			// 查看标准器件详细信息
			url: '/component/:uuid/:version',
			templateUrl : 'static/view/prod/product_component_view.html',
			controller : 'ComponentCtrl',
			controllerUrl : 'app/controllers/ComponentCtrl',
			title: '标准器件详细信息'
		})).state('product_list', angularAMD.route({
			// 商品列表
			url: '/list',
			templateUrl : 'static/view/prod/product_list.html',
			controller : 'ListCtrl',
			controllerUrl : 'app/controllers/ListCtrl',
			title: '商品列表'
		})).state('order_ensure', angularAMD.route({
			// 确认订单信息
			url: '/orderEnsure/:orderid',
			templateUrl : 'static/view/prod/order_ensure.html',
			controller : 'OrderEnsureCtrl',
			controllerUrl : 'app/controllers/OrderEnsureCtrl',
			title: '确认订单信息'
		})).state('order_ensured', angularAMD.route({
			// 订单确认后的待付款页面
			url: '/orderEnsured/:orderid',
			templateUrl : 'static/view/prod/order_ensured.html',
			controller : 'OrderEnsuredCtrl',
			controllerUrl : 'app/controllers/OrderEnsuredCtrl',
			title: '订单确认成功'
		})).state('compare', angularAMD.route({
			// 产品对比
			url: '/compare/:uuids',
			templateUrl: 'static/view/prod/compare.html',
			controller: 'CompareCtrl',
			controllerUrl: 'app/controllers/CompareCtrl',
			title: '产品对比'
		})).state('search', angularAMD.route({
			// 产品对比
			url: '/search/:keywords',
			templateUrl: 'static/view/prod/search.html',
			controller: 'SearchCtrl',
			controllerUrl: 'app/controllers/SearchCtrl',
			title: '产品搜索'
		})).state('proofing', angularAMD.route({
			// 送样
			url: '/proofing',
			templateUrl: 'static/view/prod/proofing2.html',
			controller: 'ProofingCtrl',
			controllerUrl: 'app/controllers/ProofingCtrl',
			title: '送样'
		})).state('proofings', angularAMD.route({
			// 送样
			url: '/proofings/:id',
			templateUrl: 'static/view/prod/applysample.html',
			controller: 'ApplySampleCtrl',
			controllerUrl: 'app/controllers/ApplySampleCtrl',
			title: '送样'
		})).state('inactionStock', angularAMD.route({
			// 呆滞库存
			url: '/inactionStock',
			templateUrl: 'static/view/prod/inactionStock.html',
			controller: 'InactionStockCtrl',
			controllerUrl: 'app/controllers/InactionStockCtrl',
			title: '呆滞库存'
		})).state('original', angularAMD.route({
			// 热卖推荐
			url: '/original',
			templateUrl: 'static/view/prod/original.html',
			controller: 'OriginalCtrl',
			controllerUrl: 'app/controllers/OriginalCtrl',
			title: '热卖推荐'
		})).state('operateManual', angularAMD.route({
			// 我的购物车
			url: '/operateManual',
			templateUrl : 'static/view/prod/operationManual.html',
			controller: 'operateManualCtrl',
			controllerUrl: 'app/controllers/OperateManualCtrl',
			title: '操作指南'
		}));
	}]);
	
	app.run(['$rootScope', 'BaseService', 'StoreInfo', function($rootScope, BaseService, StoreInfo) {
		$rootScope.rootPath = BaseService.getRootPath();
		// 按路由配置修改页面标题
		$rootScope.$on('$routeChangeStart', function(event, next, current ) {
			console.log(current);
			if(current.$$route) {
				var pageTitle = current.$$route.title || '商品管理';
				document.title = pageTitle + '-优软商城';
			}
		});
		StoreInfo.getUmallStoreId({}, {}, function (result) {
			if (result.data) {
				$rootScope.umallStoreId = result.data;
			} else {
				delete $rootScope.umallStoreId;
			}
		}, function () {
			delete $rootScope.umallStoreId;
		});
	}]);
	
	//TODO 注释
	app.controller('PayNowCtrl', ['$scope', 'toaster', 'NgTableParams', '$stateParams', 'goods' ,'$modalInstance', '$filter','$modal', 'Order',function($scope, toaster, NgTableParams, $stateParams, goods , $modalInstance, $filter, $modal, Order) {
		$scope.goods = goods;
		var enIdFilter = $filter('EncryptionFilter');
		$scope.chooseprice = 0.0;
		// 根据批次已输入购买数量获取对应的分段价格
		$scope.currentPrice = function(goods) {
			var r;
			if(goods.qty && goods.prices) {
				angular.forEach(goods.prices, function(v, k) {
					if(v.start <= goods.qty && v.end >= goods.qty) {
						r = v.taxPrice;
						v.$checked = true;
					} else {
						v.$checked = false;
					}
					if(k == (goods.prices.length - 1) && goods.qty > v.end) {
						r = v.taxPrice;
					}
				});
			}
			return r;
		};
		// 验证批次购买数量是否有效
		$scope.qtyInvalid = function(goods) {
			return goods.qty && (goods.qty % goods.minPackQty);
		};
		
		// 提交前转换一下已选购的商品
		var convertGoods = function(goods) {
			var r = [];
			var p = $scope.currentPrice(goods);
			goods.taxes = (goods.qty*p*goods.tax)/(goods.tax + 100);
			r.push({
				uuid: goods.uuid,
				batchCode: goods.batchCode,
				number: goods.qty,
				taxes: goods.taxes
			});
			return r;
		};
		//合计一下
		$scope.checkprice = function(goods) {
			if($scope.qtyInvalid(goods) == 0) {
				$scope.chooseprice = $scope.currentPrice($scope.goods) * goods.qty;
			} 
		};
		
		$scope.ok = function() {
			if($scope.qtyInvalid($scope.goods) == 0){
				var g = convertGoods($scope.goods);
				Order.saveByGroup({}, g, function(data){
					var orderids = [];
					angular.forEach(data, function(order) {
						orderids.push(order.orderid );
					});
					toaster.pop('success', '成功', '订单生成成功，订单号为【' + orderids.join(',') + '】。请您确认订单并付款');
					$modalInstance.close(enIdFilter(orderids.join('-')));
				}, function(res){
					toaster.pop('error', '警告', res.data);
				});
			}
		};
		
		$scope.cancel = function() {
			$modalInstance.dismiss('');
		};
	}]);
	
	
	app.controller('ApplyProofingCtrl', ['$scope', 'toaster', 'NgTableParams', '$stateParams', 'batchCode' ,'uuid' ,'$modalInstance', 'EncryptionService', '$filter','ShippingAddress','$modal' , 'Proofing' ,function($scope, toaster, NgTableParams, $stateParams, batchCode ,uuid,  $modalInstance, EncryptionService, $filter,ShippingAddress, $modal, Proofing) {
		$scope.proofing = {};
		$scope.proofing.batchCode = batchCode;
		$scope.proofing.uuid = uuid;
		$scope.express ={
				其他: "qt", 
				量产: "lc", 
				批量: "pl",
				调试: "ts",
				设计: "sj",
				评估: "pg"
		};
		
		$scope.ok = function() {
			var address = angular.fromJson($scope.receiveAddress);
			$scope.proofing.jsonAddress = angular.toJson(address);
			if($scope.proofing.fixedtel) {
				if($scope.proofing.fixedcode) {
					$scope.proofing.fixedphone = $scope.proofing.fixedcode + "-" + $scope.proofing.fixedtel
				}else {
					$scope.proofing.fixedphone = $scope.proofing.fixedtel;
				}
			}
			Proofing.saveProfing($scope.proofing,function(data) {
				toaster.pop('success', '送样单', '申请成功 !');
				$modalInstance.close(data);
			},function() {
				
			});
		};
		//加载用户收货地址
		var loadAddrs = function(id){
			ShippingAddress.get({send: false}, function(data) {
				//为每个设置选择状态
				angular.forEach(data, function(addr){
					if(id && (id == addr.id)){
						addr.isSelect = true;
						//设置收货地址
						$scope.receiveAddress = angular.toJson(addr);
					}
					else{
						addr.isSelect = false;
					}
					/*TODO 如果没有传id ，$scope.order.jsonAddress = null;*/
				});
				$scope.addrs = data;
			}, function(response) {
				toaster.pop('error', '系统错误', '获取收货地址失败');
			});
		};
		loadAddrs();
		
		//选择收货地址
		$scope.selectAddr = function(addr, addrs){
			var id = addr.id;
			ShippingAddress.setTop({addid: id}, {}, function(data){
				//重新加载购物数据
				loadAddrs(id);
			}, function(res){
				toaster.pop('error', '系统错误', '选择收货地址失败');
			});
		};
		
		//删除收货地址
		$scope.deleteAddr = function(addr){
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
				loadAddrs(address.id);
			}, function(reason){
				toaster.pop('info', '提示 ' + '您已取消收货地址的编辑');
			});
		};
		
		// 展开更多地址的开关
		$scope.moreOptionTrigger = function() {
			$scope.moreOption = ! $scope.moreOption;
		};
		$scope.cancel = function() {
			$modalInstance.dismiss('');
		};
	}]);
	
	return app;
});