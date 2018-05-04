define([ 'app/app', 'jquery-summernote' ], function(app) {
	'use strict';
	app.register.controller('ComponentCtrl', ['$scope', '$rootScope', 'toaster', '$modal', '$http', '$location', '$stateParams', '$templateCache', 'Compare', 'ComponentVersion', 'ComponentActive', 'ComponentActiveAPI', 'KindAPI', 'AuthenticationService', 'SessionService', 'collectionService', 'propertiesActive', 'ImgUrl', 'BaseService', '$window', 'StoreInfo', 'ngTableParams', 'Cart', 'Order', '$filter', 'Commodity', function($scope, $rootScope, toaster, $modal, $http, $location, $stateParams, $templateCache, Compare, ComponentVersion, ComponentActive, ComponentActiveAPI, KindAPI, AuthenticationService, SessionService, collectionService, propertiesActive, ImgUrl, BaseService, $window, StoreInfo, ngTableParams, Cart, Order, $filter, Commodity) {
		var enIdFilter = $filter('EncryptionFilter');
		$scope.uuid = $stateParams.uuid;
		$scope.version = $stateParams.version;
		$scope.ignoreUMall = false;// 默认查询库存寄售批次
		$scope.ignoreStore = false;// 默认查询店铺寄售批次
		$scope.storeIds = [];// 选择店铺列表
		$scope.storeIdsStr = '';
		$scope.Umallexist = false;
		$scope.Storeexist = false;

		$scope.kind = { properties : {} };

		$scope.isShow = {
			property: true ,
			transaction: false ,
			comment: false
		};

		$scope.isVersionListShow = false;
		$scope.showVersionList = function(){
			$scope.isVersionListShow = !$scope.isVersionListShow;
		};

		// 获取结构化类目
		var getStructingKinds = function (id) {
			KindAPI.getStructingKinds({id : id}, function (data) {
				$scope.structingKinds = data;
			}, function (response) {
				toaster.pop('error', response.data);
			})
		};

		// Tab切换
		$scope.changeTab = function(key){
			// 所有的置为false
			for( var a in $scope.isShow ){
				$scope.isShow[a] = false;
			}
			// 目标置为true
			$scope.isShow[key] = true;
		};

		var buildArr = function(num){
			var arr = [];
			for(var i = 1; i <= num; i++){
				arr.push(i);
			}
			return arr;
		};

		$scope.addStore = function (storeIn) {
			if ($scope.storeIds.indexOf(storeIn.uuid) != -1) {
				$scope.storeIds.splice($scope.storeIds.indexOf(storeIn.uuid), 1);
				storeIn.isSelected = false;
			} else {
				$scope.storeIds.push(storeIn.uuid);
				storeIn.isSelected = true;
			}
			$scope.storeIdsStr = $scope.storeIds.join(',');
			$scope.goodsTableParams.page(1);
			$scope.goodsTableParams.reload();
		};

		// 切换是否包含库存寄售
		$scope.toggleUMall = function() {
			$scope.ignoreUMall = !$scope.ignoreUMall;
			$scope.goodsTableParams.page(1);
			$scope.goodsTableParams.reload();
		};

        // 切换是否包含店铺自营
        $scope.toggleStore = function() {
            $scope.ignoreStore = !$scope.ignoreStore;
            $scope.goodsTableParams.page(1);
            $scope.goodsTableParams.reload();
        };

		// 将各种数据加载到$scope上
		var loadData = function(data){
			$scope.component = data;
			var version = data.version;
			// 判断是否uuid有对应的数据
			if(data.version == -1){
				// 没有uuid对应数据，跳转回标准器件列表首页
				toaster.pop('info', '未查到对应品牌信息', '已跳转至品牌页面');
				$location.url("home/");
			}
			else if(data.version == 0){
				// 没有version对应数据，跳转uuid对应标准器件有效
				toaster.pop('info', '未查到对应版本标准器件信息', '已跳转至最新标准器件页面');
				$location.url("component/" + $scope.uuid + "/");
			}
			else{
				//获取店铺信息
				StoreInfo.findStoreByUuid({uuid: $scope.component.uuid}, {}, function (storeIns) {
					var storeIds = [];
					angular.forEach(storeIns, function (storeIn) {
						storeIn.isSelected = false;
						storeIds.push(storeIn.uuid);
					});
					$scope.storeIns = storeIns;

					// 获取库存寄售店铺storeid
					StoreInfo.getUmallStoreId({}, function (data) {
						$scope.UmallStoreId = data.data;

						if (storeIds.length > 0) {
							if(storeIds.indexOf($scope.UmallStoreId) == -1)	{
								$scope.Storeexist = true;
							} else {
								storeIds.splice(storeIds.indexOf($scope.UmallStoreId),1);
								if (storeIds.length > 0) {
									$scope.Storeexist = true;
								}
								$scope.Umallexist = true;
							}
						}
					}, function (response) {

					});

				}, function (res) {
					toaster.pop('error', '错误', res.data);
				});



				// 通过uuid获取批次信息
				$scope.goodsTableParams = new ngTableParams({
					page : 1,
					count : 10,
					sorting : {
						minPriceRMB : 'ASC'
					}
				}, {
					total: 0,
					getData: function ($defer, params) {
						$scope.loading = true;
						$scope.paginationParams = params;
						var pageParams = params.url();
						pageParams.filter = {uuid: data.uuid};
						pageParams.filter.ignoreUMall = $scope.ignoreUMall;
                        pageParams.filter.ignoreStore = $scope.ignoreStore;
						pageParams.filter.storeIds = $scope.storeIdsStr;
						Commodity.findPageGoods(BaseService.parseParams(pageParams), function (page) {
							if (page) {
								params.total(page.totalElements);
								$defer.resolve(page.content);
							}
						});
					}
				});

				// 数据加载完成后才进行图片放大镜的事件绑定
				angular.element(".jqzoom").imagezoom();
				angular.element("#thumblist li a").click(function() {
					angular.element(this).parents("li").addClass("tb-selected").siblings().removeClass("tb-selected");
					angular.element(".jqzoom").attr('src', $(this).find("img").attr("mid"));
					angular.element(".jqzoom").attr('rel', $(this).find("img").attr("big"));
				});

				if(data.versionCount){
					// 如果是版本信息则直接从保存了的JSON字段转换
					$scope.component.brandActive = angular.fromJson(data.brandJson);
					$scope.productKinds = angular.fromJson($scope.component.kindJson);
				} else{
					$scope.component.versionCount = $scope.component.version;
					// 根据kind_id获取所属类目树
					KindAPI.getParents({childId: $scope.component.kindid}, {}, function(data){
						$scope.productKinds = data;
					}, function(data){
						toaster.pop('error', '错误', '获取类目树信息失败');
					});
				}
				$scope.arr = buildArr($scope.component.versionCount);
			}
		};

		// 检查有没有版本号
		if($scope.version){
			// 查询对应版本号
			ComponentVersion.get({uuid : $scope.uuid, version : $scope.version }, {}, function(data){
				loadData(data);
				getStructingKinds(data.kindid);
			}, function(data){
				toaster.pop('error', '系统异常', '标准器件历史版本数据加载失败');
			});
		} else{
			// 将数据加载到$scope.component中
			ComponentActiveAPI.get({uuid : $scope.uuid}, {}, function(data){
				loadData(data);
				getStructingKinds(data.kindid);
			}, function(){
				toaster.pop('error', '系统异常', '标准器件数据加载失败');
			});
		}

		// 加入收藏
		$scope.collect = function(id) {
			var obj = {'componentid': id, 'kind': 2};
			if(AuthenticationService.isAuthed()) {
				if ($rootScope.userInfo.enterprise) {
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
						// 打开莫模态框
						$modal.open({
							templateUrl : $rootScope.rootPath + '/static/view/usercenter/modal/collectModel.html',
							controller : 'CollectModelCtrl',
							size : 'sm'
						});
						toaster.pop('success', '收藏成功');
						store.push(obj);
						$rootScope.componentCount++;
						SessionService.setCookie(key, angular.toJson(store));
					}, function(response) {
						toaster.pop('error', '收藏失败');
					})
				} else {
					var key = $rootScope.userInfo.userUU;
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
						// 打开莫模态框
						$modal.open({
							templateUrl : $rootScope.rootPath + '/static/view/usercenter/modal/collectModel.html',
							controller : 'CollectModelCtrl',
							size : 'sm'
						});
						toaster.pop('success', '收藏成功');
						store.push(obj);
						$rootScope.componentCount++;
						SessionService.setCookie(key, angular.toJson(store));
					}, function(response) {
						toaster.pop('error', '收藏失败');
					})
				}
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
		}

		// 添加至产品对比
		$scope.addToCompare = function(uuid) {
			Compare.add({uuid: uuid}, {}, function(data){
				$rootScope.compares = data;
				$rootScope.$content_open = true; //加入对比之后，右边的产品对比 默认展开
				toaster.pop('success', '加入对比成功');
			}, function(response){
				toaster.pop('error', '加入对比失败', response.data);
			});

		};

		$scope.downloadpdf = function(attach) {
			if(!$rootScope.userInfo || !$rootScope.userInfo.userUU) {
				AuthenticationService.redirectSignin();
				return;
			}else {
				window.open(attach);
			}
		};

		$scope.toBatch = function (good) {
			$window.location.href = "store/" + good.storeid + "#/batchInfo/" + good.batchCode;
		};

		// 直接购买或加入购物车
		$scope.addToCart = function(commodity, isBuy, number) {
            if(!commodity || !number || number < 1) {
                return ;
            }
            if(commodity.reserve < commodity.minBuyQty) {
                toaster.pop('warning', '库存量已经不能不满足最小起订量！');
                return ;
            }
			if (!$rootScope.userInfo || !$rootScope.userInfo.userUU) {
				AuthenticationService.redirectSignin();
				return -1;
			}
			var rootPath = BaseService.getRootPath();
			var cart = {
				uuid: commodity.uuid,
				batchCode: commodity.batchCode,
				number: number ? number : commodity.minBuyQty
			};
			var goodsList = [];
			goodsList.push(cart);
			if (isBuy) {
				if(cart.number > 0) {
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
			} else {
				// 1、加入购物车
				// 2、更新购物车状态显示
				Cart.addOneCartRecord({}, cart, function (resp) {
					if (resp.success) {
						Cart.getCount({}, function(data){
							$rootScope.countCart = data.count;
						}, function(res){
						});
						toaster.pop("info", "商品加入购物车成功");
					} else {
						toaster.pop("info", resp.message);
					}
				});
			}
		}

	}]);
	
	app.register.controller('CollectModelCtrl', ['$scope', '$modalInstance', function($scope, $modalInstance){
		$scope.haveAdd = true;
		$scope.cancel = function() {
			$modalInstance.dismiss();
		};
	}]);
	
});