/**
 * Created by yangck on 2016/11/23.
 */
define(['app/app'], function(app) {
    'use strict';
    app.register.controller('supExProcessDetailsCtrl', ['$scope', 'toaster', 'Order', '$stateParams', '$filter', 'AfterSale', '$location', '$q', 'AfterSaleApplyTypes', 'PuExProcess', 'PuExSrc', function ($scope, toaster, Order, $stateParams, $filter, AfterSale, $location, $q, AfterSaleApplyTypes, PuExProcess, PuExSrc) {

        /************************************ general ************************************/
        var enIdFilter = $filter('EncryptionFilter');

        // shortcuts for get last element of an array
        if (!Array.prototype.last){
            Array.prototype.last = function(){
                return this[this.length - 1];
            };
        };

        /************************************ data ************************************/
        var getApplyInfo = function () {
            return PuExProcess.getPuExApplyForMall({applyId : $stateParams.applyId}, function (data) {
                $scope.apply = data.apply;
                $scope.purchase = $scope.apply.purchase;
                $scope.user = data.user;
                $scope.deliveryTime = data.deliveryTime;
            }, function (error) {
                toaster.pop("error", "获取申请单信息失败", error.data);
            })
        }
        $scope.applyTypes = AfterSaleApplyTypes;


        /************************************ init ************************************/
        var init  = function () {
            $q.all([getApplyInfo().$promise]).then(function () {

            });
        }
        init();

        $scope.applyTypes = AfterSaleApplyTypes;
        $scope.puExSrc = PuExSrc;

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
                getApplyInfo();
            }, function (error) {
                toaster.pop('error', '发送信息失败', error.data);
            })
        }

        // 启动异常流程
        $scope.startPuExProcess = function (apply) {
            var applyInfo = generateApplyInfo(apply);
            PuExProcess.startPuExProcess({applyId : apply.applyId}, applyInfo, function (data) {
                toaster.pop('success', '启动异常流程成功', '您已成功启动异常流程！' + data);
                getData();
            },function (error) {
                toaster.pop('error', '启动异常流程失败', error.data);
            })
        }
    }]);
});