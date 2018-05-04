define(['app/app'], function(app) {
    'use strict';
    app.register.controller('browsingHistoryCtrl', ['$scope', '$rootScope', 'toaster', 'GoodsBrowsingHistory', 'Goods', '$filter', function($scope, $rootScope, toaster, GoodsBrowsingHistory, Goods, $filter){
        $rootScope.active = 'store_focus_ctrl';
        document.title = '浏览历史-优软商城';
        $scope.param = {};
        $scope.param.page = 1;
        $scope.param.count = 25;

        // 加密订单的ID过滤器
        var enIdFilter = $filter('EncryptionFilter');

        var loadData = function(){
            GoodsBrowsingHistory.getAllHistoryPage($scope.param, function(data){
                $scope.isChooseAll = false;
                $scope.initHistory = data.content;
                $scope.param.currentPage = data.number;
                $scope.totalPages = data.totalPages;
                $scope.acculatePages(data.number, data.totalPages);
                $scope.midhistory = { };
                var dateArr = [];
                angular.forEach($scope.initHistory, function(data){
                    var formatDate = getFormatDate(data.browsingTime);
                    dateArr.push(formatDate);
                    if(!$scope.midhistory[formatDate]){
                        $scope.midhistory[formatDate] = [ ];
                    }
                    $scope.midhistory[formatDate].push(data);
                });
                var uniqueArr = uniqueArray(dateArr);
                $scope.history = [];
                for(var i = 0 ; i< uniqueArr.length ; i ++){
                    var newhistory = { };
                    newhistory.date= uniqueArr[i];
                    newhistory.dateList = $scope.midhistory[uniqueArr[i]];
                    $scope.history.push(newhistory);
                };
                if ($scope.history.length == 0){
                    $scope.isBatch = false;
                }
            },function () {
                toaster.pop("error", "获取浏览历史记录失败");
            })
        }
        loadData();

        // 获取Goods信息，得到Goods价格数量信息，给加入购物车功能使用
        // 价格信息
        $scope.fragment = {};
        $scope.addCart = function(history){
            return Goods.findByBatchCode({batchCode: enIdFilter(history.batchCode)}, function(data){
                $scope.goods = data;
                $scope.fragment.num = data.minBuyQty;
                $scope.fragment.currency = data.currencyName;
                return data || {};
            }, function(){
                toaster.pop("error", "未能获取产品详情");
            }).$promise;

        }

        // 获取格式化日期
        var getFormatDate = function(strDate){
            var date = new Date(strDate);
            var month = date.getMonth() + 1;
            var date = date.getDate();
            return month + '月' + date + '日';
        }

        // 去除数组中重复元素
        var uniqueArray = function(arr){
            var arr1 = [];
            for(var i = 0 ; i<arr.length; i ++){
                if(arr1.indexOf(arr[i])== -1){
                    arr1.push(arr[i])
                }
            }
            return arr1;
        }

        $scope.isBatch = false;	 // 是否批量标识
        $scope.isChooseAll = false; // 是否全选标识

        // 批量操作
        $scope.doBatch = function () {
            $scope.isBatch = true;
            setAllNotSelected();
            $scope.isWatch = false;
            watchDetail();
        }

        // 取消批量操作
        $scope.cancleBatch = function(){
            $scope.isBatch = false;
            $scope.isChooseAll = false;
            setAllNotSelected();
            $scope.isWatch = true;
            watchDetail();
        }

        // 选中状态
        $scope.setActive = function(item){
            item.active = !item.active;
            $scope.isChooseAll = $scope.isAllSelect();
        }

        // 全选
        $scope.chooseAllHistory = function(){
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
            angular.forEach($scope.history, function(data){
                angular.forEach(data.dateList, function(data){
                    data.active = false;
                })
            });
        };

        // 检查是否所有的状态都已经选中或者取消了。
        $scope.isAllSelect = function () {
            var isAllChecked = true;//假定都选中，
            angular.forEach($scope.history, function(data){
                angular.forEach(data.dateList, function(data){
                    if(!data.active) {
                        isAllChecked = false;
                    }
                })
            });
            return isAllChecked;
        }

        // 全部设为选中状态
        var setAllSelected = function(){
            angular.forEach($scope.history, function(data){
                angular.forEach(data.dateList, function(data){
                    data.active = true;
                })
            })
        };

        // 是否可以查产品详情
        var watchDetail = function(){
            var detail = $("a[name='detail']");
            if($scope.isWatch){
                for(var i = 0; i<detail.length; i++){
                    angular.forEach($scope.history, function(data){
                        angular.forEach(data.dateList, function(data) {
                            detail[i].href = "store/" + data.storeid + "/" + data.batchCode;
                        })
                    })
                }
            }else{
                for(var j = 0; j<detail.length; j++){
                    detail[j].href = "#";
                }
            }
        };

        // 界面图标删除
        $scope.deleteById = function(id){
            var  isSure = confirm('确认删除吗？删除后无法恢复，请谨慎操作');
            if(isSure){
                deleteHistory(id);
            }
        };

        // 批量删除
        $scope.deleteByIds = function(){
            var  isSure = confirm('确认进行批量删除吗？删除后无法恢复，请谨慎操作');
            if(isSure){
                deleteHistory();
                $scope.isChooseAll = false;
            }
        }

        var deleteHistory = function (id) {
            var arr = [];
            if(id){
                arr.push(id);
            }else{
                angular.forEach($scope.history, function(data){
                    angular.forEach(data.dateList, function(data) {
                        if (data.active) {
                            arr.push(data.id);
                        }
                    })
                });
            }
            if(arr.length == 0){
                toaster.pop("info", "请选择要删除的浏览历史");
            }else{
                GoodsBrowsingHistory.deleteHistory({ }, arr, function (response) {
                    if(response.data == "success"){
                        loadData();
                        toaster.pop("success", "删除成功");
                    }
                },function () {
                    toaster.pop("error", "删除失败");
                })
            }
        };

/*        // 分页功能
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
})