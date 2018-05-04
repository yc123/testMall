/**
 * Created by huh on 2017/5/2.
 *  店铺关注控制器
 */
define(['app/app'], function(app) {
    'use strict';
    app.register.controller('storeFocusCtrl', ['$scope', '$rootScope', 'toaster', 'StoreFocusService', function($scope, $rootScope, toaster, StoreFocusService) {
		$rootScope.active = 'store_focus_ctrl';
        document.title = '店铺关注-优软商城';
        $scope.param = {};
        $scope.param.page = 1;
        $scope.param.count = 5;
		$scope.deleteDiv = false;
		$scope.deleteID = null;
		$scope.isBatchDelete = false;
		
		var loadData = function(){
			StoreFocusService.getStoreFocusPage($scope.param, {}, function(data){
                $scope.isChooseAll = false;
				$scope.store = data.content;
                if ($scope.store.length == 0){
                    $scope.isBatch = false;
                }
                $scope.totalElements = data.totalElements;
                $scope.param.currentPage = data.number;
                $scope.totalPages = data.totalPages;
                $scope.acculatePages(data.number, data.totalPages);
			}, function(){
				toaster.pop("error", "加载数据获取失败");
			});
		}
		loadData();
        // 联系卖家弹框
        $scope.contactSeller = function (item) {
            item.contactBNox = !item.contactBNox;
            angular.forEach($scope.store, function (store) {
                if (store.id != item.id){
                    store.contactBNox = false;
                }
            })
        };
        $scope.closeBox = function () {
            $scope.contactBNox = false;
        };
		$scope.isBatch = false;	 // 是否批量标识
		$scope.isChooseAll = false; // 是否全选标识
		
		// 批量操作
		$scope.isBatch = false;
		$scope.doBatch = function(){
			$scope.isBatch = true;
			$scope.isWatch = false;
			watchDetail();
			setAllNotSelected();
		}
		
		// 取消批量操作
		$scope.cancelBatch = function(){
			$scope.isBatch = false;
			$scope.isChooseAll = false;
			$scope.isWatch = true;
			watchDetail();
			setAllNotSelected();
		}
		
		// 选中状态
		$scope.setActive = function(item){			
			item.active = !item.active;
            $scope.isChooseAll = true;
            angular.forEach($scope.store, function(data){
                if(!data.active){
                    $scope.isChooseAll = false;
                }
            })
		}
		
		// 全选
		$scope.chooseAllStore = function(){
			$scope.isChooseAll = !$scope.isChooseAll;
			if($scope.isChooseAll){
				setAllSelected();
			}
			if(!$scope.isChooseAll){
				setAllNotSelected();
			}
		}
				
		// 全部设为未选中状态
		var setAllNotSelected = function(){
			angular.forEach($scope.store, function(data){
				data.active = false;
			})
		};
		
		// 全部设为选中状态
		var setAllSelected = function(){
			angular.forEach($scope.store, function(data){
				data.active = true;
			})
		};

		//确认删除账户信息
		$scope.confirmDelete = function () {
			if ($scope.isBatchDelete) {
				var arr = [];
				angular.forEach($scope.store, function(data){
					if(data.active){
						arr.push(data.id);
					}
				});
				if(arr.length == 0){
					toaster.pop("info", "请选择要取消关注的店铺");
				}else{
					StoreFocusService.deleteStoreFocus({}, arr, function(response){
						var result = response.data;
						if(result = "success"){
							toaster.pop("success", "取消成功");
							if(arr.length == $scope.countsOfCurrentPage){
								if($scope.totalPages >1){
									$scope.pageInfo.page = $scope.pageInfo.page -1 ;
									$scope.toPage = $scope.toPage - 1;
								}else if($scope.totalPages == 1){
									$scope.pageInfo.page = 1 ;
									$scope.toPage = 1;
								}
							}
							loadData();
							$scope.cancelBatch();
						}else{
							toaster.pop("error", "取消失败");
						}
					}, function(){
						toaster.pop("error", "取消失败，后台调用错误");
					})
				}
				$scope.isBatchDelete = false;
				$scope.deleteDiv = false;
			} else {
				var arr = [];
				arr.push($scope.deleteID);
				StoreFocusService.deleteStoreFocus({}, arr, function(response){
					var result = response.data;
					if(result == "success"){
						if($scope.countsOfCurrentPage <= 1){
							if($scope.totalPages >1){
								$scope.pageInfo.page = $scope.pageInfo.page -1 ;
								$scope.toPage = $scope.toPage - 1;
							}else if($scope.totalPages == 1){
								$scope.pageInfo.page = 1 ;
								$scope.toPage = 1;
							}
						}
						loadData();
						toaster.pop("success", "取消成功");
						$scope.deleteDiv = false;
						$scope.deleteID = null;
					}else{
						toaster.pop("error", "取消失败");
					}
				}, function(){
					toaster.pop("error", "取消失败，后台调用错误");
				})
			}
		};

		//取消删除的操作
		$scope.cancleDelete = function () {
			$scope.deleteDiv = false;
			$scope.deleteID = null;
			$scope.isBatchDelete = false;
		};
		
		// 界面按钮删除
		$scope.deleteById= function(id){
			$scope.deleteDiv = true;
			$scope.deleteID = id;
		};
		
		// 批量界面删除
		$scope.deleteByIds = function(){
			$scope.deleteDiv = true;
			$scope.isBatchDelete = true;
		};
		
		// 是否可以查看店铺详情
		var watchDetail = function(){
			var imgDetails = $("a[name='imgDetail']");
			var nameDetails = $("a[name ='nameDetail']");
			if($scope.isWatch){
				for(var i = 0; i<imgDetails.length; i++){
					angular.forEach($scope.store, function(data){
						imgDetails[i].href = "store/" + data.storeInfo.uuid;
						nameDetails[i].href = "store/" + data.storeInfo.uuid;
					})
				}
			}else{
				for(var j = 0; j<imgDetails.length; j++){
					imgDetails[j].href = "#";
					nameDetails[j].href = "#";
				}
			}
		}
		
/*		// 分页功能
		$scope.toPage = $scope.pageInfo.page;	
				
		$scope.jumpToPage = function (number) {
			if(number == 1 || number == '' || number < 1 || number > $scope.totalPages){
				$scope.pageInfo.page = 1;
			}if(number > 1 && number <= $scope.totalPages){
				$scope.pageInfo.page = number;
			}
			$scope.toPage = $scope.pageInfo.page;
			$scope.isChooseAll = false;
			loadData();			
		};*/

        /******************根据页数设置翻页的信息********start**************************/

        //输入框监听Enter事件
        $scope.listenEnter = function () {
            if(event.keyCode == 13) {
                $scope.setPage("page", $scope.param.currentPage);
            }
        };

        $scope.setPage = function(type, number) {
            if(type != 'prev' &&  type != 'page' && type != 'next' && type != 'last' && type != 'first') {
                return ;
            };
            var page = -1;
            switch (type) {
                case "page":
                    if(number < 1) {
                        page = 1;
                    }else if(number > $scope.totalPages) {
                        page = $scope.totalPages;
                    }else {
                        page = number;
                    };
                    break;
                case "prev":
                    if($scope.param.page <= 1) {
                        page = 1;
                    }else {
                        page =$scope.param.page - 1;
                    };
                    break;
                case "next":
                    if($scope.param.page >= $scope.totalPages) {
                        page = $scope.totalPages
                    }else {
                        page =$scope.param.page + 1;
                    }
                    break;
                case "first":
                    page = 1;
                    break;
                case "last":
                    page = $scope.totalPages;
                    break;
            }
            if(page == $scope.param.page || page < 1 || page > $scope.totalPages) {
                $scope.param.currentPage = $scope.param.page;
                return ;
            }
            $scope.param.page = page;
            $scope.isChooseAll = false;
            loadData();
        };

        //当前页在前段的计算方式
        $scope.frontSegment = function (currentPage, totalElementPages) {
            angular.forEach($scope.pages, function (page) {
                switch (page.number) {
                    case 8:
                        page.type = 'more';
                        page.active = false;
                        break;
                    case 0:
                        if(currentPage == 1) {
                            page.active = false;
                        }
                    default : {
                        page.current = (currentPage == page.number);
                    }
                }
            });
        };

        //当前页在后端计算方式
        $scope.endSegment = function (currentPage, totalElementPages) {
            angular.forEach($scope.pages, function (page) {
                switch (page.number) {
                    case 2:
                        page.active = false;
                        page.type = 'more';
                        break;
                    case 10:
                        if(currentPage == totalElementPages) {
                            page.active = false;
                        }
                        break;
                    case 0:
                    case 1:
                        break;
                    default:
                        if(page.number != totalElementPages) {
                            page.number = totalElementPages - 9 + page.number;
                        }
                        page.current = (currentPage == page.number);
                        break;
                }
            });
        };

        //当前页在中间计算方式
        $scope.middleSegment = function (currentPage) {
            angular.forEach($scope.pages, function (page) {
                switch (page.number) {
                    case 2:
                    case 8:
                        page.type ='more';
                        page.active = false;
                        break;
                    case 3:
                        page.number = currentPage - 2;
                        break;
                    case 4:
                        page.number = currentPage - 1;
                        break;
                    case 5:
                        page.number = currentPage;
                        page.current = true;
                        break;
                    case 6:
                        page.number = currentPage + 1;
                        break;
                    case 7:
                        page.number = currentPage + 2;
                        break;
                }
            });
        }

        //初始化页数信息
        $scope.initPages = function (totalElementPages) {
            var pageNum = [];
            if(totalElementPages == 1) {
                return ;
            }else if(totalElementPages < 10) {
                for(var i = 0; i < totalElementPages + 2; i++) {
                    pageNum.push(i);
                }
            }else {
                pageNum = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            }
            angular.forEach(pageNum, function (number) {
                var page = {active : true, type : 'page', number : number};
                if(number == 0) {
                    page.type = 'prev';
                }else if(number == 1) {
                    page.type = 'first';
                }else if(number == pageNum.length - 2) {
                    page.type = 'last';
                    page.number = totalElementPages;
                }else if(number == pageNum.length - 1){
                    page.type = 'next';
                }
                $scope.pages.push(page);
            });
        }

        //计算页数的方式。
        $scope.acculatePages = function(currentPage, totalElementPages) {
            $scope.pages = [];
            if(totalElementPages < 1)  {
                return ;
            }
            //初始化页面数据
            $scope.initPages(totalElementPages);
            if(totalElementPages < 10) {
                angular.forEach($scope.pages, function (page) {
                    if(page.number == currentPage) {
                        page.current = true;
                    }
                });
            }else if(currentPage < 6) {//当期页小于6
                $scope.frontSegment(currentPage, totalElementPages);
            }else if(currentPage > totalElementPages - 5) { //当期页在后面
                $scope.endSegment(currentPage, totalElementPages);
            }else { //当期页在中间
                $scope.middleSegment(currentPage);
            }
        };
        /******************根据页数设置翻页的信息********end**************************/
				
    }]);
});