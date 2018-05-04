define([ 'app/app' ], function(app) {
	'use strict';
	app.register.controller('KindPropertyAdviceCtrl', ['$scope', 'KindAPI', '$stateParams', '$modal', 'PropertyAdvice', 'toaster', function($scope, KindAPI, $stateParams, $modal, PropertyAdvice, toaster) {
		if($stateParams.kindId) {
			$scope.active = {id: $stateParams.kindId};
			$scope.advice = {kindId: $stateParams.kindId};
			KindAPI.getParents({childId: $stateParams.kindId}, function(data) {
				$scope.actives = data;
			}, function(response) {
				toaster.pop('error', '错误', '获取类目信息失败');
			});
		}
		
		// 重新选择类目
		$scope.changeKind = function() {
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
				$scope.advice = {kindId: data.id};
			}, function(){
				
			});
		};
		
		// 提交调整建议
		$scope.submit = function() {
			PropertyAdvice.save({}, $scope.advice, function(data) {
				toaster.pop('success', '提交成功');
				$scope.advice = {kindId: $scope.advice.kindId};
			}, function(response) {
				toaster.pop('error', '提交失败 ' + response);
			});
		};
		
	}]);
	
	app.register.controller('KindChooseCtrl', ['$scope', 'Kind', 'actives', 'toaster', '$modalInstance', function($scope, Kind, actives, toaster, $modalInstance) {
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
			// 是否选到了子节点
			$scope.enableNext = item.isLeaf;
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
				KindAPI.getChildren({parentId: v.parentId}, function(data) {
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
			var a = {
				active: $scope.active,
				actives: $scope.actives
			};
			$modalInstance.close(a);
		};
		
	}]);
	
});