define(['app/app'], function(app) {
	'use strict';
	app.register.controller('ComponentStoreCtrl', ['$rootScope', '$scope', 'ngTableParams', 'toaster', 'collectionService', 'BaseService', 'SessionService', function($rootScope, $scope, ngTableParams, toaster, collectionService, BaseService, SessionService) {
		BaseService.scrollBackToTop();
		document.title = '产品收藏-优软商城';
		$scope.pageInfo = {};
		$scope.pageInfo.page = 1;	// 默认初始页码为1
		$scope.pageInfo.count = 25; // 每页数量为25
		$scope.overPrevious = true; // 超过上一页标识
		$scope.overNext = true; // 超过下一页标识
		$scope.deleteDiv = false;
		$scope.deleteID = null;
        $scope.isBatchDelete = false;
			
		// 初始加载数据
		var getData = function(){
			var params = {};
			params.page = $scope.pageInfo.page;
			params.count = $scope.pageInfo.count;
			collectionService.getStoreByUUAndComponent.call(null, params,function(data) {
				$scope.isChooseAll = false;
				$scope.collectInfo = data.content;
				if ($scope.collectInfo.length==0){
					$scope.isBatch = false;
				}
				$scope.totalElements = data.totalElements;
				$scope.totalPages = data.totalPages;
				$scope.number = data.number;
				if($scope.totalPages == 1){
					$scope.overPrevious = true; 
					$scope.overNext = true;
				}else if($scope.totalPages >1){
					if($scope.number == 1){
						$scope.overPrevious = true; 
						$scope.overNext = false;
					}else if($scope.number > 1 && $scope.number < $scope.totalPages){
						$scope.overPrevious = false; 
						$scope.overNext = false;
					}else if($scope.number == $scope.totalPages){
						$scope.overPrevious = false; 
						$scope.overNext = true;
					}
				};
				// angular.forEach($scope.collectInfo, function(info){
				// 	if(!info.componentinfo.img){
				// 		info.componentinfo.img = "http://113.105.74.140/images/616a2e82078511e69d7a00269e610dbf.jpg";
				// 	}
				// });
			}, function(response) {
				toaster.pop('error', '获取信息失败');
			})
		};	
		getData();
			
		$scope.isBatch = false;	 // 是否批量标识
		$scope.isChooseAll = false; // 是否全选标识
		
		// 进行批量操作
		$scope.doBatch = function(){
			$scope.isBatch = true;
			setAllNotSelected();
			$scope.isWatch = false;
			watchDeatil();
		};
			
		// 全选按钮
		$scope.chooseAllCollect = function(){
			$scope.isChooseAll = !$scope.isChooseAll;
			if($scope.isChooseAll){
				setAllSelected();
			}else{
				setAllNotSelected();
			}		
		};
		
		// 取消批量操作
		$scope.cancleBatch =function(){
			$scope.isBatch = false;
			$scope.isChooseAll = false;
			setAllNotSelected();
			watchDeatil();
		};
		
		// 删除选中的收藏
		$scope.deleteByselected = function(){
			$scope.deleteDiv = true;
			$scope.isBatchDelete = true;
		};
		
		// 选中状态
		$scope.setActive = function(item){
			item.active = !item.active;
			$scope.isChooseAll = true;
			angular.forEach($scope.collectInfo, function(data){
				if(!data.active){
					$scope.isChooseAll = false;
				}
			})
		};
		
		// 全部设为未选中状态
		var setAllNotSelected = function(){
			angular.forEach($scope.collectInfo, function(data){
				data.active = false;
			})
		};
		
		// 全部设为选中状态
		var setAllSelected = function(){
			angular.forEach($scope.collectInfo, function(data){
				data.active = true;
			})
		};
			
		// 是否可以查看详情
		$scope.isWatch = false;
		var watchDeatil = function(){
			var details = $("a[name='detail']");
			if($scope.isWatch){
				for(var i = 0; i<details.length; i++){
					angular.forEach($scope.collectInfo, function(data){					
						details[i].href = "product/component/" + data.componentinfo.uuid + "/";
					});	
				}
				$scope.isWatch = false;
			}else{
				for(var j = 0; j<details.length; j++){
					details[j].href = "#";
				}
				$scope.isWatch = true;
			}					
		};

		//取消删除的操作
		$scope.cancleDelete = function () {
			$scope.deleteDiv = false;
			$scope.deleteID = null;
            $scope.isBatchDelete = false;
		};


		//确认删除账户信息
		$scope.confirmDelete = function () {
			if ($scope.isBatchDelete) {
				var store = [];
				angular.forEach($scope.collectInfo, function(data){
					if(data.active == true){
						store.push(data.id);
					}
				});
				if(store.length == 0){
					toaster.pop('info', '请选择要移除的产品');
				}else{
					collectionService.deleteStoreByIds({}, store, function(data){
						var result = data;
						if(result.data){
							getData();
							toaster.pop('success', '移除成功');
						}else{
							toaster.pop('fail', '移除失败');
						}
					}, function(){
						toaster.pop('fail', '移除失败,后台调用出错');
					})
				}
				$scope.isBatchDelete = false;
				$scope.deleteDiv = false;
				$scope.isChooseAll = false;
			} else {
				collectionService.deleteStoreById({id: $scope.deleteID}, null, function(data) {
					var store = [];
					for(var i = 0; i < data.length; i++) {
						store.push(data[i]);
					}
					var key = SessionService.getCookie('J_USERNAME');
					SessionService.setCookie(key, angular.toJson(store));
					toaster.pop('success', '移除成功');
					$scope.deleteDiv = false;
					$scope.deleteID = null;
					getData();
					collectionService.getStoreByUU({}, function(data) {
						var store = [];
						var brandCount = 0;
						var componentCount = 0;
						for(var i = 0; i < data.length; i++) {
							if(data[i].kind == 1) {
								brandCount++;
							}else if (data[i].kind == 2){
								componentCount++;
							}
							store.push(data[i]);
						}
						$rootScope.brandCount = brandCount;
						$rootScope.componentCount = componentCount;
						SessionService.setCookie($rootScope.userInfo.userUU +"-"+ (typeof $rootScope.userInfo.enterprise != 'undefined' ? $rootScope.userInfo.enterprise.uu : null), angular.toJson(store));
					});
				}, function(response) {
					toaster.pop('error', '移除失败');
				});
			}
		};

		// 删除单个收藏
		$scope.cancleStore = function(id) {
			$scope.deleteDiv = true;
			$scope.deleteID = id;
		};
		
		// 分页功能
		$scope.toPage = $scope.pageInfo.page;	
				
		$scope.jumpToPage = function (number) {
			if(number == 1 || number == '' || number < 1 || number > $scope.totalPages){
				$scope.pageInfo.page = 1;
			}if(number > 1 && number <= $scope.totalPages){
				$scope.pageInfo.page = number;
			}
			$scope.toPage = $scope.pageInfo.page;
			$scope.isChooseAll = false;
			getData();			
		};
				
	}]);
})