define([ 'app/app' ], function(app) {
	'use strict';
	app.register.controller('KindDetailCtrl', ['$scope', '$rootScope', 'KindAPI', '$stateParams', '$modal', 'ComponentActiveAPI', 'ComponentActive' ,'BaseService', 'ngTableParams', 'toaster', 'Compare', 'isPutOn', '$location', 'AuthenticationService', 'SessionService', 'collectionService', 'Search', '$filter', '$window', function($scope, $rootScope, KindAPI, $stateParams, $modal, ComponentActiveAPI, ComponentActive , BaseService, ngTableParams, toaster, Compare, isPutOn, $location, AuthenticationService, SessionService, collectionService, Search, $filter, $window) {
		$scope.isPutOn = isPutOn;// false为普通查看模式，true为供应商发布产品模式
		var enIdFilter = $filter('EncryptionFilter');
		$scope.kindId = $stateParams.id;
		$scope.kindPropertyFilter = {};
		$scope.filters = {};// 筛选器, {brandId: 11, pv_001: xxx, pv_002: yyy}
		
		$scope.kind = {};
		
		// 选择属性筛选条件
		$scope.propertySelect = function(key, value) {
			$scope.kindPropertyFilter[key] = value;
		}
		
		$scope.noReserveZero = false;
		
		//筛选库存量是否大于0
		$scope.filterNoReserveZero = function() {
			$scope.componentTableParams.reload();
		}
		
		$scope.otherConstraints = {};
		
		// 属性条件筛选
		$scope.kindPropertySearch = function() {
			var kindProperty = {};
			for(var key in $scope.kindPropertyFilter) {
				if(!angular.equals($scope.kindPropertyFilter[key], "未选中")) {
					kindProperty[key] = $scope.kindPropertyFilter[key];
				}
			}
			if(angular.equals(angular.toJson(kindProperty), "{}")) {
				$scope.getOriginalData();
			}else {
				var propertyParams = {};
				propertyParams.properties = angular.toJson(kindProperty);
				propertyParams.useruu = $rootScope.userInfo.userUU;
				propertyParams.ki_name = $scope.ki_name;
				$scope.componentTableParams.parameters({
					page : 1,
					count : 10
				});
				$scope.componentTableParams.settings({
					total : 0,
					getData : function($defer, params) {
						$scope.paginationParams = params;
						propertyParams.page = params.page();
						propertyParams.count = params.count();
						if($scope.noReserveZero) {
							$scope.otherConstraints.reserve = 0;
						}else {
							$scope.otherConstraints.reserve = -1;
						}
						propertyParams.otherConstraints = angular.toJson($scope.otherConstraints);
						searchService.kindPropertySearch(propertyParams, function(data) {
							$defer.resolve(data.components);
							params.total(data.resultCount);
						}, function(res) {
							toaster.pop('error', '获取信息失败 ', res.data);
						})
					}
				});
				$scope.componentTableParams.reload();
			}
		}
		
		// 重置属性筛选条件
		$scope.reset = function() {
			for(var key in $scope.kindPropertyFilter) {
				$scope.kindPropertyFilter[key] = '未选中';
			}
			$scope.kindPropertySearch();
		};
		
		// 点击收藏产品
		$scope.collect = function(id) {
			var obj = {'componentid': id, 'kind': 2};
			if(AuthenticationService.isAuthed()) {
				var key = $rootScope.userInfo.userUU + "-" + $rootScope.userInfo.enterprise.uu;
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
		
		// 获取初始数据
		$scope.getData = function() {
			$scope.componentTableParams = new ngTableParams({
				page : 1,
				count : 10
			}, {
				total : 0,
				getData : function($defer, params) {
					$scope.paginationParams = params;
					var pageParams = params.url();
					pageParams.filter = {};
					pageParams.filter.kindid = $scope.kindId;
					if($scope.filters.brandid) {// 品牌筛选
						pageParams.filter.brandid = $scope.filters.brandid;
					}
					// 属性值筛选
					if($scope.filters.properties && Object.keys($scope.filters.properties).length) {
						pageParams.filter.properties = angular.toJson($scope.filters.properties);
					}
					ComponentActiveAPI.getInfoPage(BaseService.parseParams(pageParams), function(data) {
						$defer.resolve(data.content);
						params.total(data.totalElements);
						// 初始化一下是否有送样
						$scope.hasSample = [];
						angular.forEach(data.content, function(component) {
							if(component.sampleQty > 0) {
								$scope.hasSample.push(false);
							}
						});
					}, function(res) {
						toaster.pop('error', '获取信息失败 ', res.data);
					});
				}
			});	
		}
		
		$scope.getData();
		
		// 获取当前类目的类目路径
		if($stateParams.id) {
			$scope.active = {id: $stateParams.id};
			KindAPI.getParentsWithBothers({childId: $stateParams.id}, function(data) {
				$scope.actives = data;
				if($scope.actives) {
					$scope.kind = $scope.actives[$scope.actives.length-1];
					// 获取类目的产品的品牌汇总
					KindAPI.getBrands({kindId: $scope.kind.id}, function(data) {
						$scope.kind.brands = data;
					});
					if(!$scope.kind.leaf) {
						// 非叶子类目获取其子类目
						KindAPI.getChildren({parentId: $scope.kind.id}, function(data){
							$scope.kind.children = data;
						});
					}
					if($scope.kind.leaf) {
						// 叶子类目获取类目属性
						KindAPI.getPropertiesValues({kindId: $scope.kind.id}, function(data) {
							$scope.kind.properties = data;
						});
					}
				}
			}, function(response) {
				toaster.pop('error', '错误', '获取类目信息失败', response);
			});
		}
		
		// 筛选品牌
		$scope.selectBrand = function(b) {
			if(b) {
				$scope.kind.selectedBrand = b;
				$scope.filters.brandid = b.id;
			} else {
				delete $scope.kind.selectedBrand;
				delete $scope.filters.brandid;
			}
			$scope.getData();
		};
		
		// 筛选属性
		$scope.selectProperty = function(p, v) {
			if(!$scope.filters.properties) $scope.filters.properties = {};
			if(v) {
				p.selected = v;
				$scope.filters.properties[p.property.id] = v.value;
			} else {
				delete p.selected;
				delete $scope.filters.properties[p.property.id];
			}
			$scope.getData();
		};
		
		// 展开或收起更多属性筛选
		$scope.moreProperty = function() {
			if($scope.kind.morePro) {
				$scope.kind.morePro = false;
			} else {
				$scope.kind.morePro = true;
			}
		};
		
		// 更多属性值
		$scope.moreValue = function(p) {
			p.more = !p.more;
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
		
		// 点击发布产品
		$scope.putOn = function(event) {
			if(!$rootScope.userInfo || !$rootScope.userInfo.userUU) {
				AuthenticationService.redirectSignin();
				return;
			}
		}
		
		// 加入购物车
		$scope.addToCart = function(uuid, isBuy, value){
			if(!$rootScope.userInfo || !$rootScope.userInfo.userUU) {
				AuthenticationService.redirectSignin();
				return;
			}
			// 唤起此器件批次选择的模态框
			var modalInstance = $modal.open({
				templateUrl : 'static/view/prod/product_goodChoose_modal.html',  //指向上面创建的视图
	            controller : 'GoodChooseCtrl',// 初始化模态范围
	            size : 'lg', // 大小配置
	            resolve : {
	            	uuid : function(){
                        return angular.copy(uuid);// 必须用 angular.copy深拷贝一份
                    },
                    isBuy : function(){
                        return angular.copy(isBuy);// 必须用 angular.copy深拷贝一份
                    },
                    value : function(){
                    	if (null == value){
                    		return {};
                    	} else {
                    		return angular.copy(value);// 如果value有值，必须用angular.cope深拷贝一份
                    	}
                    }
                }
	        });
	        modalInstance.result.then(function(orderid){
	        	//是否立即购买的判断
	        	if(isBuy){
	        		window.location.replace('products#/orderEnsure/'+ orderid);
	        	}
	        }, function(reason){
	        	
	        });
		};
		
		//免费申请样品
		$scope.applySample = function(component,number) {
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