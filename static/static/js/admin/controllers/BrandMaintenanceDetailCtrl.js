define([ 'app/app' ], function(app) {
	//品牌审批
	app.register.controller('BrandMaintenanceDetailCtrl', ['$scope', 'ngTableParams', 'BrandActive' , 'BrandSubmit' , 'BaseService', '$stateParams','toaster', '$location', 'ArrayUtil', '$modal', function($scope, ngTableParams, BrandActive, BrandSubmit, BaseService, $stateParams, toaster, $location, ArrayUtil, $modal) {
		
		// 可选的区域
		$scope.areas = [{name:'大陆'}, {name:'港澳台'}, {name:'日韩'}, {name:'欧美'}];
		// 可选的应用领域
		$scope.applications = [{name: '移动手持'}, {name: '医疗电子'}, {name: '消费电子'}, {name: '通信网络'}, {name: '汽车电子'}, {name: '能源控制'}, {name: '家用电器'}, {name: '工业控制'}, {name: '安防监控'}];
		
		// 处理区域
		var parseArea = function(a) {
			if (a) {
				var arr = a.split(',');
				angular.forEach(arr, function(app) {
					var contained = false;
					angular.forEach($scope.areas, function($app) {
						if($app.name == app) {
							$app.checked = true;
							contained = true;
						}
					});
					if(!contained) {
						$scope.areas.push({name: app, checked: true});
					}
				});
			}
		};
		
		// 处理应用领域
		var parseApplications = function(a) {
			if (a) {
				var arr = a.split(',');
				angular.forEach(arr, function(app) {
					var contained = false;
					angular.forEach($scope.applications, function($app) {
						if($app.name == app) {
							$app.checked = true;
							contained = true;
						}
					});
					if(!contained) {
						$scope.applications.push({name: app, checked: true});
					}
				});
			}
		};
		
		/**
		 * 品牌更新详情
		 */
		// 根据路由地址获取品牌提交信息
		BrandActive.get({uuid : $stateParams.uuid}, {}, function(data){
			$scope.BrandActiveData = data;
			$scope.name = {
				nameCn: data.nameCn,
				nameEn: data.nameEn
			};
			$scope.BrandActiveData.modifyuu = null;
			$scope.imageUrl = $scope.BrandActiveData.logoUrl;
			parseArea($scope.BrandActiveData.area);
			parseApplications($scope.BrandActiveData.application);
		}, function(res){
			toaster.pop('error', '品牌详情数据加载失败', res.data);
		});
		
		// 验证品牌名是否存在
		$scope.nameExist = false;
		$scope.exist = function(type){
			var brand = angular.copy($scope.BrandActiveData);
			var param = {
				name: '1',
				id: brand.id,
				nameCn: brand.nameCn,
				nameEn: brand.nameEn
			};
			BrandActive.nameExist(param, function(data) {
				if (data.length > 0) {
					$scope.nameExist = true;
					toaster.pop("error","提示","该品牌名已存在，若确认输入无误请查找对应品牌进行修改！");
				} else {
					$scope.nameExist = false;
				}
			}, function(response) {
			});
		};
		
		// 选择Logo图片
		$scope.showImageDialog = function(model) {
			require([ 'jquery-uploadify' ], function() {
				$modal.open({
					templateUrl : 'offer/image/insert.html',
					controller : 'ImageInsertCtrl',
					backdrop : 'static'
				}).result.then(function(image){
					$scope.BrandActiveData.logoUrl = image.src;
					$scope.imageUrl = image.thumb;
				});
			});
		};
		// 额外区域
		$scope.extraAreas = [];
		// 添加额外区域
		$scope.addExtraAreas = function() {
			if($scope.extraAreas.length >= 5) {
				toaster.pop('warning', '警告', '最多能添加5个额外应用！');
			}
			else {
				$scope.extraAreas.push({name: null});
			}
				
		};
		// 删除额外区域
		$scope.removeExtraAreas = function(index) {
			$scope.extraAreas.splice(index, 1);
		};
		
		// 额外应用
		$scope.extraApp = [];
		// 添加额外应用
		$scope.addExtraApp = function() {
			if($scope.extraApp.length >= 5) {
				toaster.pop('warning', '警告', '最多能添加5个额外应用！');
			}
			else {
				$scope.extraApp.push({name: null});
			}
		};
		// 删除额外应用
		$scope.removeExtraApp = function(index) {
			$scope.extraApp.splice(index, 1);
		};
		
		// 更新品牌信息
		$scope.brandUpdate = function(){
			var brand = angular.copy($scope.BrandActiveData);
			
			// 组装区域
			var myAreas = [];
			angular.forEach($scope.areas, function(area) {
				if (area.checked) {
					myAreas.push(area.name);
				}
			});
			angular.forEach($scope.extraAreas, function(data) {
				myAreas.push(data.name);
			});
			brand.area = myAreas.join(',');
			
			// 组装应用领域
			var myApp = [];
			angular.forEach($scope.applications, function(data) {
				if (data.checked) {
					myApp.push(data.name);
				}
			});
			angular.forEach($scope.extraApp, function(data) {
				myApp.push(data.name);
			});
			
			brand.application = myApp.join(',');
			
			if (!(brand.application && brand.logoUrl && brand.area)) {
				toaster.pop('error', '警告', "请将信息填写完整");
				return;
			}
			
			BrandSubmit.submit({},brand,function(data){
				toaster.pop('success', '提示', "更新成功");
				window.location.replace('#/brandmaintenance');
			},function(res){
				toaster.pop('error', '警告', res.data);
			});
		};
	
	}]);
	
	app.register.controller('ImageInsertCtrl', ['$scope', '$modalInstance', function($scope, $modalInstance) {
		$scope.image = {src: null};
		// 图片上传成功之后
		$scope.onUploadSuccess = function(data){
			var path = data.path;
			path = path.substring(0, path.lastIndexOf('.')) + "_150x90" + path.substr(path.lastIndexOf('.'));
			$scope.$apply(function(){
				$scope.image.src = data.path;
				$scope.image.thumb = path;
			});
		};
		$scope.close = function() {
			$modalInstance.dismiss();
		};
		$scope.confirm = function() {
			$modalInstance.close($scope.image);
			$scope.imageUrl = null;
		};
	}]);
});