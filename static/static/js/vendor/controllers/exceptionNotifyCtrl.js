/**
 * Created by yangck on 2016/11/14.
 */
define(['app/app'], function(app) {
    'use strict';
    app.register.controller('exceptionNotifyCtrl', ['$scope', 'toaster', '$stateParams', 'AfterSale', '$filter', '$location', 'PuExSrc', 'AfterSaleApplyTypes', '$q', 'PuExProcess', function ($scope, toaster, $stateParams, AfterSale, $filter, $location, PuExSrc, AfterSaleApplyTypes, $q, PuExProcess) {

        var getData = function() {
            return AfterSale.getPuExApplyByApplyId({applyId : $stateParams.applyId}, function (data) {
                $scope.apply = data;
                $scope.purchase = data.purchase;

            }, function (err) {
                toaster.pop('error', '获取数据失败' + err.data);
            })
        }
        $q.all([getData().$promise]).then(function () {
            if($scope.apply.sellerRead == false) {
                sellerSetNotifyMsgRead($scope.apply.applyId);
            }
        });

        /**
         * 卖家设置异常申请消息为已读
         */
        var sellerSetNotifyMsgRead = function (notifyId) {
            PuExProcess.sellerSetNotifyMsgRead({notifyId: notifyId}, null, function (data) {

            }, function (error) {
                toaster.pop('error', '设置异常申请消息为已读失败', error);
            })
        }

        $scope.applyTypes = AfterSaleApplyTypes;
        $scope.puExSrc = PuExSrc;


        $scope.canSubmit = false;

        $scope.checkCanSubmit = function (applyDetail) {
            for(var i = 0; i < $scope.apply.applyDetails.length; i++) {
                if(!applyDetail.supToMallApplyType) {
                    $scope.canSubmit = false;
                    return;
                }
            }
            $scope.canSubmit = true;
        }

        var generateInfoToSubmit = function (apply) {
            var info = {};
            info.applyId = apply.applyId;
            info.detailsInfo = [];
            angular.forEach(apply.applyDetails, function (detail) {
                var detailInfo = {};
                detailInfo.applyDetailId = detail.applyDetailId;
                detailInfo.applyType = detail.supToMallApplyType;
                detailInfo.applyReason = detail.supToMallApplyReason;
                info.detailsInfo.push(detailInfo);
            })

            return info;
        }

        $scope.ensure = function () {
            var info = generateInfoToSubmit($scope.apply);
            AfterSale.sendExNotifyMsgToMall({applyId : $scope.apply.applyId}, info, function (data) {
                toaster.pop('success', '确认成功，请耐心等候商城处理');
                $location.path('cusPurchase');
            }, function (error) {
                toaster.pop('error', '确认失败', error);
            })
        }
    }])
});