define(['app/app'], function(app) {
	'use strict';
	app.register.controller('KindContrastDetailCtrl', ['$scope', 'KindContrast', 'toaster', '$stateParams', 'KindAPI', '$upload', function($scope, KindContrast, toaster, $stateParams, KindAPI, $upload) {
		
		$scope.isUpdate = false;
		
		var getData = function() {
			KindContrast.getOne({id : $stateParams.id}, {}, function(data) {
				$scope.kindContrast = data;
				angular.forEach($scope.kindContrast.properties, function(property) {
					property.isChange = false;
				})
				$scope.originalContrast = angular.copy($scope.kindContrast);
				
				KindAPI.getProperties({kindId : $scope.originalContrast.b2cKiId}, {}, function(data) {
					$scope.kindProperties = data;
					var detno = 1;
					angular.forEach($scope.kindProperties, function(kp) {
						kp.isContrast = false;
						angular.forEach($scope.kindContrast.properties, function(p) {
							if (kp.id == p.propertyId) {
								kp.isContrast = true;
								if (p.detno > detno) {
									detno = p.detno;
								}
							}
						});
					});
					angular.forEach($scope.kindProperties, function(kp) {
						if (!kp.isContrast) {
							$scope.kindContrast.properties.push( {
								detno : detno + 1,
								propertyId : kp.id,
								property : kp,
								resourceId : $scope.kindContrast.id,
								isNew : true
							})
						}
					});
					
				}, function(res) {
					
				});
				$scope.kindContrast.basicChange = false;
			}, function(res) {
				toaster.pop('error', '提示', res.data);
			})
		};
		
		getData();
		
		// 基础信息编辑
		$scope.editBasic = function() {
			$scope.kindContrast.basicChange = true;
		}
		
		// 保存基础信息
		$scope.saveBasic = function() {
			$scope.newKindContrast = {
					id : $scope.kindContrast.id,
					resource : $scope.kindContrast.resource,
					b2cBrId : $scope.kindContrast.b2cBrand.id,
					kindName : $scope.kindContrast.kindName,
					b2cKiId : $scope.kindContrast.b2cKind.id,
					url : $scope.kindContrast.url,
			}
			KindContrast.updateBasic({}, $scope.newKindContrast, function(data) {
				toaster.pop('success', '提示', '更新成功');
				getData();
			}, function(res) {
				toaster.pop('error', '提示', res.data);
			})
		};
		
		// 撤销基础信息编辑
		$scope.returnBasic = function() {
			$scope.kindContrast.resource = $scope.originalContrast.resource;
			$scope.kindContrast.b2cBrand = $scope.originalContrast.b2cBrand;
			$scope.kindContrast.kindName = $scope.originalContrast.kindName;
			$scope.kindContrast.b2cKind = $scope.originalContrast.b2cKind;
			$scope.kindContrast.url = $scope.originalContrast.url;
			$scope.kindContrast.basicChange = false;
		};
		
		// 编辑参数对应关系
		$scope.editProperty = function(pro) {
			pro.isChange = true;
		};
		
		// 撤销参数对照编辑
		$scope.returnProperty = function(pro) {
			angular.forEach($scope.originalContrast.properties, function(postPro) {
				if (pro.propertyId == postPro.propertyId) {
					pro.name = postPro.name;
					pro.unit = postPro.unit;
					pro.remark = postPro.remark;
				}
			});
			pro.isChange = false;
		};
		
		// 更新参数对照关系
		$scope.updateProperty = function(pro) {
			if(pro.isNew) {
				KindContrast.newProperty({}, pro, function(data) {
					toaster.pop('success', '提示', '更新成功');
					getData();
				}, function(res) {
					toaster.pop('error', '提示', res.data);
				});
			} else {
				KindContrast.updateProperty({}, pro, function(data) {
					toaster.pop('success', '提示', '更新成功');
					getData();
				}, function(res) {
					toaster.pop('error', '提示', res.data);
				});
			}
		};
		
		// 展示重新上传输入框
		$scope.triggerUpload = function() {
			$scope.isUpdate = !$scope.isUpdate;
		};
		
		// 重新上传数据
		$scope.upload = function() {
			var file = $scope.myFiles[0];
			$upload.upload({
				url: 'produce/componentSubmit/upload/componentCrawlsWithSame/' + $scope.kindContrast.id,
				file: file,
				method: 'POST'
			}).success(function(data) {
				toaster.pop('success', '提示', '提交成功');
				window.location.reload();
			}).error(function(response) {
				toaster.pop('error', '提示', response);
			});
		};
	}]);
});