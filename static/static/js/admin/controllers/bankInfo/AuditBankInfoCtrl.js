define(['app/app'], function (app) {
    'use strict';
    app.register.controller('AuditBankInfoCtrl', ['$scope', 'ngTableParams', 'bankInfoService', 'toaster', 'BaseService', function ($scope, ngTableParams, bankInfoService, toaster, BaseService) {

        $scope.active = 'tobeAudit';
        $scope.status = 101;

        $scope.$$auditBankInfo = {};
        $scope.$$auditBankInfo.bankInfoFail = null;

        //设置状态
        $scope.setActive = function (active) {
            if($scope.active != active) {
                $scope.active = active;
                switch ($scope.active) {
                    case 'tobeAudit':
                        $scope.status = 101;
                        break;
                    case 'pass':
                        $scope.status = 104;
                        break;
                    case 'fail':
                        $scope.status = 103;
                        break;
                }
                $scope.bankInfoTableParams.page(1);
                $scope.bankInfoTableParams.reload();
            }
        };

        //table的设置
        $scope.bankInfoTableParams = new ngTableParams({
            page : 1,
            count : 5,
            sorting : {
                createTime : 'DESC'
            }
        }, {
            total : 0,
            getData : function ($defer, params) {
                const param = BaseService.parseParams(params.url());
                param.status = $scope.status;
                param.keyword = $scope.keyword;
                bankInfoService.getPageStatusBankInfo(param, function (data) {
                    params.total(data.totalElements);
                    $defer.resolve(data.content);
                }, function (response) {
                    toaster.pop('error', '获取账户信息失败 ', response.data);
                });
            }
        });

        //搜索
        $scope.onSearch = function () {
            $scope.bankInfoTableParams.reload();
        }

        //审核不通过
        $scope.auditFail = function (info) {
            $scope.$$auditBankInfo.openDiv = true;
            $scope.$$auditBankInfo.bankInfoFail = info;
        };


        //审核通过
        $scope.auditPass = function (info) {
            bankInfoService.auditBankInfoPass({id: info.id},null, function (data) {
                if(data.code == 1) {
                    toaster.pop('success', '已审核通过');
                    $scope.bankInfoTableParams.reload();
                }else {
                    toaster.pop('info', '审核通过失败：' + data.message);
                }
            },function () {
                toaster.pop('error', '审核通过失败，请重新操作');
            });
        };

        //确认审核不通过
        $scope.confirm = function () {
            if(!$scope.$$auditBankInfo.reason) {
                toaster.pop('info', '提示', "请输入审核不通过原因");
                return ;
            }
            bankInfoService.auditBankInfoFail({id : $scope.$$auditBankInfo.bankInfoFail.id}, {reason : $scope.$$auditBankInfo.reason}, function (data) {
                if(data.code == 1) {
                    $scope.bankInfoTableParams.reload();
                    toaster.pop('success', '操作成功');
                    $scope.$$auditBankInfo.openDiv = false;
                    $scope.$$auditBankInfo.reason = null;
                    $scope.$$auditBankInfo.bankInfoFail = null;
                }else {
                    toaster.pop('info', '操作失败：' + data.message);
                }
            }, function (response) {
                console.log(response);
                toaster.pop('error', '审核报错，请重新试试');
            });
        }

        //操作取消
        $scope.cancle = function () {
            $scope.$$auditBankInfo.openDiv = false;
            $scope.$$auditBankInfo.reason = null;
            $scope.$$auditBankInfo.bankInfoFail = null;
        }
    }]);

    app.register.filter('bankStatusFilter', function () {
        return function (status) {
            var result = '未知状态';
            switch (status) {
                case 101:
                    result = '已提交';
                    break;
                case 103:
                    result = '未通过';
                    break;
                case 104:
                    result = '已通过';
                    break;
            }
            return result;
        }
    })
});