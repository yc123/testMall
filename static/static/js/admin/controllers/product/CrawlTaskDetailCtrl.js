define(['app/app'], function(app) {
	'use strict';
	app.register.controller('CrawlTaskDetailCtrl', ['$scope', 'CrawlTask', '$stateParams', 'toaster', '$modal', '$window', 'KindContrast', 'KindAPI', function($scope, CrawlTask, $stateParams, toaster, $modal, $window, KindContrast, KindAPI) {
		$scope.isShowSubmit = false;
		
		CrawlTask.getOne({id : $stateParams.id}, {}, function(data) {
			$scope.task = data;
			if ($scope.task.status == 351 || $scope.task.status == 814) {
				$scope.kindContrast =  angular.fromJson($scope.task.contrast);
			} else {
				getData($scope.task.contrastId);
			}
		}, function(res) {
			toaster.pop('error', '提示', res.data);
		})
		
		// 获取参数对应关系
		var getData = function(id) {
			KindContrast.getOne({id : id}, {}, function(data) {
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
		
		
		// 展示用户申请
		$scope.showSubmits = function() {
			$scope.isShowSubmit = true;
		}
		
		// 收起用户申请
		$scope.hideSubmits = function() {
			$scope.isShowSubmit = false;
		}
		
		// 任务操作
		$scope.operateTask = function(type) {
			if (type == 'RUNNING') {
				CrawlTask.crawlStart({}, $scope.task, function(data) {
					toaster.pop('success', '提示', '任务开启成功');
					$window.location.reload();
					return;
				}, function(res) {
					toaster.pop('error','提示', res.data);
				});
			} else {
				var modalInstance = $modal.open({
		            templateUrl : 'static/view/prod/modal/crawltask_feedback_modal.html',  //指向上面创建的视图
		            controller : 'CrawlTaskFeedBackModalCtrl',// 初始化模态范围
		            size : 'lg', // 大小配置
		            resolve : {
		            	type : function() {
							return type;
						},
						taskId : function() {
							return $scope.task.id;
						}
		            }
		        });
		        modalInstance.opened.then(function(){// 模态窗口打开之后执行的函数  
		        });  
		        modalInstance.result.then(function(){
		        	$window.location.reload();
		        }, function(reason){
		        	
		        });
			}
		}
		
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
				getData($scope.task.contrastId);
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
					getData($scope.task.contrastId);
				}, function(res) {
					toaster.pop('error', '提示', res.data);
				});
			} else {
				KindContrast.updateProperty({}, pro, function(data) {
					toaster.pop('success', '提示', '更新成功');
					getData($scope.task.contrastId);
				}, function(res) {
					toaster.pop('error', '提示', res.data);
				});
			}
		};
	}]);
	
	app.register.controller('CrawlTaskFeedBackModalCtrl', ['$scope', '$modalInstance', 'type', 'taskId', 'CrawlTask', 'toaster', function($scope, $modalInstance, type, taskId, CrawlTask, toaster) {
		$scope.type = type;
		$scope.taskId = taskId;
		
		var getData = function(){
			CrawlTask.getOne({id : $scope.taskId}, {}, function(data) {
				$scope.task = data;
			}, function(res) {
				toaster.pop('error', '提示', res.data);
			})
		};
		
		getData();
		
		// 确认
		$scope.confirm = function() {
			if ($scope.type == 'CROWLED') {
				CrawlTask.crawlSuccess({}, $scope.task, function(data) {
					$modalInstance.close();
				}, function(res) {
					toaster.pop('error', '提示', res.data);
				});
			} else {
				CrawlTask.crawlFail({}, $scope.task, function(data) {
					$modalInstance.close();
				}, function(res) {
					toaster.pop('error', '提示', res.data);
				});
			}
		}
		
		// 取消
		$scope.cancel = function() {
			$modalInstance.dismiss();
		}
	}]);
});