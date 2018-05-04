define([ 'app/app' ], function(app) {
	'use strict';
	app.register.controller('KindCtrl', ['$scope', 'toaster', '$modal', 'Kind', '$location', '$stateParams', 'KindAPI', function($scope, toaster, $modal, Kind, $location, $stateParams, KindAPI) {
		$scope.kinds = [[],[],[],[]];// 存放各级分类，最多四级
		
		/**
		  *  获取子类目
		  */
		var getChildren = function(pid, deep) {
			KindAPI.getChildren({parentId: pid}, function(data) {
				$scope.kinds[deep] = data;
			}, function(response) {
				toaster.pop('error', '获取类目信息失败 ' + response);
			});
		};
		
		/**
		 * 改变节点选中状态
		 */
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
			// 是否选到了子节点
			$scope.enableNext = item.isLeaf;
			// 当前可操作的层级
			if(deep < 3) {
				$scope.activeDeep = deep + 1;
			}
		};
		
		/**
		 * 选择节点
		 * @param item 节点
		 * @param deep 级别
		 */
		$scope.onItemClick = function(item, deep) {
			changeStatus(item, deep);
			if (!item.isLeaf) {
				getChildren(item.id, deep + 1);
			}
		};
		
		// 点击编辑按钮
		$scope.onEditClick = function(item) {
			$modal.open({
				animation: true,
				templateUrl: 'static/view/prod/product_kind_edit.html',
				controller: 'KindEditCtrl',
				resolve: {
					kind: function() {
						return item;
					}
				}
			}).result.then(function(){
				
			});
		};
		
		// 点击增加按钮
		$scope.onAddClick = function(deep) {
			var item;
			if(deep) {
				item = $scope.actives[deep - 1];
			} else {
				item = 0;
			}
			$modal.open({
				animation: true,
				templateUrl: 'static/view/prod/product_kind_add.html',
				controller: 'KindAddCtrl',
				resolve: {
					parent: function() {
						return item;
					}
				}
			}).result.then(function() {
				if(item.isLeaf) reload(deep - 1);
				reload(deep);
			});
		};
		
		// 上移排序操作
		$scope.onUpClick = function(item, pre, deep) {
			Kind.exchangeNumber({
				preId: pre.id,
				postId: item.id
			}, {}, function(data){
				reload(deep);
			}, function(response){
			});
		};
		
		// 下移排序操作
		$scope.onDownClick = function(item, post, deep) {
			Kind.exchangeNumber({
				preId: item.id,
				postId: post.id
			}, {}, function(data){
				reload(deep);
			}, function(response){
			});
		};
		
		// 删除节点操作
		$scope.onDeleteClick = function(item, deep) {
			$modal.open({
				animation: true,
				templateUrl: 'static/view/prod/product_kind_delete.html',
				controller: 'KindDeleteCtrl',
				resolve: {
					kind: function() {
						return item;
					}
				}
			}).result.then(function() {
				reload(deep);
			});
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
		reload();
		
	}]);
	
	// 编辑修改类目
	app.register.controller('KindEditCtrl', ['$scope', '$modalInstance', 'kind', 'Kind', 'toaster', function($scope, $modalInstance, kind, Kind, toaster) {
		$scope.kind = kind;
		$scope.cancel = function() {
			$modalInstance.dismiss();
		};
		$scope.save = function() {
			Kind.update({
				kindId: $scope.kind.id
			}, {
				nameCn: $scope.kind.nameCn,
				nameEn: $scope.kind.nameEn
			}, function(data) {
				toaster.pop('success', '编辑成功');
				$modalInstance.close();
			}, function(response) {
				toaster.pop('error', '编辑失败 ' + response);
			});
			
		};
	}]);
	
	// 新增类目
	app.register.controller('KindAddCtrl', ['$scope', '$modalInstance', 'parent', 'Kind', 'toaster', function($scope, $modalInstance, parent, Kind, toaster) {
		$scope.parent = parent;
		$scope.cancel = function() {
			$modalInstance.dismiss();
		};
		$scope.save = function() {
			Kind.save({
				parentId: $scope.parent ? $scope.parent.id : 0
			}, {
				nameCn: $scope.kind.nameCn,
				nameEn: $scope.kind.nameEn
			}, function(data) {
				toaster.pop('success', '新增类目成功');
				$modalInstance.close();
			}, function(response) {
				toaster.pop('error', '新增类目失败 ' + response.data);
			});
			
		};
	}]);
	
	// 删除类目
	app.register.controller('KindDeleteCtrl', ['$scope', '$modalInstance', 'kind', 'Kind', 'toaster', function($scope, $modalInstance, kind, Kind, toaster) {
		$scope.kind = kind;
		$scope.cancel = function() {
			$modalInstance.dismiss();
		};
		$scope.save = function() {
			Kind.remove({
				kindIds: $scope.kind.id
			}, {
				
			}, function(data) {
				toaster.pop('success', '删除类目成功');
				$modalInstance.close();
			}, function(response) {
				toaster.pop('error', '删除类目失败 ' + response.data);
			});
			
		};
	}]);
	
});