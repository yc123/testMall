define([ 'app/app' ], function(app) {
	'use strict';
	app.register.controller('MoveCmpCtrl', ['$scope', '$modal', 'KindAPI', 'BaseService', 'ngTableParams', 'toaster', '$filter', 'ComponentActiveAPI', 'ComponentActive', '$window', function($scope, $modal, KindAPI, BaseService, ngTableParams, toaster, $filter, ComponentActiveAPI, ComponentActive, $window) {
		$scope.choosedKind = false;
		$scope.serach = {};
		// 选择类目
		$scope.selectKind = function() {
			$modal.open({
				animation: true,
				size: 'lg',
				templateUrl: 'static/view/prod/product_kindChoose_modal.html',
				controller: 'KindChooseCtrl',
			}).result.then(function(data){
				$scope.kindId = data;
				$scope.choosedKind = true;
				// 获取当前类目的类目路径
				$scope.active = {id: $scope.kindId};
				KindAPI.getParentsWithBothers({childId: $scope.kindId}, function(data) {
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
					getComponent();
				}, function(response) {
					toaster.pop('error', '错误', '获取类目信息失败', response);
				});
				
			}, function(){
				
			});
		}
		
		// 重新选择
		$scope.refresh = function() {
			$scope.kindId = null;
			$scope.choosedKind = false;
			$scope.filters = {};
		}
		
		$scope.filters = {};// 筛选器, {brandId: 11, pv_001: xxx, pv_002: yyy}
		$scope.kind = {};
		
		// 筛选品牌
		$scope.selectBrand = function(b) {
			if(b) {
				$scope.kind.selectedBrand = b;
				$scope.filters.brandid = b.id;
			} else {
				delete $scope.kind.selectedBrand;
				delete $scope.filters.brandid;
			}
			$scope.componentsTableParams.reload();
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
			$scope.componentsTableParams.reload();
		};
		
		// 搜索原厂型号
		$scope.onSearch = function() {
			$scope.componentsTableParams.reload();
		}
		
		// 获取器件数据
		var getComponent = function() {
			$scope.componentsTableParams = new ngTableParams({
				page : 1,
				count : 10
			}, {
				total : 0,
				getData : function($defer, params) {
					$scope.paginationParams = params;
					var pageParams = params.url();
					pageParams.filter = {};
					pageParams.filter.kindid = $scope.kindId;
					pageParams.filter.code = $scope.serach.keyword;
					if($scope.filters.brandid) {// 品牌筛选
						pageParams.filter.brandid = $scope.filters.brandid;
					}
					// 属性值筛选
					if($scope.filters.properties && Object.keys($scope.filters.properties).length) {
						pageParams.filter.properties = angular.toJson($scope.filters.properties);
					}
					ComponentActiveAPI.getInfoPage(BaseService.parseParams(pageParams), function(data) {
						$scope.allCheck = false;
						$defer.resolve(data.content);
						params.total(data.totalElements);
					}, function(res) {
						toaster.pop('error', '获取信息失败 ', res.data);
					});
				}
			});	
		}
		
		// 全选器件
		$scope.allCheck = false;
		$scope.selectAll = function() {
			$scope.allCheck = !$scope.allCheck;
			angular.forEach($scope.componentsTableParams.data, function(cmp) {
				cmp.check = $scope.allCheck;
			});
		}
		
		// 单选器件
		$scope.select = function(cmp) {
			cmp.check = !cmp.check;
			checkAll();
		}
		
		// 检查是否全选
		var checkAll = function() {
			var isSelect = true;
			angular.forEach($scope.componentsTableParams.data, function(cmp) {
				isSelect = isSelect && cmp.check;
			});
			$scope.allCheck = isSelect;
		}
		
		// 转移类目
		$scope.moveCmp = function() {
			var list = [];
			angular.forEach($scope.componentsTableParams.data, function(cmp) {
				if (cmp.check) {
					list.push(cmp.uuid);
				}
			});
			var uuids = list.join('-');
			selectKind(uuids);
		}
		
		// 选择类目
	    var selectKind = function(uuids) {
			$modal.open({
				animation: true,
				size: 'lg',
				templateUrl: 'static/view/prod/product_kindChoose_modal.html',
				controller: 'KindChooseCtrl',
			}).result.then(function(data){
				$scope.moveTo = data;
				ComponentActive.moveCmp({uuids : uuids, kindId : $scope.moveTo}, {}, function(data) {
					toaster.pop('success', '提示', '修改成功');
					$window.location.reload();  
				}, function(res) {
					toaster.pop('error', '提示', res.data);
				})
			}, function(){
				
			});
		};
	}]);
	
	//类目选择模态框
	app.register.controller('KindChooseCtrl', ['$scope', 'KindAPI', 'toaster', '$modalInstance', function($scope, KindAPI, toaster, $modalInstance) {
		$scope.kindId = null;
		$scope.kinds = [[], [], [], []];
		// 获取子类目
		var getChildren = function(pid, deep) {
			KindAPI.getChildren({parentId: pid}, function(data) {
				$scope.kinds[deep] = data;
			}, function(response) {
				toaster.pop('error', '获取子类目失败', response.data);
			});
		};
		
		// 改变节点选中状态
		var changeStatus = function(item, deep) {
			var kindId = null, level = 0;
			angular.forEach($scope.kinds, function(ks, i) {
				if(i > deep) {
					$scope.kinds[i] = [];
				} else {
					angular.forEach(ks, function(k, j) {
						if(i == deep) {
							if(k.id == item.id) {
								$scope.kinds[i][j].$active = true;
								kindId = k.id;
							} else {
								k.$active = null;
							}
						}
					});
				}
			});
			// 选择的节点
			$scope.kindId = kindId;
			$scope.active = item;
			// 当前可操作的层级
			if(deep < 3) {
				$scope.activeDeep = deep + 1;
			}
		};
		
		// 节点点击后获取子类目，节点被选中
		$scope.onItemClick = function(item, deep) {
			changeStatus(item, deep);
			if (!item.isLeaf) {
				getChildren(item.id, deep + 1);
			}
		};
		
		// 重新加载数据
		function reload(deep) {
			var pid;
			if(deep) {
				pid = $scope.actives[deep - 1].id;
			} else {
				pid = 0;
				deep = 0;
			}
			getChildren(pid, deep);
		}
		
		// 初始加载数据，获取第一层的类目
		if($scope.actives) {
			angular.forEach($scope.actives, function(v, k) {
				KindAPI.getChildren({parentId: v.parentid}, function(data) {
					$scope.kinds[k] = data;
					angular.forEach($scope.kinds[k], function(kind, i){
						if(kind.id == v.id) {
							$scope.kinds[k][i].$active = true;
							$scope.actives[k] = $scope.kinds[k][i];
						}
					})
				}, function(response) {
					toaster.pop('error', '获取子类目失败', response.data);
				});
			});
		} else {
			reload();
		}
		
		// 取消
		$scope.cancel = function() {
			$modalInstance.dismiss();
		};
		
		// 确认选择
		$scope.check = function() {
			$modalInstance.close($scope.kindId);
		};
	}]);
});