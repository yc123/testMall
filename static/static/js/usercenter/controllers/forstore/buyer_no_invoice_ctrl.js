define([ 'app/app' ], function(app) {
    'use strict';
    app.register.controller('NoInvoiceCtrl', ['$scope','$rootScope','$modal', 'Order', 'toaster','ngTableParams','BaseService','Bill', function ($scope, $rootScope, $modal, Order, toaster, ngTableParams, BaseService, Bill) {
        $scope.tab = 'buyer_no_invoice';
        document.title = '未开票订单-优软商城';
        // 开票申请
        $scope.applyInvoice = function () {
            var applyItem = [];
            angular.forEach($scope.orderData, function (item) {
                if (item.checked) {
                    applyItem.push(item);
                }
            })
            if (applyItem.length > 0) {
                if ($scope.invoices.length > 0) {
                    $modal.open({
                        templateUrl : $rootScope.rootPath + '/static/view/usercenter/modal/apply-invoice.html',
                        size : 'lg',
                        controller : 'NoInvoiceSubmitCtrl',
                        resolve : {
                            submitInvoice : function () {
                                return applyItem;
                            },
                            invoiceData: function () {
                                return $scope.invoices;
                            }
                        }
                    })
                } else {
                    toaster.pop('error','请前往开票信息页面新增发票');
                }
            } else {
                toaster.pop('error','请勾选未开票订单');
            }
        };
        var initDataRule = function () {
            $scope.param = {
                page : 1,
                count : 10,
                status : 520,
                sorting: {creattime : "DESC"},
                keyword : ''
            };
            $scope.keyword = '';

            Bill.getListPersonal(null, function(data) {
                $scope.invoices = data;
            }, function(response) {
                toaster.pop('error', '获取发票信息失败 ' + response.data);
            });
        }
        initDataRule();

        $scope.$$kdnData = {};

        var initTable = function () {
            $scope.orderBillTableParam = new ngTableParams($scope.param,{
                total : 0,
                getData : function ($defer, params) {
                    var param = BaseService.parseParams(params.url());
                    // param.pageParams.sorting = {creattime : "DESC"};
                    param.keyword = $scope.keyword;
                    Order.getOrderOnBillByPersonal(param, function (page) {
                        $scope.isAllCheck = false;
                        $scope.$$kdnData.totalElements = page.totalElements;
                        if(Number(page.totalElements) > 0) {
                            $scope.$$kdnData.start = Number(page.size) * (Number(page.number) - 1) + 1;
                        }else {
                            $scope.$$kdnData.start = 0;
                        }
                        $scope.$$kdnData.end = Number(page.size) * (Number(page.number) - 1) + Number(page.numberOfElements);
                        params.total(page.totalElements);
                        $defer.resolve(page.content);
                        //划分数据
                        $scope.orderData = page.content;
                        //初始化选中状态
                        angular.forEach($scope.orderData, function (item) {
                            item.checked = false;
                        })
                    }, function (response) {
                        toaster.pop('error', '获取未开票订单信息失败 ', response.data);
                    });
                }
            });
        };
        initTable();

        $scope.searchByKeyword = function () {
            $scope.param.keyword = $scope.keyword;
            initTable();
        }
        $scope.enterEvent = function (e) {
            var keycode = window.event?e.keyCode:e.which;
            if(keycode==13){
                $scope.searchByKeyword();
            }
        }

        //全选状态
        $scope.isAllCheck = false;
        //全选
        $scope.onAllChecked = function () {
            if (!$scope.isAllCheck) {
                angular.forEach($scope.orderData, function (item, index) {
                    item.checked = true;
                })
            } else {
                angular.forEach($scope.orderData, function (item, index) {
                    item.checked = false;
                })
            }
            $scope.isAllCheck = !$scope.isAllCheck;
        }


        //单选
        $scope.checkInvoice = function (item) {
            var temAllCheck = true;
            item.checked = !item.checked;
            angular.forEach($scope.orderData, function (itemss) {
                if (!itemss.checked) {
                    temAllCheck = false;
                }
            })
            $scope.isAllCheck = temAllCheck;
        }

    }]);
    app.register.controller('NoInvoiceSubmitCtrl', ['$scope','$rootScope','$modal', 'Order', 'toaster', 'submitInvoice', '$modalInstance','invoiceData','BillSubmit','$state', function ($scope, $rootScope, $modal, Order, toaster, submitInvoice, $modalInstance, invoiceData, BillSubmit, $state) {
        //公司列表
        $scope.submitInvoice = [];

        //订单数
        $scope.orderCount = submitInvoice.length || 0;

        //总金额
        $scope.allPrice = 0;

        //发票信息
        $scope.invoiceData = {};

        $scope.orderIdArr = [];
        // 数据处理
        $scope.dealData = function () {
            var submitItem = submitInvoice;
            var temStoreIdArr = [];
            var tmpPriceArr = [];
            angular.forEach(submitItem, function (item) {
                var index = temStoreIdArr.indexOf(item.storeid);
                $scope.orderIdArr.push(item.orderid);
                if (index == -1) {
                    temStoreIdArr.push(item.storeid);
                    tmpPriceArr.push({price: item.price, storeName: item.storeName, orderid: item.orderid});
                } else {
                    tmpPriceArr[index].price += item.price;
                }
            })
            angular.forEach(tmpPriceArr, function (item, index) {
                $scope.submitInvoice.push(tmpPriceArr[index]);
                $scope.allPrice += tmpPriceArr[index].price;
            })
        }
        $scope.dealData();

        $scope.hasSpecial = false;
        $scope.hasNormal = false;

        $scope.getInvoiceData = function (invoiceKind) {
            var tmpInvoice = invoiceData;
            if (!invoiceKind) {
                if (tmpInvoice.length == 1) {
                    $scope.invoiceData = tmpInvoice[0];
                    if (tmpInvoice[0].kind == 1205) {
                        $scope.hasSpecial = true;
                    } else if (tmpInvoice[0].kind == 1206) {
                        $scope.hasNormal = true;
                    }
                } else if (tmpInvoice.length > 1) {
                    $scope.getInvoiceData(1206);
                }
            } else {
                angular.forEach(tmpInvoice, function (item) {
                    if (item.kind == 1205) {
                        $scope.hasSpecial = true;
                    }

                    if (item.kind == 1206) {
                        $scope.hasNormal = true;
                    }

                    if (item.kind == invoiceKind) {
                        $scope.invoiceData = item;
                    }
                })
            }
        }

        $scope.getInvoiceData();

        //关闭模态框
        $scope.closeModal = function () {
            $modalInstance.dismiss();
        }

        //提交申请
        $scope.apply = function () {
            BillSubmit.submitBillApply(null, {orderids: $scope.orderIdArr.join(','), invoiceid: $scope.invoiceData.id}, function (data) {
                toaster.pop('success', '申请发票成功');
                $scope.closeModal();
                $state.reload();
            },function (error) {
                toaster.pop('error', '申请发票失败');
            })
        }

    }]);
});
