define([ 'app/app' ], function(app) {
    'use strict';
    app.register.controller('buyerInvoiceRecordCtrl', ['$scope','$rootScope','$modal','BillSubmit','BaseService', 'toaster','ngTableParams', function ($scope, $rootScope, $modal, BillSubmit, BaseService, toaster, ngTableParams) {
        $scope.tab = 'buyer_invoice-record';
        // 开票申请
        $scope.keyword = '';
        $scope.invoiceType = '';
        document.title = '开票记录-优软商城';
        var initDataRule = function () {
            $scope.param = {
                page: 1,
                count: 10,
                sorting: {
                    createTime : "DESC"
                },
                keyword: '',
                invoiceType: '',
                status: '',
                role: 'BUYER'
            };
        };
        initDataRule();

        // 切换发票类型
        $scope.changeInvoiceType = function(invoiceType) {
            $scope.invoiceType = invoiceType;
            $scope.billRecordTableParam.page(1);
            $scope.billRecordTableParam.reload();
        };

        // 切换状态
        $scope.changeStatus = function (status) {
            $scope.status = status;
            $scope.billRecordTableParam.page(1);
            $scope.billRecordTableParam.reload();
        };

        $scope.$$kdnData = {};
        var initTable = function () {
            $scope.billRecordTableParam = new ngTableParams($scope.param,{
                total : 0,
                getData : function ($defer, params) {
                    var param = BaseService.parseParams(params.url());
                    param.keyword = $scope.keyword;
                    param.invoicetype = $scope.invoiceType;
                    param.status = $scope.status;
                    BillSubmit.getSubmitBillApply(param, function (page) {
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
                        $scope.billData = page.content;
                    }, function (response) {
                        toaster.pop('error', '获取开票记录失败 ', response.data);
                    });
                }
            });
        };
        initTable();
        
        $scope.searchByKey = function () {
            $scope.param.keyword = $scope.keyword;
            initTable();
        }
        $scope.enterEvent = function (e) {
            var keycode = window.event?e.keyCode:e.which;
            if(keycode==13){
                $scope.searchByKey();
            }
        }
    }]);
});
