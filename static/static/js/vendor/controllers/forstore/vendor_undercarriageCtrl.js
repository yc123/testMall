define([ 'app/app' ], function(app) {
    'use strict';
    app.register.controller('vendor_undercarriageCtrl', ['$scope', '$rootScope', '$q', 'Goods', 'Enterprise', 'toaster', 'Loading', 'StoreInfo', 'AuthenticationService', function ($scope, $rootScope, $q, Goods, Enterprise, toaster, Loading, StoreInfo, AuthenticationService) {
        $rootScope.active = 'vendor_material';
        document.title = '上下架历史-优软商城';
        $scope.tab = 'undercarriage';
        $scope.keyword = '';

        $scope.param = {
            page : 1,
            count : 10,
            sorting : {
                createdDate: 'DESC'
            },
            status : 612
        };

        // 根据地址获取币别信息
        $scope.$$upAndDown = {};
        Enterprise.getCurrencyByRegisterAddress(null, function (data) {
            if(data.code == 1) {
                $scope.$$upAndDown.currency = data.data;
            }else {
                toaster.pop('warning', '提示', data.message);
            }
        }, function (response) {
            toaster.pop('error', '根据注册地址确定的币别失败');
        });

        //获取登录的信息
        var getAuthentication = function () {
            return AuthenticationService.getAuthentication().success(function(data) {
                if(data && data.enterprises) {
                    data.enterprise = data.enterprises[data.enterprises.length - 1];
                    if(data.enterprises.length > 1) {
                        var enSelect = [];
                        angular.forEach(data.enterprises, function(e){
                            if(e.current)
                                data.enterprise = e;
                            else
                                enSelect.push(e);
                        });
                        data.enSelect = enSelect;
                    }
                }
                $rootScope.userInfo = data;
            }).error(function(response) {
                toaster.pop('info', '获取定单的信息' + response);
            });
        };

        //判断是否是商城管理公司，是否可以选择自营。
        $q.all([getAuthentication()]).then(function() {
            //获取店铺的信息
            StoreInfo.getStoreInfoByEnuu({enUU : $rootScope.userInfo.enterprise.uu}, function(data) {
                $scope.storeInfo = data;
            }, function(response) {
                toaster.pop('error', '获取店铺的信息失败, ' + response.data);
            });
        });



        // 商品分页数据
        $scope.goodsPageParams = {};
        $scope.selfSupportType = {
            ALL: '自营/寄售',
            SELF_SUPPORT: '自营',
            CONSIGNMENT: '寄售'
        };
        $scope.selfSupport = $scope.selfSupportType.ALL;

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
        };

        //输入框监听Enter事件
        $scope.listenEnter = function () {
            if(event.keyCode == 13) {
                $scope.setPage("page", $scope.param.currentPage);
            }
        };

        $scope.setPage = function(type, number) {
            if(type != 'prev' &&  type != 'page' && type != 'next' && type != 'last' && type != 'first') {
                return ;
            }
            var page = -1;
            switch (type) {
                case "page":
                    if(number < 1) {
                        page = 1;
                    }else if(number > $scope.goodsAll.totalPages) {
                        page = $scope.goodsAll.totalPages;
                    }else {
                        page = number;
                    }
                    break;
                case "prev":
                    if($scope.param.page <= 1) {
                        page = 1;
                    }else {
                        page =$scope.param.page - 1;
                    }
                    break;
                case "next":
                    if($scope.param.page >= $scope.goodsAll.totalPages) {
                        page = $scope.goodsAll.totalPages
                    }else {
                        page =$scope.param.page + 1;
                    }
                    break;
                case "first":
                    page = 1;
                    break;
                case "last":
                    page = $scope.goodsAll.totalPages;
                    break;
            }
            if(page == $scope.param.page || page < 1 || page > $scope.goodsAll.totalPages) {
                $scope.param.currentPage = $scope.param.page;
                return ;
            }
            $scope.param.page = page;
            loadData();
        };

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

        var loadData = function () {
            if ($scope.selfSupport === $scope.selfSupportType.SELF_SUPPORT) {
                $scope.param.isSelfSupport = true;
            } else if ($scope.selfSupport === $scope.selfSupportType.CONSIGNMENT) {
                $scope.param.isSelfSupport = false;
            } else {
                $scope.param.isSelfSupport = null;
            }
            $scope.param.keyword = $scope.keyword;
            Goods.findUpAndDown($scope.param, function (data) {
                $scope.goodsAll = data;
                $scope.currenctGoods = data.content;
                if(data.totalElements > 1){
                    $scope.goodsAll.start = Number(data.size) * (Number(data.number) - 1) + 1;
                }else{
                    $scope.goodsAll.start = 0 ;
                }
                $scope.param.currentPage = data.number;
                $scope.acculatePages(data.number, data.totalPages);
                // 获取币别信息
                Enterprise.getCurrencyByRegisterAddress({ }, function (response) {
                    $scope.currency = response.data;
                }, function () {
                    toaster.pop("error", "获取币别信息失败");
                })
            });
        };

        var loadDataReload = function () {
            $scope.param = {
                page : 1,
                count : 10,
                sorting : {
                    createdDate: 'DESC'
                }
            };
            loadData();
        };

        loadData();

        $scope.onSearch = function () {
            loadDataReload();
        };

        /**
         * 获取当前需要下载的在售产品信息的ID
         */
        var getDownLoadGoodsHistoryId = function() {
            var goodsID = [];
            angular.forEach($scope.currenctGoods, function (good) {
                goodsID.push(good.id);
            });
            return goodsID;
        };

        /**
         * 下载当前页的订单信息
         */
        $scope.localInfo = {};
        $scope.downGoods = function () {
            var listId = getDownLoadGoodsHistoryId();
            if(listId.length < 1) {
                toaster.pop('warning', '当前需要下载的订单条数为0');
                return ;
            }
            Loading.show();
            $scope.localInfo.ids = listId.join("-");
            $scope.$apply();
            var form = document.getElementById('down-load-goods');
            form.action = 'trade/goods/down/upAndDown/ids';
            form.submit();
            var clockID = null;
            var getDownLoadStatus = function () {
                $.ajax({
                    url : 'trade/goods/down/upAndDown/ids',
                    data : {isAjax : true, ids : $scope.localInfo.ids},
                    method : 'GET',
                    dataType : 'json',
                    success : function (data) {
                        if(data.loading) {
                            clockID = setInterval(function() {
                                getDownLoadStatus()
                            }, 500);
                        }else {
                            $scope.$apply(function () {
                                toaster.pop('info', '数据处理完毕，正在下载文件，请稍等。');
                                Loading.hide();
                            });
                            if(!clockID) {
                                clearInterval(clockID);
                            }
                        }
                    },
                    error : function () {
                        Loading.hide();
                        if(!clockID) {
                            clearInterval(clockID);
                        }
                    }
                });
            };
        };

        /**
         * 筛选商品类型
         *
         * @param type		商品上架类型
         */
        $scope.changeSupportType = function (type) {
            if (!type) return ;
            $scope.selfSupport = type;
            loadDataReload();
        };
    }]);
});
