/**
 * Created by yangck on 2016/11/11.
 */
define(['app/app'], function (app) {
    'use strict';
    app.register.controller('exceptionApplyCtrl', ['$scope', 'toaster', '$stateParams', 'AfterSale', 'Purchase', 'BaseService', '$location', function ($scope, toaster, $stateParams, AfterSale, Purchase, BaseService, $location) {
    	BaseService.scrollBackToTop();
    	
        /*********************************** get data ***********************************/
        var getData = function () {
            Purchase.EntPurchaseDetail({purchaseid : $stateParams.purchaseId}, {}, function (data) {
                $scope.purchase = data;
            }, function (error) {
                toaster.pop('error', '获取采购单信息失败', error.data);
            })
        };
        getData();

        /************************************ business logic ************************************/
        $scope.canSubmit = false;

        $scope.checkCanSubmit = function () {

        }

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

            var details = $scope.purchase.purchaseDetails, detail;
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
                    applyDetailInfo.purchaseDetailId = detail.detailid;
                applyDetailInfo.orderDetailId = detail.orderdetailid;
                if(detail.applyType) {
                    applyDetailInfo.applyType = detail.applyType;
                }
                applyDetailInfo.applyReason = detail.applyReason;
                return applyDetailInfo;
            }

        // 生成申请单信息
        var generateApplyInfo = function () {
            var applyInfo = $scope.applyInfo;
            applyInfo.purchaseId = $scope.purchase.purchaseid;
            applyInfo.taxRate = $scope.purchase.currency == 'RMB' ? 0.17 : 0;
            applyInfo.applyDetails = [];
            angular.forEach($scope.purchase.purchaseDetails, function (detail) {
                if(detail.checked) applyInfo.applyDetails.push(getApplyDetailInfo(detail));
            });
            delete applyInfo.cmps;
            return applyInfo;
        }

        // 确认申请
        $scope.ensureApply = function () {
            var applyInfo = generateApplyInfo();
            AfterSale.createPuExApply({purchaseId : $scope.purchase.purchaseid}, applyInfo, function (data) {
                toaster.pop('success', '申请成功', '您已成功申请售后服务，请耐心等候商城处理！' + data.data);
                $location.path("cusPurchase");
            },function (error) {
                toaster.pop('error', '申请异常流程失败', error.data);
            })
        }
    }])
});