define([ 'app/app' ], function(app) {
	//品牌审批
	app.register.controller('AuditBrandDetailCtrl', ['$scope', 'ngTableParams', 'BrandSubmit', 'BrandActive', 'BaseService', '$stateParams','toaster', '$location', 'ArrayUtil', '$modal', function($scope, ngTableParams, BrandSubmit, BrandActive, BaseService, $stateParams, toaster, $location, ArrayUtil, $modal) {
		
		// 可选的区域
		$scope.areas = [{name:'大陆'}, {name:'港澳台'}, {name:'日韩'}, {name:'欧美'}];
		// 可选的应用领域
		$scope.applications = [{name: '移动手持'}, {name: '医疗电子'}, {name: '消费电子'}, {name: '通信网络'}, {name: '汽车电子'}, {name: '能源控制'}, {name: '家用电器'}, {name: '工业控制'}, {name: '安防监控'}];
		
		// 处理区域
		var parseArea = function(a) {
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
		
		// 处理应用领域
		var parseApplications = function(a) {
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
		};
		
		/**
		 * 品牌审批详情
		 */
		//1、根据路由地址获取品牌提交信息
		BrandSubmit.get({id : $stateParams.id}, {}, function(data){
			$scope.BrandSubmitData = data;
			$scope.imageUrl = $scope.BrandSubmitData.logoUrl;
			if ($scope.BrandSubmitData.area)
				parseArea($scope.BrandSubmitData.area);
			if ($scope.BrandSubmitData.application)
				parseApplications($scope.BrandSubmitData.application);
		}, function(res){
			toaster.pop('error', '审批详情数据加载失败', res.data);
		});
		
		// 选择Logo图片
		$scope.showImageDialog = function(model) {
			require([ 'jquery-uploadify' ], function() {
				$modal.open({
					templateUrl : 'offer/image/insert.html',
					controller : 'ImageInsertCtrl',
					backdrop : 'static'
				}).result.then(function(image){
					$scope.BrandSubmitData.logoUrl = image.src;
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
		
		//审核通过
		$scope.BrandSubmitvalid = function(){
			var brand = angular.copy($scope.BrandSubmitData);
			
			// 组装区域
			var myAreas = [];
			angular.forEach($scope.areas, function(area) {
				if (area.checked) {
					myAreas.push(area.name);
				}
			});
			angular.forEach($scope.extraAreas, function(data) {
				myAreas.push(data.name);
			})
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
			})
			
			brand.application = myApp.join(',');
			
			if (!(brand.nameEn  && brand.url && brand.brief && brand.series)) {
				toaster.pop('error', '警告', "请将信息填写完整");
				return;
			}

			if(!brand.auditOpinion){
				 brand.auditOpinion = "审核通过";
			}
			
			BrandSubmit.valid({}, brand, function(data){
				if (data.version == -1) {
					var  isUpdate = confirm('品牌' + brand.nameCn + ' · ' + brand.nameEn + '已存在，是否更新？');
					if(isUpdate){
						brandAuditUpdate(brand);
					}
				} else if (data.version == 0) {
					var  isUpdate = confirm('品牌' + brand.nameCn + ' · ' + brand.nameEn + '与现版本品牌名不一致，是否更新？');
					if(isUpdate){
						brandAuditUpdate(brand);
					}
				} else if (data.version == -2) {
					var  isUpdate = confirm('品牌' + brand.nameCn + ' · ' + brand.nameEn + '与现版本品牌版本信息不一致，是否更新？');
					if(isUpdate){
						brandAuditUpdate(brand);
					}
				} else {
					toaster.pop('success', '处理成功', '【' + $scope.BrandSubmitData.nameEn + '】' + '通过审批');
					$location.path('/audit/brand');
				}
			}, function(res){
				console.log(res);
				toaster.pop('error', '提交失败', res.data);
			});
		};
		
		var brandAuditUpdate = function(brand) {
			BrandSubmit.validUpdate({}, brand, function(data) {
				toaster.pop('success', '处理成功', '【' + $scope.BrandSubmitData.nameCn + '】' + '通过审批');
				$location.path('/audit/brand');
			}, function(res){
				console.log(res);
				toaster.pop('error', '提交失败', res.data);
			});
		}
		
		//审核不通过
		$scope.BrandSubmitinvalid = function(id, auditOpinion){
			if(!auditOpinion){
				toaster.pop('error', '请填写审核意见', '审核不通过时审核意见不能为空');
			}else{
				BrandSubmit.invalid({id : id}, {auditOpinion: auditOpinion}, function(data){
					toaster.pop('success', '处理成功', '【' + $scope.BrandSubmitData.nameCn + '】' + '未通过审批');
					$location.path('/audit/brand');
				}, function(res){
					toaster.pop('error', '提交失败', res.data);
				});
			}
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