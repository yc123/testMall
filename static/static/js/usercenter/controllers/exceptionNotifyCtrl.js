/**
 * Created by yangck on 2016/11/21.
 */
define(['app/app'], function (app) {
    app.register.controller('exceptionNotifyCtrl', ['$scope', '$stateParams', 'toaster', 'PuExProcess', 'AfterSale', '$q', 'AfterSaleApplyTypes', '$location', 'OrExSrc', function ($scope, $stateParams, toaster, PuExProcess, AfterSale, $q, AfterSaleApplyTypes, $location, OrExSrc) {

        $scope.applyTypes = AfterSaleApplyTypes;
        $scope.orExSrc = OrExSrc;


        var getData = function () {
            return PuExProcess.getPuExApplyForBuyer({applyId : $stateParams.applyId}, {}, function (data) {
                $scope.apply = data.purchaseExApply;
                $scope.order = data.order;

            }, function (error) {
                toaster.pop("error", "获取异常通知信息失败", "原因："+error);
            })

        }

        $q.all([getData().$promise]).then(function () {
            $scope.prodAmount = 0;
            angular.forEach($scope.apply.applyDetails, function (detail) {
                $scope.prodAmount += detail.orderDetail.price;
            })
            $scope.totalAmount = $scope.prodAmount + 0;

            if($scope.apply.buyerRead == false) {
                buyerSetNotifyMsgRead($scope.apply.applyId);
            }
        })

        /**
         * 买家设置异常通知消息为已读
         */
        var buyerSetNotifyMsgRead = function (notifyId) {
            AfterSale.buyerSetNotifyMsgRead({notifyId: notifyId}, null, function (data) {

            }, function (error) {
                toaster.pop('error', '买家设置异常通知消息为已读失败', error);
            })
        };

        $scope.canSubmit = false;
        $scope.checkCanSubmit = function (detail) {
            for(var i = 0; i < $scope.apply.applyDetails.length; i++) {
                if(!detail.buyerToMallApplyType) {
                    $scope.canSubmit = false;
                    return;
                }
            }
            $scope.canSubmit = true;
        }

        var generateInfoToSubmit = function (apply) {
            var info = {};
            info.applyId = apply.applyId;
            info.applyDetails = [];
            var detailInfo = {};
            angular.forEach(apply.applyDetails, function (detail) {
                detailInfo.applyDetailId = detail.applyDetailId;
                detailInfo.applyType = detail.buyerToMallApplyType;
                detailInfo.applyReason = detail.buyerToMallApplyReason;
                info.applyDetails.push(detailInfo);
            })

            return info;
        }

        $scope.ensure = function () {
            var info = generateInfoToSubmit($scope.apply);
            PuExProcess.updatePuExApply({applyId : $scope.apply.applyId}, info, function (data) {
                toaster.pop('success', '确认成功，请耐心等候商城处理');
                $location.path('home/myOrder_todo');
            }, function (error) {
                toaster.pop('error', '确认失败', error);
            })
        }
    }])
})