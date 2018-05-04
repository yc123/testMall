define([ 'app/app' ], function(app) {
	//批量建档申请生成任务
	app.register.controller('ComponentSubmitBatchDetailListCtrl', ['$scope', 'ComponentSubmit', 'BaseService', 'ngTableParams', 'toaster', '$modal', '$window', function($scope, ComponentSubmit, BaseService, ngTableParams, toaster, $modal, $window) {
		BaseService.scrollBackToTop();
		$scope.submits = [];
		$scope.page = 0;
		$scope.isSelectAll = false;
		$scope.active = 'tobe_handle';
		
		$scope.setActive = function(status) {
			$scope.active = status;
			$scope.submits = [];
			$scope.page = 0;
			$scope.isSelectAll = false;
			getData();
		}
		
		var getStatus = function() {
			switch($scope.active) {
				case 'tobe_handle' :
					status = 'tobe_handleTask'; break;
				case 'pending' :
					status = 'pendingTask'; break;
				case 'complete' :
					status = 'completeTask'; break;
				case 'failed' : 
					status = 'failedTask';break;
					default : 
						status = 'tobe_handle';
			}
			return  status;
		};
		
		$scope.componentTableParams = new ngTableParams({
			page : 1,
			count : 20,
			sorting : {
				gradeOneKiName: 'ASC',
				gradeTwoKiName: 'ASC',
				gradeThreeKiName: 'ASC',
				brName: 'ASC',
				code: 'ASC'
			}
		}, {
			total : 0,
			getData : function($defer, params) {
				var param = BaseService.parseParams(params.url());
				param.page = $scope.page;
				param.keyword = $scope.keyword;
				ComponentSubmit[getStatus()].call(null, param, function(page) {
					if (page) {
						params.total(page.totalElements);
						$defer.resolve(page.content);
						angular.forEach(page.content, function (submit) {
							submit.select = false;
							$scope.submits.push(submit);
						})
					}
				});
			}
		});
		
		// 单选
		$scope.selectSubmit = function(component) {
			$scope.isSelectAll = true;
			angular.forEach($scope.submits, function(submit) {
				if (submit.select == false) {
					$scope.isSelectAll = false;
				} 
			})
		};
		
		// 全选
		$scope.selectAll = function() {
			angular.forEach($scope.submits, function(submit) {
				submit.select = $scope.isSelectAll;
			})
		}
		
		// 发起任务
		$scope.saveTask = function() {
			var idList = [];
			angular.forEach($scope.submits, function(submit) {
				if (submit.select) {
					idList.push(submit.id);
				}
			});
			if (idList.length == 0) {
				toaster.pop('warning', '提示', '请选择申请');
				return;
			}
			var ids = idList.join(",");
			
	        var modalInstance = $modal.open({
	            templateUrl : 'static/view/admin/modal/product_kindContrast_modal.html',  //指向上面创建的视图
	            controller : 'KindContrastCtrl',// 初始化模态范围
	            size : 'lg' // 大小配置
	        });
	        modalInstance.opened.then(function(){// 模态窗口打开之后执行的函数  
	        });  
	        modalInstance.result.then(function(contrast){
	        	openTask(contrast, ids);
	        }, function(reason){
	        	
	        });
		}
		
		// 打开任务确认界面
		var openTask = function(contrast, ids) {
			modalInstance = $modal.open({
	            templateUrl : 'static/view/admin/modal/product_crawlTask_modal.html',  //指向上面创建的视图
	            controller : 'CrawlTaskContrastCtrl',// 初始化模态范围
	            size : 'sm', // 大小配置
	            resolve : {
	            	contrast : function() {
	            		return contrast;
	            	},
	            	ids : function() {
	            		return ids;
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
		
		// 加载更多
		$scope.getMore = function() {
			getData();
		}
		
		// 获取数据
		var getData = function () {
			$scope.page ++;
			$scope.componentTableParams.reload();
		}
		getData();
	}]);
	
	// 属性对照关系的Controller
	app.register.controller('KindContrastCtrl', ['$scope', '$modalInstance', 'BaseService', 'ngTableParams', 'KindContrast', '$modal', function($scope, $modalInstance, BaseService, ngTableParams, KindContrast, $modal) {
		
		// 参数对照关系列表
		$scope.kindContrastTableParams = new ngTableParams({
			page : 1,
			count : 5,
			sorting : {
				resource: 'ASC',
				b2cBrId: 'ASC',
				kindName: 'ASC',
				b2cKiId: 'ASC'
			}
		}, {
			total : 0,
			counts : [5, 10, 25, 50, 100],
			getData : function($defer, params) {
				var param = BaseService.parseParams(params.url());
				param.b2cKind = $scope.keyword;
				KindContrast.outTask(param, function(page) {
					if (page) {
						params.total(page.totalElements);
						$defer.resolve(page.content);
					}
				});
			}
		});
		// 搜索
		$scope.onSearch = function () {
			$scope.kindContrastTableParams.reload();
		};
		
		// 查看参数对应关系详情
		$scope.preview = function(id) {
			 var modalInstance = $modal.open({
		            templateUrl : 'static/view/admin/modal/product_kindContrast_detail_modal.html',  //指向上面创建的视图
		            controller : 'KindContrastDetailCtrl',// 初始化模态范围
		            size : 'md', // 大小配置
		            resolve :  {
		            	 id: function() {
		            		return id;
		            	 } 
		            }
		        });
		        modalInstance.opened.then(function(){// 模态窗口打开之后执行的函数  
		        });  
		        modalInstance.result.then(function(contrast){
		        }, function(reason){
		        });
		}
		
		// 确认选择参数对应关系
		$scope.chooseContrast = function(contrast) {
			$modalInstance.close(contrast);
		}
		
		// 取消
		$scope.cancel = function() {
			$modalInstance.dismiss();
		}
	}]);
	
	// 属性对照关系详情的Controller
	app.register.controller('KindContrastDetailCtrl', ['$scope', '$modalInstance', 'id', 'KindContrast', function($scope, $modalInstance, id, KindContrast) {

		KindContrast.getOne({id : id}, {}, function(data) {
			$scope.kindContrast = data;
		}, function(res) {
			toaster.pop('error', '提示', res.data);
		})
		
		// 取消
		$scope.cancel = function() {
			$modalInstance.dismiss();
		}
	}]);
	
	// 发起任务的Controller
	app.register.controller('CrawlTaskContrastCtrl', ['$scope', 'contrast', 'ids', '$modalInstance', 'CrawlTask', 'toaster', function($scope, contrast, ids, $modalInstance, CrawlTask, toaster) {
		
		$scope.task = {contrastId : contrast.id, ids : ids};
		
		// 发起任务
		$scope.createTask = function() {
			console.log($scope.task);
			CrawlTask.saveBySubmit({ids : $scope.task.ids}, $scope.task, function(data) {
				toaster.pop('success', '提示', '发起任务成功');
				$modalInstance.close();
			}, function(res) {
				toaster.pop('error', '提示', res.data);
			})
		}
		
		// 取消
		$scope.cancel = function() {
			$modalInstance.dismiss();
		}
	}]);
});