define([ 'app/app', 'jquery-summernote' ], function(app) {
	'use strict';
	app.register.controller('BrandEditCtrl', ['$scope', 'toaster', '$modal', '$http', '$location', '$stateParams', '$templateCache', 'BrandActive', 'BrandSubmit', 'Search', 'BrandActiveAPI', 'SessionService', function($scope, toaster, $modal, $http, $location, $stateParams, $templateCache, BrandActive, BrandSubmit, Search, BrandActiveAPI, SessionService) {

		document.title = "维护品牌信息" + "-UAS电子市场";
		
		// 可选的区域
		$scope.areas = [{value:'大陆'}, {value:'港澳台'}, {value:'日韩'}, {value:'欧美'}];
		// 可选的应用领域
		$scope.apps = [{value: '移动手持'}, {value: '医疗电子'}, {value: '消费电子'}, {value: '通信网络'}, {value: '汽车电子'}, {value: '能源控制'}, {value: '家用电器'}, {value: '工业控制'}, {value: '安防监控'}];
		
		// 处理区域
		var parseArea = function(a) {
			if(a) {
				var arr = a.split(',');
				angular.forEach(arr, function(app) {
					var contained = false;
					angular.forEach($scope.areas, function($app) {
						if($app.value == app) {
							$app.checked = true;
							contained = true;
						}
					});
					if(!contained) {
						$scope.areas.push({value: app, checked: true});
					}
				});
			}
		}
		
		// 处理应用领域
		var parseApplications = function(a) {
			if(a) {
				var arr = a.split(',');
				angular.forEach(arr, function(app) {
					var contained = false;
					angular.forEach($scope.apps, function($app) {
						if($app.value == app) {
							$app.checked = true;
							contained = true;
						}
					});
					if(!contained) {
						$scope.apps.push({value: app, checked: true});
					}
				});
			}
		};

		if($stateParams.uuid) {
			BrandActive.get({uuid : $stateParams.uuid}, {}, function(data){
				//检查对应uuid的品牌是否存在，如果不存在就跳转至新增url
				if(data.version == -1){
					toaster.pop('info', '提醒', '您将新增一个品牌信息');
					$location.path("brandEdit/");
				}
				$scope.imageUrl = data.logoUrl;
				$scope.brand = data;
				$scope.brand.modifyuu = null;
				$scope.brand.modifyTime = null;
				$scope.appArray = (data.application || '').split(',');
				angular.forEach($scope.appArray, function(app) {
					$scope.apps[app] = true;
				});
				
				document.title = data.nameCn + "-UAS电子市场";
			}, function(data){
			});
		} else if($stateParams.id) {
			BrandSubmit.get({id: $stateParams.id}, function(data) {
				$scope.brand = data;
				$scope.imageUrl = data.logoUrl;
				$scope.brand = data;
				$scope.appArray = (data.application || '').split(',');
				angular.forEach($scope.appArray, function(app) {
					$scope.apps[app] = true;
				});
				document.title = data.nameCn + "-UAS电子市场";
				delete $scope.brand.auditOpinion;
			}, function() {
				toaster.pop('error', '获取品牌信息失败');
			});
		} else {
			$scope.brand = {area: '大陆'};
			$scope.imageUrl = 'static/img/upload/cont.jpg';
			$scope.brand.nameCn = SessionService.get('brandNameCn');
			$scope.brand.nameEn = SessionService.get('brandNameEn');
		}
		
		// 获取联想词
		$scope.getSimilarBrands = function(keyword) {
			if (keyword) {
				return Search.getSimilarBrands({keyword : keyword}).$promise.then(function(data) {
					return data.map(function(item) {
						return item;
					});
				});
			}
		};
		
		// 点击选取联想词（中文名）
		$scope.onAssociateClick = function(brand) {
			$scope.brand.uuid = brand.uuid;
			BrandActiveAPI.get({uuid : $scope.brand.uuid}, {}, function(data) {
				$scope.brand = data;
				$scope.imageUrl = $scope.brand.logoUrl;
				$scope.brand.modifyuu = null;
				$scope.brand.modifyTime = null;
				parseArea($scope.brand.area);
				parseApplications($scope.brand.application);
			}, function(res) {
				toaster.pop('error', '提示', '品牌信息加载失败，请刷新界面');
			});
		};
		
		// 通过名字获取品牌信息
		$scope.getBrandName = function(name, language) {
			if (!$scope.brand.uuid) {
				if (language == 'cn' && name) {
					BrandActiveAPI.getByNameCn({nameCn : name}, {}, function(data) {
						if (data.length > 0) {
							$scope.brand = data[0];
							$scope.imageUrl = $scope.brand.logoUrl;
							$scope.brand.modifyuu = null;
							$scope.brand.modifyTime = null;
							parseArea($scope.brand.area);
							parseApplications($scope.brand.application);
						}
					}, function(res) {
					});
				}
				if (language == 'en' && name) {
					BrandActiveAPI.getByNameEn({nameEn : name}, {}, function(data) {
						if (data.length > 0) {
							$scope.brand = data[0];
							$scope.imageUrl = $scope.brand.logoUrl;
							$scope.brand.modifyuu = null;
							$scope.brand.modifyTime = null;
							parseArea($scope.brand.area);
							parseApplications($scope.brand.application);
						}
					}, function(res) {
					});
				}
			} else {
			}
		};
		
		// 额外区域
		$scope.extraAreas = [];
		// 添加额外区域
		$scope.addExtraAreas = function() {
			if($scope.extraAreas.length >= 5)
				toaster.pop('warning', '警告', '最多能添加5个额外区域！');
			else
				$scope.extraAreas.push({value: null});
		};
		// 删除额外区域
		$scope.removeExtraAreas = function(index) {
			$scope.extraAreas.splice(index, 1);
		};
		// 额外应用
		$scope.extraApp = [];
		// 添加额外应用
		$scope.addExtraApp = function() {
			if($scope.extraApp.length >= 5)
				toaster.pop('warning', '警告', '最多能添加5个额外应用！');
			else
				$scope.extraApp.push({value: null});
		};
		// 删除额外应用
		$scope.removeExtraApp = function(index) {
			$scope.extraApp.splice(index, 1);
		};
		// 选择Logo图片
		$scope.showImageDialog = function(model) {
			require([ 'jquery-uploadify' ], function() {
				$modal.open({
					templateUrl : 'offer/image/insert.html',
					controller : 'ImageInsertCtrl',
					backdrop : 'static'
				}).result.then(function(image){
					$scope.brand.logoUrl = image.src;
					$scope.imageUrl = image.thumb;
				});
			});
		};
		$scope.invalid = function() {
			return /*!$scope.brand.imageUri || */!$scope.brand.brief;
		};
		// 保存
		$scope.save = function() {
			var brand = angular.copy($scope.brand)
			// 组装区域
			var myAreas = [];
			angular.forEach($scope.areas, function(area) {
				if (area.checked == true) {
					myAreas.push(area.value);
				}
			});
			angular.forEach($scope.extraAreas, function(area) {
					myAreas.push(area.value);
			})
			brand.area = myAreas.join(',');
			// 组装应用领域
			var myApps = [];
			angular.forEach($scope.apps, function(app){
				if(app.checked == true)
					myApps.push(app.value);
			});
			angular.forEach($scope.extraApp, function(app){
				myApps.push(app.value);
			});
			brand.application = myApps.join(',');
			// 判断品牌名是否已经存在
			if (!(brand.application && brand.nameEn &&brand.area)) {
				toaster.pop('error', '警告', "请将信息填写完整");
				return;
			}
			brand.id = null;
			BrandSubmit.submit({},brand,function(data){
				console.log(data);
				toaster.pop('success', '提示', "提交成功，请等待审核");
				// window.location.replace('vendor#/home/brandMaintenance');
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