/**
 * Created by yangck on 2017/3/30.
 */
define(['app/app'], function(app) {
    app.register.controller('MessagePersonalCtrl', ['$scope', '$rootScope', 'InternalMessage', 'toaster', '$sce', function($scope, $rootScope, InternalMessage, toaster, $sce) {
        $rootScope.active = 'message';
        $scope.message = {};
        $scope.params = {
            page: 1,
            count: 10,
            timeSorting: 'DESC',
            classes: '',
            recRole: 'SELLER'
        };
        $scope.deleteIds = [];
        $scope.isChoosedAll = false;
        $scope.isDelete = false;

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

        //当前页在后端计算方式
        $scope.endSegment = function (currentPage, totalElementPages) {
            if (totalElementPages > 8) {
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
            }
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

        //当前页在前段的计算方式
        $scope.frontSegment = function (currentPage, totalElementPages) {
            if (totalElementPages > 8) {
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
            }
        };

        //输入框监听Enter事件
        $scope.listenEnter = function () {
            if(event.keyCode == 13) {
                $scope.setPage("page", $scope.params.currentPage);
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
                    }else if(number > $scope.messageAllData.totalPages) {
                        page = $scope.messageAllData.totalPages;
                    }else {
                        page = number;
                    };
                    break;
                case "prev":
                    if($scope.params.page <= 1) {
                        page = 1;
                    }else {
                        page =$scope.params.page - 1;
                    };
                    break;
                case "next":
                    if($scope.params.page >= $scope.messageAllData.totalPages) {
                        page = $scope.messageAllData.totalPages
                    }else {
                        page =$scope.params.page + 1;
                    }
                    break;
                case "first":
                    page = 1;
                    break;
                case "last":
                    page = $scope.messageAllData.totalPages;
                    break;
            }
            if(page == $scope.params.page || page < 1 || page > $scope.messageAllData.totalPages) {
                $scope.params.currentPage = $scope.params.page;
                return ;
            }
            $scope.params.page = page;
            getData();
        };

        //计算页数的方式。
        $scope.acculatePages = function(currentPage, totalElementPages) {
            $scope.pages = [];
            if(totalElementPages < 1)  {
                return ;
            }
            //初始化页面数据
            $scope.initPages(totalElementPages);
            if(currentPage < 6) {//当期页小于6
                $scope.frontSegment(currentPage, totalElementPages);
            }else if(currentPage > totalElementPages - 5) { //当期页在后面
                $scope.endSegment(currentPage, totalElementPages);
            }else { //当期页在中间
                $scope.middleSegment(currentPage);
            }
        };

        // 筛选消息分类
        $scope.chooseClasses = function () {
            $scope.params.classes = $scope.classes;
            getData();
        };

        // 时间排序
        $scope.orderTime = function () {
            $scope.params.timeSorting = $scope.params.timeSorting == 'DESC' ? 'ASC' : 'DESC';
            getData();
        };

        // 全选
        $scope.chooseAll = function() {
            angular.forEach($scope.messageCurrent, function (message) {
                message.isChoosed = $scope.isChoosedAll;
            });
        };

        // 单选
        $scope.chooseOne = function (message) {
            message.isChoosed = typeof message.isChoosed == 'unidefined' ? true : message.isChoosed;
            $scope.isChoosedAll = true;
            angular.forEach($scope.messageCurrent, function (message) {
                if (!message.isChoosed) {
                    $scope.isChoosedAll = false;
                }
            });
        };

        var getData = function () {
            InternalMessage.getMessagesPagePrivate($scope.params, function(data) {
                if (data) {
                    $scope.messageAllData = data.messages;
                    $scope.messageCurrent = data.messages.content;
                    angular.forEach($scope.messageCurrent, function(message) {
                        message.messageText.content = $sce.trustAsHtml(message.messageText.content);
                    });
                    $scope.params.currentPage = data.messages.number;
                    $scope.acculatePages(data.messages.number, data.messages.totalPages);
                }
            }, function(response) {
                toaster.pop('error', '获取消息失败，请重新刷新界面，');
            });
        };

        // 批量删除
        $scope.deleteBatch = function () {
            var hasDelete = false;
            angular.forEach($scope.messageCurrent, function (message) {
                if (message.isChoosed) {
                    hasDelete = true;
                }
            });
            if (hasDelete) {
                $scope.isDelete = true;
            } else {
                toaster.pop('error', '请选择要删除的消息');
            }
        };

        // 取消删除
        $scope.cancleDelete = function () {
            $scope.isDelete = false;
        };

        // 确认删除
        $scope.confirmDelete = function () {
            angular.forEach($scope.messageCurrent, function (message) {
                if (message.isChoosed) {
                    $scope.deleteIds.push(message.id);
                }
            });
            InternalMessage.deleteBatchMessage({ids : $scope.deleteIds.join(",")}, {}, function (data) {
                $scope.deleteIds = [];
                $scope.isDelete = false;
                toaster.pop('success', '删除成功');
                getData();
            }, function (response) {
                toaster.pop('error', '删除失败');
            });
        };

        getData();
    }]);
});