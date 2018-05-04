define([ 'app/app' ], function(app) {
	'use strict';
	app.register.controller('PropertiesCtrl', ['$scope', 'toaster', 'Property', 'ngTableParams', 'BaseService', '$modal', function($scope, toaster, Property, ngTableParams, BaseService, $modal) {
		$scope.keyword = '';
		$scope.propertiesTableParams = new ngTableParams({
			page : 1,
			count : 10,
		}, {
			total : 0,
			getData : function($defer, params) {
				$scope.paginationParams = params;
				var param = BaseService.parseParams(params.url());
				param.keyword = $scope.keyword;
				Property.getPropertiesPage(param, function(page) {
					if (page) {
						params.total(page.totalElements);
						$defer.resolve(page.content);					}
				});
			}
		});
		
		$scope.onSearch = function(){
			$scope.propertiesTableParams.reload();
		}
		
		// 打开属性编辑模态框
		var openModal = function(id) {
			var modalInstance = $modal.open({
	            templateUrl : 'static/view/prod/modal/property_edit_modal.html',  //指向上面创建的视图
	            controller : 'PropertyEditModalCtrl',// 初始化模态范围
	            size : 'sm', // 大小配置
	            resolve: {
	            	id: function() {
						return id;
					}
				}
	        });
	        modalInstance.opened.then(function(){// 模态窗口打开之后执行的函数  
	        	
	        });  
	        modalInstance.result.then(function(updatedProperty){
	        	$scope.propertiesTableParams.reload();
	        }, function(res){
	        });
		}
		
		// 添加属性
		$scope.add = function() {
			openModal(null) ; 
		}
		
		// 编辑属性
		$scope.edit = function(id) {
			openModal(id);
		}
	}]);
	
	// 修改类目属性详细值页面的Controller
	app.register.controller('PropertyEditModalCtrl', ['$scope', '$modalInstance', 'Property', 'id', 'toaster', function($scope, $modalInstance, Property, id, toaster) {
		if (id) {
			Property.get({id : id}, function(data) {
				$scope.property = data
			}, function(res) {
				toaster.pop('error', '提示', '获取属性信息失败，请刷新页面');
			});
		}
		// 取消
		$scope.cancel = function() {
			$modalInstance.dismiss();
		}
		// 确认
		$scope.confirm = function() {
			// 更新属性
			if ($scope.property.id) {
				Property.update({}, $scope.property, function(data) {
					toaster.pop('success', '提示', '修改属性成功');
					$modalInstance.close();
				}, function(res) {
					toaster.pop('error', '提示', res.data);
				});
			} else {
				Property.add({}, $scope.property, function(data) {
					toaster.pop('success', '提示', '添加属性成功');
					$modalInstance.close();
				}, function(res) {
					toaster.pop('error', '提示', res.data);
				});
			}
		};
	}]);
});