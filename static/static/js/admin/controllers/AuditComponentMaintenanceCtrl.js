define([ 'app/app' ], function(app) {
	// 器件维护
	app.register.controller('AuditComponentMaintenanceCtrl', ['$scope', 'ngTableParams', '$modal', 'BaseService','toaster', '$rootScope', '$http', 'Search',function($scope, ngTableParams, $modal, BaseService, toaster, $rootScope, $http, Search) {
		
		BaseService.scrollBackToTop();
		$scope.showHeader = false;
		
		// 表格参数
		$scope.componentTableParams = new ngTableParams({
			page : 1,
			count : 20,
		}, {
			total : 0,
			getData : function($defer, params) {
				var param = BaseService.parseParams(params.url());
				param.w = $scope.keyword;
				Search.componentSearch(param, function(page) {
					if (page) {
						params.total(page.total);
						page.content = page.components;
						$defer.resolve(page.content);
					}
				});
			}
		});
		

		// 搜索
		$scope.search = function() {
			$scope.componentTableParams.reload();
			$scope.showHeader = true ;
			$scope.actives = false;
		};
		
		// 搜索框获得焦点，显示联想框
		$scope.onFocus = function() {
			$scope.associate = true;
			$scope.selectIndex = -1;
			if(!$scope.keyword) $scope.keyword = '';
		};
		
		// 搜索框失去焦点，关闭联想框
		$scope.onBlur = function() {
			$scope.associate = false;
		};
		
		// 搜索框通过按键选取想要的联想词
		$scope.onKeyup = function() {
			if($scope.associates && $scope.associates.length) {
				if(event.keyCode == 40) { //监听到按下键
					$scope.selectIndex ++;
					if($scope.selectIndex >= $scope.associates.length) $scope.selectIndex = 0;
					$scope.keyword = $scope.associates[$scope.selectIndex];
				} else if(event.keyCode == 38) { //监听到按上键
					$scope.selectIndex --;
					if($scope.selectIndex < 0) $scope.selectIndex = $scope.associates.length - 1;
					$scope.keyword = $scope.keyword = $scope.associates[$scope.selectIndex];
				} else if(event.keyCode == 13) { //确定键
					$scope.search();
				}
			}
		};
		
		// 输入框内容变化，获取新的联想词
		$scope.onChange = function() {
			var params = {
				keyword: $scope.keyword
			};
			if($rootScope.userInfo) {
				params.userUU = $rootScope.userInfo.userUU;
			}
			$http.get('search/similarComponents', {
				params : params
			}).success(function(data){
				$scope.associates = data;// 联想词数组
				console.log(data);
			}).error(function(response) {
					
			});
		};
		
		// 点击联想词
		$scope.onAssociateClick = function(component) {
			$scope.keyword = component;
			$scope.search();
		};
		
		// 鼠标进入联想词框，不能关闭联想词框
		$scope.onAssociateEnter = function() {
			$scope.associateEnter = true;
		};
		
		// 鼠标离开联想词框，可以关闭联想词框
		$scope.onAssociateLeave = function() {
			$scope.associateEnter = false;
		};
		
		// 选择类目
		$scope.chooseKind = function() {
			$modal.open({
				animation: true,
				size: 'lg',
				templateUrl: 'static/view/prod/product_kindChoose_modal.html',
				controller: 'KindChooseCtrl',
				resolve: {
					actives: function() {
						return $scope.actives;
					}
				}
			}).result.then(function(data){
				$scope.active = data.active;
				$scope.actives = data.actives;
			}, function(){
				
			});
		};

	}]);
	
	//类目选择模态框
	app.register.controller('KindChooseCtrl', ['$scope', 'KindAPI', 'actives', 'toaster', '$modalInstance', function($scope, KindAPI, actives, toaster, $modalInstance) {
		$scope.actives = actives;
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
			var actives = [], level = 0;
			angular.forEach($scope.kinds, function(ks, i) {
				if(i > deep) {
					$scope.kinds[i] = [];
				} else {
					angular.forEach(ks, function(k, j) {
						if(i == deep) {
							if(k.id == item.id) {
								$scope.kinds[i][j].$active = true;
								actives.push(k);
							} else {
								k.$active = null;
							}
						} else {
							if(k.$active) {
								actives.push(k);
							}
						}
					});
				}
			});
			// 选择的节点
			$scope.actives = actives;
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
		};
		
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
		};
		
		// 取消
		$scope.cancel = function() {
			$modalInstance.dismiss();
		};
		
		// 确认选择
		$scope.check = function() {
			var a = {
				active: $scope.active,
				actives: $scope.actives
			};
			$modalInstance.close(a);
		};
		
	}]);
});