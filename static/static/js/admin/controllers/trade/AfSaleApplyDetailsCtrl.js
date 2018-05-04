/**
 * Created by yangck on 2016/11/4.
 */
define(['app/app'], function(app) {
    'use strict';
    app.register.controller('AfSaleApplyDetailsCtrl', ['$scope', 'toaster', 'Order', '$stateParams', '$filter', 'AfterSale', '$location', '$q', 'AfterSaleApplyTypes', 'OrExSrc', function ($scope, toaster, Order, $stateParams, $filter, AfterSale, $location, $q, AfterSaleApplyTypes, OrExSrc) {

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
            return AfterSale.getApplyByApplyIdForMall({applyId : $stateParams.applyId}, function (data) {
                $scope.apply = data.apply;
                $scope.order = $scope.apply.order;
                $scope.buyerEnName = data.buyerEnName;
                $scope.buyer = data.buyer;
                $scope.deliveryTime = data.deliveryTime;
            }, function (error) {
                toaster.pop("error", "获取申请单信息失败", error.data);
            })
        }
        $scope.applyTypes = AfterSaleApplyTypes;
        $scope.orExSrc = OrExSrc;


        /************************************ init ************************************/
        var init  = function () {
            $q.all([getApplyInfo().$promise]).then(function () {

            });
        }
        init();

        /************************************ business logic ************************************/
        // 更新
        $scope.checkApply = function (apply) {
            for(var i = 0; i < apply.applyDetails.length; i++) {
                var detail = apply.applyDetails[i];
                if(apply.status == 'BUYER_TO_MALL' && !detail.mallToSupApplyType) {
                    apply.canSubmit = false;
                    return;
                }
                if(apply.status == 'SUP_TO_MALL' && !detail.mallToBuyerApplyType) {
                    apply.canSubmit = false;
                    return;
                }
            }
            apply.canSubmit = true;
            console.log(apply.canSubmit)
        }


        /************************************ collect data ************************************/
            // 抓取申请明细信息
        var getApplyDetailInfo = function (apply, detail) {
                var applyDetailInfo = {};
                if(apply.status == 'BUYER_TO_MALL') {
                    applyDetailInfo.applyType = detail.mallToSupApplyType;
                    applyDetailInfo.applyReason = detail.mallToSupApplyReason;
                }else if(apply.status == 'SUP_TO_MALL') {
                    applyDetailInfo.applyType = detail.mallToBuyerApplyType;
                    applyDetailInfo.applyReason = detail.mallToBuyerApplyReason;
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

        /************************************ operation ************************************/

        // 更新售后协商信息
        $scope.updateAfterSaleNeg = function (apply) {
            var applyInfo = generateApplyInfo(apply);
            AfterSale.updateAfterSaleApply({applyId : apply.applyId}, applyInfo, function (data) {
                toaster.pop('success', '发送成功', '您已成功发送信息，请耐心等候！' + data.data);
                window.location.href = 'admin_n#/trade/buyerExProcess';
                $location.path('/trade/buyerExProcess');
            },function (error) {
                toaster.pop('error', '发送信息失败', error.data);
            })
        }

        // 启动异常流程
        $scope.startOrExProcess = function (apply) {
            var applyInfo = generateApplyInfo(apply);
            AfterSale.startOrExProcess({applyId : apply.applyId}, applyInfo, function (data) {
                var exchangeInfo, returnInfo;
                if(data.EXCHANGE) {
                    exchangeInfo = "换货单号：" + data.EXCHANGE;
                }
                if(data.RETURN) {
                    returnInfo = " 退货单号：" + data.RETURN;
                }
                toaster.pop('success', '启动异常流程成功', '您已成功启动异常流程！' + exchangeInfo + "，" + returnInfo);
                $scope.setActive('FINISHED');
                getData();
            },function (error) {
                toaster.pop('error', '发送信息失败', error.data);
            })
        }

    }]);
});