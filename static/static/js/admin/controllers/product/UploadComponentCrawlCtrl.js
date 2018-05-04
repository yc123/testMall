define(['app/app'], function(app) {
	'use strict';
	app.register.controller('UploadComponentCrawlCtrl', ['$scope', 'Search', '$modal', '$window', '$upload', 'toaster', function($scope, Search, $modal, $window, $upload, toaster) {
		$scope.attachFile = {};
		$scope.attach = {};
		
		// 获取末级类目联想词
		$scope.getSimilarKinds = function(name) {
			if (name) {
				return Search.getSimilarLeafKinds({keyword: name}).$promise.then(function(data) {
					return data.map(function(item) {
						return item;
					})
				})
			}
		};

		// 规格书上传成功之后
		$scope.onAttachUploadSuccess = function(data){
			$scope.$apply(function() {
				$scope.attachFile = data;
				$scope.attach = data.path;
				if($scope.attachFile.size >= 1024 * 1024) {
					$scope.attachFile.size = $filter('number')($scope.attachFile.size / 1024 / 1024, 1) + 'Mb';
				} else if($scope.attachFile.size >= 1024) {
					$scope.attachFile.size = $filter('number')($scope.attachFile.size / 1024, 1) + 'Kb';
				} else {
					$scope.attachFile.size = $scope.attachFile.size + 'b';
				}
				toaster.pop('success', '上传成功');
				$scope.$uploading = false;
			});
		};

		// 重新上传，取消重新上传
		$scope.reUpload = function() {
			$scope.$uploading = !$scope.$uploading;
		};

		// 删除已上传的文件
		$scope.removeAttach = function() {
			delete $scope.attachFile;
			delete $scope.attach;
			$scope.$uploading = true;
		};
		
		// 点击联想词获取类目信息
		$scope.onAssociateKindClick = function(kind) {
			$scope.kindid = kind.id;
			$scope.activesString = kind.nameCn;
		}
		
		// 选择类目
	    $scope.selectKind = function() {
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
				var activesString = "";
				var size = data.actives.length;
				for(var i = 0; i < size; i++){
					if(i == 0){
						activesString = data.actives[i].nameCn;
					}
					else{
						activesString = activesString + " > " + data.actives[i].nameCn;	
					}
				}
				$scope.activesString = activesString;
				$scope.kindid = data.active.id;
			}, function(){
				
			});
		};
		
		// 下载标准参数
		$scope.download = function() {
			$window.open("product/kind/kindProperty/download/" + $scope.kindid);
		}
		
		// 上传数据
		$scope.upload = function() {
			var file = $scope.myFiles[0];
			$upload.upload({
				url: 'produce/componentSubmit/upload/componentCrawls',
				file: file,
				method: 'POST'
			}).success(function(data) {
				if(data.code == 405) {
					var kindContrastId = data.data;
					$modal.open({
						animation: true,
						size: 'md',
						templateUrl: 'static/view/prod/modal/product_checkKindContrast_modal.html',
						controller: 'CheckKindContrastCtrl',
						resolve: {
							kindContrastId : function() {
								return kindContrastId;
							}
						}
					}).result.then(function(data){
						if (data) {
							uploadToSame(file,	kindContrastId);
						}
					}, function(){
						return;
					});
				} else {
					toaster.pop('success', '提示', '成功上传' + data.data + '条');
					// window.location.reload();
				}
			}).error(function(response) {
				toaster.pop('error', '提示', response);
			});
		};
		
		// 确认继续上传数据
		var uploadToSame = function(myFile, kindContrastId) {
			$upload.upload({
				url: 'produce/componentSubmit/upload/componentCrawlsWithSame/' + kindContrastId,
				file: myFile,
				method: 'POST'
			}).success(function(data) {
				toaster.pop('success', '提示', '成功上传' + data.data + '条');
				// window.location.reload();
			}).error(function(response) {
				toaster.pop('error', '提示', response);
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
					toaster.pop('error', '获取子类目失败', response);
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
	
	// 参数对应关系确认模态框
	app.register.controller('CheckKindContrastCtrl', ['$scope', 'toaster', '$modalInstance', 'kindContrastId', '$window', function($scope, toaster, $modalInstance, kindContrastId, $window) {
		// 确认上传
		$scope.confirm = function() {
			$modalInstance.close(true);
		};
		
		//查看参数对应关系
		$scope.check = function() {
			$window.open("#/audit/kindContrast/" + kindContrastId);
		};
		
		$scope.cancel = function() {
			$modalInstance.dismiss();
		};
	}]);
});