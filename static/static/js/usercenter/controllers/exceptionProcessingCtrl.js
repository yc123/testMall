/**
 * Created by yangck on 2016/10/27.
 */
define(['app/app'], function(app) {
    'use strict';
    app.register.controller('exceptionProcessingCtrl', ['$scope', 'toaster', 'Order', '$stateParams', '$filter', 'AfterSale', '$location', 'BaseService', 'AfterSaleApplyTypes', function ($scope, toaster, Order, $stateParams, $filter, AfterSale, $location, BaseService, AfterSaleApplyTypes) {
    	BaseService.scrollBackToTop();
    	
        /************************************ general ************************************/
        var enIdFilter = $filter('EncryptionFilter');

        /************************************ data ************************************/
        var getOrderInfo = function () {
            Order.getBuyerOrderDetail({orderid : $stateParams.orderid}, {}, function (data) {
                $scope.order = data;
            })
        }
        getOrderInfo();

        $scope.applyTypes = AfterSaleApplyTypes;

        /************************************ business logic ************************************/
        $scope.applyInfo = {
            batchQty : 0,
            prodQty : 0,
            prodTotalAmount : 0,
            freight : 0,
            totalAmount : 0,
            applyDetails : [],
            cmps : {},
            cmpQty : 0
        };

        // 更新汇总信息
        $scope.updateDetailSummary = function (detail) {
            var applyInfo = $scope.applyInfo;
            if(detail.checked) {
                applyInfo.batchQty++;
                applyInfo.prodQty += detail.number;
                applyInfo.prodTotalAmount += detail.price;
                applyInfo.totalAmount = applyInfo.prodTotalAmount
            }else {
                applyInfo.batchQty--;
                applyInfo.prodQty -= detail.number;
                applyInfo.prodTotalAmount -= detail.price;
                applyInfo.totalAmount = applyInfo.prodTotalAmount;
            }

            if(!applyInfo.cmps[detail.cmpCode]) {
                applyInfo.cmps[detail.cmpCode] = [];
            }
            var cmpBatches = applyInfo.cmps[detail.cmpCode];
            var pos = cmpBatches.indexOf(detail.batchCode);
            if(pos !== -1) {
                cmpBatches.splice(pos, 1);
            }else {
                cmpBatches.push(detail.batchCode);
            }
            if(cmpBatches.toString() == "") {
                delete applyInfo.cmps[detail.cmpCode];
            }
            applyInfo.cmpQty = Object.keys(applyInfo.cmps).length;

            $scope.checkDetails();

        }

        // 检查所有勾选的明细信息的完整性
        $scope.checkDetails = function () {
            if($scope.applyInfo.batchQty < 1) {
                $scope.detailsOK = false;
            }else {
                $scope.detailsOK = true;
            }
            var details = $scope.order.orderDetails, detail;
            for(var i = 0; i < details.length; i++) {
                detail = details[i];
                if(detail.checked) {
                    if(!detail.applyType) {
                        $scope.detailsOK = false;
                        return;
                    }
                }
            }
        }

        /************************************ collect data ************************************/
        // 抓取申请明细信息
        var getApplyDetailInfo = function (detail) {
            var applyDetailInfo = {};
            applyDetailInfo.orderDetailId = detail.detailid;
            if(detail.applyType) {
                applyDetailInfo.applyType = detail.applyType;
            }
            applyDetailInfo.applyReason = detail.applyReason;
            return applyDetailInfo;
        }
        
        // 生成申请单信息
        var generateApplyInfo = function () {
            var applyInfo = $scope.applyInfo;
            applyInfo.orderId = $scope.order.orderid;
            applyInfo.taxRate = $scope.order.taxRate;
            applyInfo.applyDetails = [];
            angular.forEach($scope.order.orderDetails, function (detail,k) {
                if(detail.checked) applyInfo.applyDetails.push(getApplyDetailInfo(detail));
            });
            return applyInfo;
        }

        // 确认申请
        $scope.ensureApply = function () {
            var applyInfo = generateApplyInfo();
            AfterSale.createAfterSaleApply({orderId : $scope.order.orderid}, applyInfo, function (data) {
                toaster.pop('success', '申请成功', '您已成功申请售后服务，请耐心等候商城处理！' + data.data);
                $location.path("home/myOrder_todo");
            },function (error) {
                toaster.pop('error', '申请售后服务失败', error.data);
            })
        }
    }]);
});