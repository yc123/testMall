/**
 * Created by yangck on 2016/11/18.
 */
define(['app/app'], function (app) {
    app.register.controller('supExProcessCtrl', ['$scope', 'AfterSale', 'PuExProcess', 'AfterSaleApplyTypes', 'ngTableParams', 'BaseService', 'toaster', 'ApplyStatus', function ($scope, AfterSale, PuExProcess, AfterSaleApplyTypes, ngTableParams, BaseService, toaster, ApplyStatus) {

        $scope.active = 'all';
        // 选择状态
        $scope.setActive = function(active) {
            if($scope.active != active) {
                window.sessionStorage.setItem('puExStateInAdmin', active);
                $scope.active = active;
                $scope.applyTableParams.page(1);
                $scope.applyTableParams.reload();
            }
        };

        // 获取一页申请单数据
        var getData = function () {
            $scope.applyTableParams = new ngTableParams({
                page: 1,
                count: 5,
                sorting: {
                    updateTime: 'DESC'
                }
            }, {
                total: 0,
                getData: function ($defer, params) {
                    $scope.paginationParams = params;
                    var param = BaseService.parseParams(params.url());
                    param.status = window.sessionStorage.getItem('puExStateInAdmin');
                    PuExProcess.getPuExApplyListForMall(param, function (data) {
                        $defer.resolve(data.content);
                        params.total(data.totalElements);
                    }, function (res) {
                        toaster.pop('error', '获取信息失败 ', res.data);
                    });
                }
            });
        }
        getData();

        $scope.applyTypes = AfterSaleApplyTypes;

        // 检查是否可提交
        $scope.checkApply = function (apply) {
            for (var i = 0; i < apply.applyDetails.length; i++) {
                var detail = apply.applyDetails[i];
                if (apply.status == 'SUP_TO_MALL' && !detail.mallToBuyerApplyType) {
                    apply.canSubmit = false;
                    return;
                }
                if (apply.status == 'BUYER_TO_MALL' && !detail.mallToSupApplyType) {
                    apply.canSubmit = false;
                    return;
                }
            }
            apply.canSubmit = true;
        }

        // 抓取申请明细信息
        var getApplyDetailInfo = function (apply, detail) {
            var applyDetailInfo = {};
            if (apply.status == 'SUP_TO_MALL') {
                applyDetailInfo.applyType = detail.mallToBuyerApplyType;
                applyDetailInfo.applyReason = detail.mallToBuyerApplyReason;
            } else if (apply.status == 'BUYER_TO_MALL') {
                applyDetailInfo.applyType = detail.mallToSupApplyType;
                applyDetailInfo.applyReason = detail.mallToSupApplyReason;
            }
            applyDetailInfo.applyDetailId = detail.applyDetailId;
            return applyDetailInfo;
        }

        // 生成申请单信息
        var generateApplyInfo = function (apply) {
            var applyInfo = {};
            applyInfo.applyDetails = [];
            applyInfo.applyId = apply.applyId;
            angular.forEach(apply.applyDetails, function (detail) {
                applyInfo.applyDetails.push(getApplyDetailInfo(apply, detail));
            });
            return applyInfo;
        }

        // 更新
        $scope.updatePuExApply = function (apply) {
            var applyInfo = generateApplyInfo(apply);
            PuExProcess.updatePuExApply({applyId: apply.applyId}, applyInfo, function (data) {
                toaster.pop('success', '发送成功', '您已成功发送信息，请耐心等候！' + data.data);
                $scope.setActive(ApplyStatus.nextPuExStatus(apply.status));
                getData();
            }, function (error) {
                toaster.pop('error', '发送信息失败', error.data);
            })
        }

        // 启动异常流程
        $scope.startPuExProcess = function (apply) {
            var applyInfo = generateApplyInfo(apply);
            PuExProcess.startPuExProcess({applyId : apply.applyId}, applyInfo, function (data) {
                toaster.pop('success', '启动异常流程成功', '您已成功启动异常流程！' + data);
                $scope.setActive('FINISHED');
                getData();
            },function (error) {
                toaster.pop('error', '启动异常流程失败', error.data);
            })
        }

    }])
})