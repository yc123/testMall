define([ 'angularAMD', 'common/services', 'common/directives','ui.router', 'ui-bootstrap', 'angular-toaster', 'ngTable', 'common/query/kind', 'common/query/component', 'common/query/cart', 'common/query/goods', 'common/query/urlencryption', 'common/query/collection', 'common/query/order', 'common/query/search', 'common/query/messageBoard', 'common/query/commonCount', 'common/query/storeInfo', 'common/module/chat_web_module'], function(angularAMD) {
	'use strict';

	//读取链接参数
	function getUrlParam(name, link){
	    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	    var search;
	    if (link) {
	    	search = link.substr(link.indexOf("?"),link.length);
	    } else {
	    	search = window.location.search;
	    }
	    var r = search.substr(1).match(reg);
	    if (r != null)
	    	return decodeURI(r[2]);
	    return null;
	}

	var app = angular.module('myApp', [ 'ui.router', 'ui.bootstrap', 'toaster', 'tool.directives', 'common.directives', 'common.services', 'common.query.kind', 'componentServices', 'goodsServices', 'cartServices', 'orderServices', 'urlencryptionServices', 'ngTable', 'collection', 'searchService', 'messageBoardServices', 'commonCountServices', 'storeInfoServices', 'WebChatModule' ]);

	//初始化，启动时载入app
	app.init = function() {
		angularAMD.bootstrap(app);
	};


	app.config([ '$httpProvider', '$locationProvider', '$urlRouterProvider', '$stateProvider', function($httpProvider, $locationProvider, $urlRouterProvider, $stateProvider){
		// 设置Http拦截器，发起http时显示Loading
		$httpProvider.interceptors.push(['Loading', '$q', function(Loading, $q) {
			var i = 0;
			return {
				request: function(cfg){
					if(i == 0) Loading.show();
					i ++;
					return cfg;
				},
				requestError: function(rejection) {
					i --;
					if(i == 0) Loading.hide();
					return $q.reject(rejection);
				},
				response: function(res) {
					i --;
					if(i == 0) Loading.hide();
					return res;
				},
				responseError: function(rejection) {
					i --;
					if(i == 0) Loading.hide();
					return $q.reject(rejection);
				}
			}
		}]);

		$urlRouterProvider.otherwise("/home");

		// 路由配置
		$stateProvider.state('kind', {
			// 类目搜索结果页
			url: '/kind?keyword',
			templateUrl: 'static/view/search/search_kind.html',
			controller: 'SearchKindCtrl',
			title: '分类搜索'
		}).state('brand', {
			// 品牌搜索结果页
			url: '/brand?keyword',
			templateUrl : 'static/view/search/search_brand.html',
			controller : 'SearchBrandCtrl',
			title: '品牌搜索'
		}).state('component', {
			// 产品搜索结果页
			url : '/component?keyword',
			templateUrl : 'static/view/search/search_component.html',
			controller : 'SearchComponentCtrl',
			title : '产品搜索'
		});

	}]);

	app.run(['$rootScope', 'BaseService', 'StoreInfo', function($rootScope, BaseService, StoreInfo) {
		$rootScope.rootPath = BaseService.getRootPath();
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

	// 类目搜索结果页Ctrl
	app.controller('SearchKindCtrl', ['$scope', 'Search', '$stateParams', function($scope, Search, $stateParams){
		$scope.keyword = unescape($stateParams.keyword);

		Search.kindSearch({w: $scope.keyword}, function(data) {
			$scope.kindDatas = data;
		}, function(response) {

		});
	}]);

	// 品牌搜索结果页Ctrl
	app.controller('SearchBrandCtrl', ['$scope', 'Search', '$stateParams', function($scope, Search, $stateParams){
		$scope.keyword = unescape($stateParams.keyword);

		Search.brandSearch({w: $scope.keyword}, function(data) {
			$scope.brandDatas = data;
		}, function(response) {

		});

	}]);

	// 产品搜索结果页Ctrl
	app.controller('SearchComponentCtrl', ['$scope', '$rootScope', 'Search', 'ngTableParams', '$sce', '$stateParams', 'SessionService', 'Compare', '$modal', 'ComponentActive', 'toaster', 'AuthenticationService', 'collectionService', '$filter', 'KindAPI', 'BaseService', 'Cart', '$window', 'Order', function($scope, $rootScope, Search, ngTableParams, $sce, $stateParams, SessionService, Compare, $modal, ComponentActive, toaster, AuthenticationService, collectionService, $filter, KindAPI, BaseService, Cart, $window, Order){
		$scope.keyword = unescape($stateParams.keyword);
		$scope.filter = {};
		$scope.sort = {
			'GO_RESERVE' : 'DESC',
			'GO_SEARCH'  : 'DESC'};
		$scope.priceSort = true;
		$scope.obj={};
		$scope.flag = {};
		$scope.filterTemp=null;
		var enIdFilter = $filter('EncryptionFilter');
		var componentTypeJson = SessionService.get('component');
		var componentType = angular.fromJson(componentTypeJson);
		$scope.productTableParams = new ngTableParams({
			page : 1,
			count : 15
		}, {
			total : 0,
			getData : function($defer, params) {
				var pageParams = params.url();
                console.log(BaseService.parseParams(pageParams));
				pageParams.filter = {};
				if($scope.filter.kind) {
					pageParams.filter.goods_kindId = $scope.filter.kind;
				}
				if($scope.filter.brand) {
					pageParams.filter.goods_brandId = $scope.filter.brand;
				}
				if($scope.filter.storeType) {
					pageParams.filter.goods_store_type = $scope.filter.storeType;
				}
				if($scope.filter.crname) {
					pageParams.filter.goods_crname = $scope.filter.crname;
				}
				if($scope.filter.minPrice){
                    pageParams.filter.goods_minpricermb = $scope.filter.minPrice;
                }
                if($scope.filter.maxPrice){
                    pageParams.filter.goods_maxpricermb = $scope.filter.maxPrice;
                }
				if(componentType != null) {
					if(angular.equals(componentType.original, true)) {
						pageParams.filter.original_qty = true;
					}
					if(angular.equals(componentType.inaction, true)) {
						pageParams.filter.inaction_stock_qty = true;
					}
					if(angular.equals(componentType.proffing, true)) {
						pageParams.filter.sample_qty = true;
					}
				}
				pageParams.sorting = $scope.sort;
                BaseService.parseParams(pageParams);
                pageParams.keyword = $scope.keyword;
				KindAPI.getCompGoodsBySearch(pageParams, function(data) {
					$scope.components = data.components;
					$scope.total = data.total;
					getCarts();
					$defer.resolve(data.components);
					params.total(data.expose);
				}, function(res) {
					toaster.pop('error', '获取信息失败 ', res.data);
				});
			}
		});
		$scope.status = 'to_reserve';
		$scope.setActive = function(status) {
			$scope.status = status;
			switch (status){
				case 'to_reserve':
					$scope.sort = {
						'GO_RESERVE' : 'DESC',
						'GO_SEARCH'  : 'DESC'};
					break;
				case 'to_comSearch':
					$scope.sort = {
						'GO_SEARCH'  : 'DESC',
						'GO_RESERVE' : 'DESC'};
					break;
				case 'to_price':
					$scope.priceSort = !$scope.priceSort;
					if ($scope.priceSort){
                        if ($scope.filter.crname == null || $scope.filter.crname.toString() ===['RMB','USD','RMB-USD'].toString()){
                            $scope.sort = {
                                'GO_MINPRICERMB': 'DESC',
                                'GO_RESERVE' : 'DESC',
                                'GO_SEARCH'  : 'DESC'};
                        }else if($scope.contains($scope.filter.crname,  'USD')){
							$scope.sort = {
								'GO_MINPRICEUSD': 'DESC',
								'GO_RESERVE' : 'DESC',
								'GO_SEARCH'  : 'DESC'};
						} else{
							$scope.sort = {
								'GO_MINPRICERMB': 'DESC',
								'GO_RESERVE' : 'DESC',
								'GO_SEARCH'  : 'DESC'};
						}
					}else{
                        if ($scope.filter.crname == null || $scope.filter.crname.toString() ===['RMB','USD','RMB-USD'].toString()){
                            $scope.sort = {
                                'GO_MINPRICERMB': 'ASC',
                                'GO_RESERVE' : 'DESC',
                                'GO_SEARCH'  : 'DESC'};
                        }else if($scope.contains($scope.filter.crname,  'USD')){
                            $scope.sort = {
                                'GO_MINPRICEUSD': 'ASC',
                                'GO_RESERVE' : 'DESC',
                                'GO_SEARCH'  : 'DESC'};
                        } else{
                            $scope.sort = {
                                'GO_MINPRICERMB': 'ASC',
                                'GO_RESERVE' : 'DESC',
                                'GO_SEARCH'  : 'DESC'};
                        }
					}
					break;
				default:
					$scope.sort = {
						'GO_RESERVE' : 'DESC',
						'GO_SEARCH'  : 'DESC'};
					break;
			}
			$scope.productTableParams.page(1);
			$scope.productTableParams.reload();
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

		// 筛选类目
		$scope.selectKind = function(k,status) {
			if (k == null){
				$scope.filter.kind = null;
				$scope.productTableParams.page(1);
				$scope.productTableParams.reload();
				getBrands();
				getStoreType();
				getCrname();
				return;
			}
			if (status){
				if ($scope.filter.kind == null){
					$scope.filter.kind = [];
					$scope.filter.kind.push(k.ki_id);
				}else {
					$scope.filter.kind.push(k.ki_id);
				}
			}else {
				$scope.removeByValue($scope.filter.kind,k.ki_id);
				if ($scope.filter.kind.length == 0){
					$scope.filter.kind = null;
				}
			}
			$scope.productTableParams.page(1);
			$scope.productTableParams.reload();
			getBrands();
			getStoreType();
			getCrname();
		};

		// 筛选品牌
		$scope.selectBrand = function(b,status) {
			if (b == null){
				$scope.filter.brand = null;
				$scope.productTableParams.page(1);
				$scope.productTableParams.reload();
				getKinds();
				getStoreType();
				getCrname();
				return;
			}
			if (status){
				if ($scope.filter.brand == null){
					$scope.filter.brand = [];
					$scope.filter.brand.push(b.br_id);
				}else {
					$scope.filter.brand.push(b.br_id);
				}
			}else {
				$scope.removeByValue($scope.filter.brand,b.br_id);
				if ($scope.filter.brand.length == 0){
					$scope.filter.brand = null;
				}
			}
			$scope.productTableParams.page(1);
			$scope.productTableParams.reload();
			getKinds();
			getStoreType();
			getCrname();
		};
		// 筛选货源
		$scope.selectStoreType = function(s,status) {
			if (s == null){
				$scope.filter.storeType = null;
				$scope.productTableParams.page(1);
				$scope.productTableParams.reload();
				getKinds();
				getBrands();
				getCrname();
				return;
			}
			if (status){
				if ($scope.filter.storeType == null){
					$scope.filter.storeType = [];
					$scope.filter.storeType.push(s.store_type);
				}else {
					$scope.filter.storeType.push(s.store_type);
				}
			}else {
				$scope.removeByValue($scope.filter.storeType,s.store_type);
				if ($scope.filter.storeType.length == 0){
					$scope.filter.storeType = null;
				}
			}
			$scope.productTableParams.page(1);
			$scope.productTableParams.reload();
			getKinds();
			getBrands();
			getCrname();
		};
		// 筛选
		$scope.selectCrname = function(c,status) {
			if (c == null){
				$scope.filter.crname = null;
				$scope.filterTemp = null;
				$scope.productTableParams.page(1);
				$scope.productTableParams.reload();
				getKinds();
				getBrands();
				getStoreType();
				return;
			}
			if (status){
				if ($scope.filter.crname == null){
					$scope.filter.crname = [];
					$scope.filter.crname = angular.copy(c.cr_name);
					$scope.filterTemp = [];
					$scope.filterTemp.push(c.cr_name);
				}else {
					$scope.filterTemp.push(c.cr_name);
					$scope.filter.crname=['RMB','USD','RMB-USD'];
				}
			}else {
				$scope.removeByValue($scope.filterTemp,c.cr_name);
				$scope.removeByValue(c.cr_name,'RMB-USD');
				$scope.removeByValue($scope.filter.crname,'RMB-USD');
				$scope.removeByValue($scope.filter.crname,c.cr_name[0]);
				if ($scope.filter.crname.length == 0){
					$scope.filter.crname = null;
					$scope.filterTemp = null;
				}else {
					$scope.filter.crname.push('RMB-USD');
				}
			}
			$scope.productTableParams.page(1);
			$scope.productTableParams.reload();
			getKinds();
			getBrands();
			getStoreType();
		};
        // 筛选价位
        $scope.to_minAndMaXPrice = function() {
            $scope.filter.minPrice = $scope.obj.goodsMinPrice;
            $scope.filter.maxPrice = $scope.obj.goodsMaxPrice;
            $scope.productTableParams.page(1);
            $scope.productTableParams.reload();
        };
        // 清空价位
        $scope.clearPrice = function() {
            if (JSON.stringify($scope.obj) == "{}"){
                return;
            }
            $scope.obj = {};
            $scope.filter.minPrice = null;
            $scope.filter.maxPrice = null;
            $scope.productTableParams.page(1);
            $scope.productTableParams.reload();
        };
        $scope.mykey = function (e) {
            var keycode = window.event ? e.keyCode : e.which;//获取按键编码
            if (keycode == 13) {
                $scope.to_minAndMaXPrice();//如果等于回车键编码执行方法
            }
        }


        // 获取类目统计数据
		var getKinds = function() {
			var params = {
				keyword: $scope.keyword
			};
			params.paramJSON={};
			params.collectList = 'goods_kind';
			if($scope.filter.brand) {
				params.paramJSON.goods_brandid = $scope.filter.brand;
			}
			if($scope.filter.storeType) {
				params.paramJSON.goods_store_type = $scope.filter.storeType;
			}
			if($scope.filter.crname) {
				params.paramJSON.goods_crname = $scope.filter.crname;
			}
			Search.componentCollect(params, function(data) {
				$scope.componentKinds = data;
			}, function(response) {

			});
		};
		getKinds();

		// 获取品牌统计数据
		var getBrands = function() {
			var params = {
				keyword: $scope.keyword
			};

			params.paramJSON={};
			params.collectList = 'goods_brand';
			if($scope.filter.kind) {
				params.paramJSON.goods_kindid = $scope.filter.kind;
			}
			if($scope.filter.storeType) {
				params.paramJSON.goods_store_type = $scope.filter.storeType;
			}
			if($scope.filter.crname) {
				params.paramJSON.goods_crname = $scope.filter.crname;
			}
			Search.componentCollect(params, function(data) {
				$scope.componentBrands = data;
			}, function(response) {

			});
		};
		getBrands();
		// 获取店铺类型统计数据
		var getStoreType = function() {
			var params = {
				keyword: $scope.keyword
			};
			params.paramJSON={};
			params.collectList = 'goods_store_type';
			if($scope.filter.kind) {
				params.paramJSON.goods_kindid = $scope.filter.kind;
			}
			if($scope.filter.brand) {
				params.paramJSON.goods_brandid = $scope.filter.brand;
			}
			if($scope.filter.crname) {
				params.paramJSON.goods_crname = $scope.filter.crname;
			}
			Search.componentCollect(params, function(data) {
				$scope.componentStoreType = data;
                $scope.componentStoreTypeTemp = [];
                $scope.componentStoreType.forEach(function (value,index,array) {
                    switch (value.store_type){
                        case 'CONSIGNMENT':value.store_type_name='寄售';
                            $scope.componentStoreTypeTemp.push('寄售');
                            break;
                        case 'AGENCY':value.store_type_name='代理';
                            $scope.componentStoreTypeTemp.push('代理');
                            break;
                        case 'DISTRIBUTION':value.store_type_name='经销';
                            $scope.componentStoreTypeTemp.push('经销');
                            break;
                        case 'ORIGINAL_FACTORY':value.store_type_name='原厂';
                            $scope.componentStoreTypeTemp.push('原厂');
                            break;
                    }
                })
			}, function(response) {

			});
		};
		getStoreType();
		var crde = {cr_ar_name:'大陆',cr_cn_name:'人民币',cr_name:['RMB','RMB-USD']};
		var crhk = {cr_ar_name:'香港',cr_cn_name:'美元',cr_name:['USD','RMB-USD']};
		// 获取货币类型统计数据
		var getCrname = function() {
			var params = {
				keyword: $scope.keyword
			};
			params.paramJSON={};
			params.collectList = 'goods_crname';
			if($scope.filter.kind) {
				params.paramJSON.goods_kindid = $scope.filter.kind;
			}
			if($scope.filter.brand) {
				params.paramJSON.goods_brandid = $scope.filter.brand;
			}
			if($scope.filter.storeType) {
				params.paramJSON.goods_store_type = $scope.filter.storeType;
			}
			Search.componentCollect(params, function(data) {
				$scope.componentCrname = data;
				var items = [];
				$scope.componentCrname.forEach(function(value, index, array){
					items.push(value.cr_name);
				});
                if (items.length == 0){
                    $scope.componentCrnameTemp =[];
                }else{
                    if($scope.contains(items,'RMB-USD') || ($scope.contains(items,'RMB') && $scope.contains(items,'USD'))){
                        $scope.componentCrnameTemp =[];
                        $scope.componentCrnameTemp.push(crde);
                        $scope.componentCrnameTemp.push(crhk);
                    }else if($scope.contains(items,'RMB')){
                        $scope.componentCrnameTemp =[];
                        $scope.componentCrnameTemp.push(crde);
                    }else if($scope.contains(items,'USD')){
                        $scope.componentCrnameTemp =[];
                        $scope.componentCrnameTemp.push(crhk);
                    }
                }
			}, function(response) {

			});
		};
		getCrname();

		// 高亮关键词
		$scope.highlight = function(s) {
			var sl = s.toLowerCase();
			var wl = $scope.keyword.toLowerCase();
			var i = s.indexOf(wl);
			var l = wl.length;
			return $sce.trustAsHtml('<span class="text-inverse">' + s.substr(0, l) + '</span>' + s.substring(l, s.legth));
		};

		// 点击收藏产品
		$scope.collect = function(id) {
			var obj = {'componentid': id, 'kind': 2};
			if(AuthenticationService.isAuthed()) {
				var key = $rootScope.userInfo.userUU +"-"+ $rootScope.userInfo.enterprise.uu;
				if(!SessionService.getCookie(key)) {
					SessionService.setCookie(key, angular.toJson([]));
				}
				var cookie = SessionService.getCookie(key);
				var store = angular.fromJson(cookie);
				var isExist = false;
				for(var i = 0; i < store.length; i++) {
					if(store[i].kind == 2 && store[i].componentid == id) {
						toaster.pop('info', '已收藏');
						return;
					}
				}
                collectionService.saveEntity({}, obj, function(data) {
					toaster.pop('success', '收藏成功');
					store.push(obj);
					$rootScope.componentCount++;
					SessionService.setCookie(key, angular.toJson(store));
				}, function(response) {
					toaster.pop('error', '收藏失败');
				})
			}else {
				var key = "visitor";
				if(!SessionService.getCookie(key)) {
					SessionService.setCookie(key, angular.toJson([]));
				}
				var store = angular.fromJson(SessionService.getCookie(key));
				for(var i = 0; i < store.length; i++) {
					if(store[i].kind == 2 && store[i].componentid == id) {
						toaster.pop('info', '已收藏');
						return ;
					}
				}
				store.push(obj);
				SessionService.setCookie(key, angular.toJson(store));
				toaster.pop('success', '收藏成功');
				$rootScope.componentCount++;
			}
		};

		// 判断器件是否已经加入对比
		$scope.addedCompare = function(uuid) {
			var result = false;
			if($rootScope.compares) {
				for(var i=0; i<$rootScope.compares.length; i++) {
					var c = $rootScope.compares[i];
					if(c.uuid == uuid)  {
						result = true;
					}
				}
			}
			return result;
		};

		// 添加至产品对比
		$scope.addToCompare = function(uuid) {
			if($rootScope.compares && $rootScope.compares.length > 4){
				toaster.pop('error', '一次最多只能对比5种产品');
			}else {
				Compare.add({uuid: uuid}, {}, function(data){
					$rootScope.compares = data;
					$rootScope.$content_open = true; //加入对比之后，右边的产品对比 默认展开
					toaster.pop('success', '加入对比成功');
				}, function(response){
					toaster.pop('error', '加入对比失败', response.data);
				});
			}

		};

		// 直接购买或加入购物车
		$scope.addToCart = function(goods, isBuy, value){
			if(!goods) {
				return ;
			}
			if(goods.reserve < goods.minBuyQty) {
				toaster.pop('warning', '库存量已经不能不满足最小起订量！');
				return ;
			}
			if(!$rootScope.userInfo || !$rootScope.userInfo.userUU) {
				AuthenticationService.redirectSignin();
				return;
			}
			var a = {
				uuid: goods.uuid,
				batchCode: goods.batchCode,
				number: goods.minBuyQty,
				taxes: goods.taxes
			};

			var goodsList = [];
			goodsList.push(a);
			SessionService.set("buyNow", false);
			if(isBuy){// 1、如果是立即购买，跳转订单确认页面
				if(a.number > 0) {
					var newWidow = window.open('product#/cart');
					// 1、生成订单
					Order.buyNow({}, goodsList, function(data){
						var orderids = [];
						angular.forEach(data, function(order) {
							orderids.push(order.orderid );
						});
						// 控制订单确认页，直接购买不显示进度条
						SessionService.set("buyNow", true);
						// 2、跳转到订单确认页面，进行付款操作
						newWidow.location.href ='user#/order/pay/'+ enIdFilter(data.orderid);
					}, function(res){
						newWidow.close();
						toaster.pop('error', '警告', res.data);
					});
				}else {
					toaster.pop('warning', '提示', '该商品库存为0，请等待上货或咨询客服');
				}
			} else {// 2、如果是加入购物车，组装cart对象，提交
				if (a.number > 0) {
					Cart.addOneCartRecord({}, a, function (resp) {
						if (resp.success) {
							toaster.pop('success', '保存成功', '添加购物车成功');
							Cart.getCount({}, function(data){
								$rootScope.countCart = data.count;
							}, function(res){
							});
							getCarts();
						} else {
							toaster.pop("info", resp.message);
						}
					});
				} else {
					toaster.pop('warning', '提示', '该商品库存为0，请等待上货或咨询客服');
				}
			}
		};

		// 删除购物车对应商品
		$scope.deleteFromCart = function(batchCode) {
			var arr = [];
			arr.push(batchCode);
			var batchCodes = angular.toJson(arr);
			Cart.deleteByBatchCode(batchCodes,function(data){
				toaster.pop('info', '取消成功', '撤销商品成功');
				Cart.getCount({}, function(data){
					$rootScope.countCart = data.count;
				}, function(res){
				});

				// 每次修改购物车信息之后，都获取当前状态
				getCarts();
			}, function(res){
				toaster.pop('error', '取消失败', '商品已从购物车删除，请重新选择');
				getCarts();
			});
		};

		//免费申请样品
		$scope.applySample = function(component, number) {
			//先判断这个型号的产品对该企业是否有样品
			ComponentActive.hasSamples({}, component, function(data){
				if(data.goods) {
					window.open("product#/proofings/" + enIdFilter(data.goods.batchCode));
				}else {
					toaster.pop('info', '贵司已申请该样品，请勿重复申请');
					$scope.hasSample[number] = true;
				}
			}, function(response){
				$scope.hasSample[number] = true;
				toaster.pop('error', '系统错误', response.data);
			});
		};
        $scope.checkInput= function (str) {
            if ($scope.obj.goodsMinPrice<0){
                $scope.obj.goodsMinPrice=0;
            }
            if (typeof $scope.obj.goodsMinPrice!='undefined' && typeof $scope.obj.goodsMaxPrice!='undefined'){
                if ($scope.obj.goodsMinPrice>$scope.obj.goodsMaxPrice){
                    if (str == 'goodsMinPrice'){
                        $scope.obj.goodsMinPrice = $scope.obj.goodsMaxPrice;
                    }else if(str == 'goodsMaxPrice'){
                        $scope.obj.goodsMaxPrice = $scope.obj.goodsMinPrice;
                    }
                }
            }
        };
        //数组操作
		$scope.contains = function (arr, obj) {
			if (arr == null){
				return false;
			}
			var i = arr.length;
			while (i--) {
				if (arr[i] === obj) {
					return true;
				}
			}
			return false;
		}
		$scope.removeByValue = function (arr, val) {
			for(var i=0; i<arr.length; i++) {
				if(arr[i] === val) {
					arr.splice(i, 1);
					break;
				}
			}
		}

	}]);

	app.filter('currencySysmbol', function() {
		return function(moneyParam, currency, add) {
			if(typeof(moneyParam) == 'undefined') {
				moneyParam = 0;
			}
			if(currency == 'RMB') {
				return "￥ " + moneyParam + " " + (typeof(add) == "undefined" ? '' : add);
			}else if(currency == "USD"){
				return "$ " + moneyParam;
			}else {
				return moneyParam;
			}
		}
	});

	return app;
});
