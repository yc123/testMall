/**
 * Created by yangck on 2016/11/2.
 */
define(['app/app'], function(app) {
    'use strict';
    app.register.controller('exceptionProcessingDetailCtrl', ['$scope', 'toaster', 'Order', '$stateParams', '$filter', 'AfterSale', '$location', '$q', 'BaseService', 'OrExSrc', 'AfterSaleApplyTypes', function ($scope, toaster, Order, $stateParams, $filter, AfterSale, $location, $q, BaseService, OrExSrc, AfterSaleApplyTypes) {
    	BaseService.scrollBackToTop();
    	
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
            return AfterSale.query({orderId : $stateParams.orderid}, function (data) {
                $scope.apply = data;
                $scope.order = $scope.apply.order;
            }, function (error) {
                toaster.pop("error", "获取申请单信息失败", error.data);
            })
        }
        $scope.applyTypes = AfterSaleApplyTypes;
        $scope.orExSrc = OrExSrc;


        /************************************ init ************************************/
        var init  = function () {
            $q.all([getApplyInfo().$promise]).then(function () {
                if($scope.apply.buyerRead == false) {
                    buyerSetApplyMsgRead($scope.apply.applyId);
                }
            });
        };
        init();

        /**
         * 买家设置异常申请消息为已读
         */
        var buyerSetApplyMsgRead = function (applyId) {
            AfterSale.buyerSetApplyMsgRead({applyId: applyId}, null, function (data) {

            }, function (error) {
                toaster.pop('error', '设置异常申请消息为已读', error);
            })
        }
        /************************************ business logic ************************************/
        // 更新申请明细
        /*$scope.refreshDetail = function (detail) {
            var apply = $scope.apply;
            if(detail.buyerToMallApplyType == 'RETURN') {
                apply.totalAmount = apply.prodTotalAmount + detail.price;
            }else if(detail.buyerToMallApplyType == 'EXCHANGE') {
                apply.totalAmount = apply.prodTotalAmount - detail.price;
            }
        }*/


        /************************************ collect data ************************************/
            // 抓取申请明细信息
        var getApplyDetailInfo = function (detail) {
                var applyDetailInfo = {};
                applyDetailInfo.applyDetailId = detail.applyDetailId;
                applyDetailInfo.applyType = detail.negotiations.last().buyerToMallApplyType;
                applyDetailInfo.applyReason = detail.negotiations.last().buyerToMallApplyReason;
                return applyDetailInfo;
            }

        // 生成申请单信息
        var generateApplyInfo = function () {
            var applyInfo = {};
            applyInfo.applyDetails = [];
            applyInfo.orderId = $scope.order.orderid;
            applyInfo.applyId = $scope.apply.applyId;
            angular.forEach($scope.apply.applyDetails, function (detail,k) {
                applyInfo.applyDetails.push(getApplyDetailInfo(detail));
            });
            return applyInfo;
        }

        /************************************ operation ************************************/

        // 确认更新
        // $scope.updateAfterSaleApply = function () {
        //     var applyInfo = generateApplyInfo();
        //     AfterSale.updateAfterSaleApply({applyId : $scope.apply.applyId}, applyInfo, function (data) {
        //         toaster.pop('success', '申请成功', '您已成功更新售后服务，请耐心等候商城处理！' + data.data);
        //         $location.path("home/myOrder_todo");
        //     },function (error) {
        //         toaster.pop('error', '更新售后服务失败', error.data);
        //     })
        // }

        // 取消
        $scope.cancelApply = function () {
            AfterSale.cancelApply({applyId : $scope.apply.applyId}, {} ,function (data) {
                toaster.pop("success", "取消成功", "您已成功取消售后服务" + data.data);
                $location.path("home/myOrder_todo");
            },function (error) {
                toaster.pop("error", "取消失败", error.data);
            })
        }

        // 同意处理
        // $scope.agreeHandling = function () {
        //     var applyInfo = {};
        //     applyInfo.applyId = $scope.apply.applyId;
        //     applyInfo.serviceEvaluationGrade = $scope.apply.serviceEvaluationGrade || '';
        //     applyInfo.serviceEvaluationContent = $scope.apply.serviceEvaluationContent || '';
        //
        //     AfterSale.agreeHandling({applyId : $scope.apply.applyId}, applyInfo ,function (data) {
        //     	var result = ""
        //     	if(data.EXCHANGE) {
        //     		result = "换货单号：" + data.EXCHANGE;
        //     	}
        //     	if(data.RETURN) {
        //     		result = " 退货单号：" + data.RETURN;
        //     	}
        //         toaster.pop("success", "同意处理成功", "您已成功同意售后处理 " + result);
        //         $location.path("home/myOrder_todo");
        //     },function (error) {
        //         toaster.pop("error", "同意处理失败", error.data);
        //     })
        // }
    }]);
});