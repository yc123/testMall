define([ 'app/app', 'jquery-summernote' ], function(app) {
	'use strict';
	app.register.controller('BrandCtrl', ['$scope', 'toaster', '$modal', '$http', '$location', '$stateParams', '$templateCache', 'Compare', 'BrandActiveAPI', 'ComponentActiveAPI', 'BrandVersion', 'ArrayUtil', '$filter', 'ngTableParams', 'BaseService', 'isPutOn', 'collectionService', 'AuthenticationService', 'SessionService', '$rootScope', '$window', function($scope, toaster, $modal, $http, $location, $stateParams, $templateCache, Compare, BrandActiveAPI, ComponentActiveAPI, BrandVersion, ArrayUtil, $filter, ngTableParams, BaseService, isPutOn, collectionService, AuthenticationService, SessionService, $rootScope, $window) {
		$scope.isPutOn = isPutOn;// false为普通查看模式，true为供应商发布产品模式
		
		$scope.uuid = $stateParams.uuid;
		$scope.version = $stateParams.version;
		$scope.activeKinds = [];
		$scope.isSelected = 0;
		var kinds_all;
		
		//收藏品牌
		$scope.store = function(id) {
			var obj = {'brandid': id, 'kind': 1};
			if(AuthenticationService.isAuthed()) {
				var key = $rootScope.userInfo.userUU +"-"+ $rootScope.userInfo.enterprise.uu;
				if(!SessionService.getCookie(key)) {
					SessionService.setCookie(key, angular.toJson([]));
				}
				var cookie = SessionService.getCookie(key);
				var store = angular.fromJson(cookie);
				var isExist = false;
				for(var i = 0; i < store.length; i++) {
					if(store[i].kind == 1 && store[i].brandid == id) {
						toaster.pop('error', '已收藏');
						return;
					}
				}
				collectionService.saveEntity({}, obj, function(data) {
					toaster.pop('success', '收藏成功');
					$rootScope.brandCount++;
					store.push(obj);
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
					if(store[i].kind == 1 && store[i].brandid == id) {
						toaster.pop('info', '已收藏');
						return ;
					}
				}
				store.push(obj);
				SessionService.setCookie(key, angular.toJson(store));
				toaster.pop('success', '收藏成功');
				$rootScope.brandCount++;
			}
		}
		
		//收藏器件
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

		// 获取相关类目结构
		var getKinds = function(brandId) {
			BrandActiveAPI.getKinds({brandId: brandId}, function(data){
				kinds_all = data;
				$scope.kinds = data[0];
				if(!$scope.kinds) {
					$scope.myshow.showif = 'sl-show';
				}
				angular.forEach($scope.kinds, function (kind) {
					kind.isOpen = false;
				});
				$scope.step = 0;
			}, function(response) {
				toaster.pop('error', '获取相关类目失败', response.data);
			});
		};

		// 点击展开类目
		$scope.showKindList = function (kind, step) {
			kind.isOpen = !kind.isOpen;
			$scope.isSelected = kind.id;
			kind.child = [];
			if (!kind.isOpen) {
				kind.child = [];
			} else {
				if (kind.isLeaf == 0) {
					angular.forEach(kinds_all[kind.level], function (child) {
						if (child.parentid == kind.id) {
							kind.child.push(child);
						}
					})
				}
			}
			$scope.componentTableParams.page(1);
			$scope.componentTableParams.reload();
		};

		// 获取初始器件列表
		var getComponents = function(brandId) {
			$scope.componentTableParams = new ngTableParams({
				page : 1,
				count : 10
			}, {
				total : 0,
				getData : function($defer, params) {
					$scope.paginationParams = params;
					var pageParams = params.url();
					pageParams.filter = {brandid: brandId};
					// if($scope.activeKinds && $scope.activeKinds.length > 0) {
					if ($scope.isSelected != 0) {
						pageParams.filter.kindid = $scope.isSelected;
					}
					if ($scope.keyword != null) {
						pageParams.filter.code = $scope.keyword;
					}
					pageParams.reserve = $scope.noReserveZero;
					//获取当前类目下的标准器件信息
					ComponentActiveAPI.getInfoPage(BaseService.parseParams(pageParams), function(data){
						if (data) {
							params.total(data.totalElements);
							$defer.resolve(data.content);
						}
					}, function(response){
						toaster.pop('error', '获取器件列表失败', response.data);
					})
				}
			});
		};

		$scope.onSearch = function() {
			$scope.componentTableParams.page(1);
			$scope.componentTableParams.reload();
		};

		//检查有没有版本号
		if($scope.uuid){
			$scope.myshow = {
					showif:	'sl-noshow',
					hasstep: 'kind-wrap'
			}
			BrandActiveAPI.get({uuid : $stateParams.uuid}, function(data){
				$scope.brand = data;
				if (typeof $scope.brand.application != 'undefined')
					$scope.brand.applications = $scope.brand.application.split(",");
				getKinds(data.id);
				getComponents(data.id);
			}, function(data){
				toaster.pop('error', '系统异常', '获取品牌有效版本信息异常');
			});
		}
		
		// 选择或取消库存量为0的器件
		$scope.filterNoReserveZero = function() {
			$scope.componentTableParams.page(1);
			$scope.componentTableParams.reload();
		}
		
		// 选择或取消类目筛选
		$scope.selectKind = function(kind, step) {
			if(step == -1) {
				$scope.activeKinds = [];
				$scope.kinds = kinds_all[0];
				$scope.step = 0;
			} else {
				$scope.activeKinds = $scope.activeKinds.slice(0, step);// 取消时需要去掉后面的已选择类目
				$scope.activeKinds.push(kind);
				if(kind.leaf) {// 叶子节点
					$scope.kinds = null;
				} else {// 非叶子节点
					$scope.step = step + 1;
					$scope.kinds = [];
					for(var i in kinds_all[$scope.step]) {
						var k = kinds_all[$scope.step][i];
						if(k.parentid == kind.id) {
							$scope.kinds.push(k);
						}
					}
				}
			}
			if(!$scope.kinds) {
				$scope.myshow.hasstep = "kind-nowrap";
			} else {
				$scope.myshow.hasstep = "kind-wrap";
			}
			$scope.componentTableParams.page(1);
			$scope.componentTableParams.reload();
		};
		
		// 收藏器件
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
		}
		
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
		
		//加入购物车
		$scope.addToCart = function(uuid, isBuy, value){
			if(!$rootScope.userInfo || !$rootScope.userInfo.userUU) {
				AuthenticationService.redirectSignin();
				return;
			}
			//唤起此器件批次选择的模态框
			var modalInstance = $modal.open({
				templateUrl : 'static/view/prod/product_goodChoose_modal.html',  //指向上面创建的视图
	            controller : 'GoodChooseCtrl',// 初始化模态范围
	            size : 'lg', //大小配置
	            resolve : {
	            	uuid : function(){
                    	//必须用 angular.copy深拷贝一份
                        return angular.copy(uuid);
                    },
                    isBuy : function(){
                    	//必须用 angular.copy深拷贝一份
                        return angular.copy(isBuy);
                    },
                    value : function(){
                    	if (null == value){
                    		return {};
                    	} else {
                    		//如果value有值，必须用angular.cope深拷贝一份
                    		return angular.copy(value);
                    	}
                    }
                }
	        });
	        modalInstance.opened.then(function(){
	        	
	        });
	        modalInstance.result.then(function(orderid){
	        	//是否立即购买的判断
	        	if(isBuy){
	        		$location.path("orderEnsure/" + orderid);
	        	}
	        }, function(reason){
	        	
	        });
		};
		
	}]);
	
	app.register.filter('filterBiggerRerserveZero', function() {
		return function(components) {
			var array = [];
			angular.forEach(components, function(component) {
				if(component.reserve > 0) {
					array.push(component);
				}
			});
			return array;
		}
	});
	
});