define([ 'app/app' ], function(app) {
    'use strict';
    app.register.controller('vendorInvoiceCtrl', ['$scope','$rootScope','$modal','BillSubmit','BaseService', 'toaster','ngTableParams','$state', function ($scope, $rootScope, $modal, BillSubmit, BaseService, toaster, ngTableParams, $state) {
        $rootScope.active = 'vendor_invoice';
        // 切换tab
        document.title = '卖家发票管理-优软商城';
        $scope.active = 'apply_invoice';
        $scope.toggleTab = function (t) {
            if (t=='apply_invoice') {
                initDataRule(101);
            } else {
                initDataRule(102);
            }
            initTable();
            if ($scope.isAllCheck) {
               $scope.onAllChecked();
            }
            $scope.active = t;
        };

        var initDataRule = function (stateNum) {
            // $scope.param = {};
            // $scope.pageparam = {};
             $scope.keyword = '';
             $scope.billType = 1;
            // $scope.role = 'SELLER';
            // $scope.status = stateNum;
            // $scope.pageparam.page = 1;
            // $scope.pageparam.count = 10;
            // $scope.pageparam.sorting = {createTime : "DESC"};
            $scope.param = {
                page : 1,
                count : 10,
                status : stateNum,
                sorting: {createTime : "DESC"},
                keyword : '',
                role :'SELLER',
                invoicetype: ''
            };

            // $scope.param.pageParams = $scope.pageparam;
            // $scope.param.keyword = $scope.keyword;
            // $scope.param.role = $scope.role;
            // $scope.param.status = $scope.status;
        }
        initDataRule(101);

        $scope.$$kdnData = {};
        var initTable = function () {
            $scope.billRecordTableParam = new ngTableParams($scope.param,{
                total : 0,
                getData : function ($defer, params) {
                    var param = BaseService.parseParams(params.url());
                //    param.pageParams.sorting = {creattime : "DESC"};
                         param.keyword = $scope.keyword;
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
                        //初始化选中状态和地址信息
                        $scope.isAllCheck = false;
                        angular.forEach($scope.billData, function (item) {
                            var temAddr = item.invoiceAddress.split(',')
                            item.detailAddr = temAddr[3]
                            item.area = temAddr[0]+'  '+temAddr[1]+'  '+temAddr[2]
                            item.checked = false
                        })
                    }, function (response) {
                        toaster.pop('error', '获取开票记录失败 ', response.data);
                    });
                }
            });
        };
        initTable();

        $scope.billTypeSearch = function (billType) {
        //    console.log($scope.billType)
            if (billType == 1) {
                $scope.param.invoicetype  = '';
            } else if (billType == 2) {
                $scope.param.invoicetype  = 1206;
            } else if (billType == 3) {
                $scope.param.invoicetype  = 1205;
            }
            initTable();
        }

        $scope.searchByKey = function (k) {
            $scope.keyword = k;
            initTable();
        }

        $scope.enterEvent = function(e, keyword) {
            var keycode = window.event ? e.keyCode : e.which;
            if(keycode==13){
                $scope.searchByKey(keyword);
            }
        }
        //全选状态
        $scope.isAllCheck = false
        //全选
        $scope.onAllChecked = function () {
            if (!$scope.isAllCheck) {
                angular.forEach($scope.billData, function (item, index) {
                    item.checked = true
                })
            } else {
                angular.forEach($scope.billData, function (item, index) {
                    item.checked = false
                })
            }
            $scope.isAllCheck = !$scope.isAllCheck
        }


        //单选
        $scope.checkInvoice = function (item) {
            var temAllCheck = true
            item.checked = !item.checked
            angular.forEach($scope.billData, function (itemss) {
                if (!itemss.checked) {
                    temAllCheck = false
                }
            })
            $scope.isAllCheck = temAllCheck
        }

        //提交申请
        $scope.submitApply = function () {
            var flag = false;
            angular.forEach($scope.billData, function (item) {
                if (item.checked) {
                    flag = true;
                }
            });
            if (flag) {
                $scope.setShowSubmitBox(true);
            } else {
                toaster.pop('error','请先勾选开票申请');
            }
        }
        
        $scope.setShowSubmitBox = function (flag) {
            $scope.showSubmitBox = flag;
        }

        //确认提交
        $scope.doSubmit = function () {
            var tmpIds = '';
            angular.forEach($scope.billData, function (item) {
                if (item.checked) {
                    tmpIds += item.id + ',';
                }
            });
            tmpIds = tmpIds.substring(0, tmpIds.length-1)
            BillSubmit.sureBillApply({ids: tmpIds}, null, function (data) {
                $state.reload();
                toaster.pop('success','开票成功');
                $scope.setShowSubmitBox(false);
            },function (error) {
                toaster.pop('error','开票失败');
            })
        }

    }]);
});
