
define(['app/app', 'calendar'], function(app) {
    'use strict';
    app.register.controller('vendorQueryLogisticsCtrl', ['$scope', '$rootScope', 'BaseService', 'KdnLogistics', '$stateParams', '$filter', 'Logistics', 'Purchase', 'toaster', function($scope, $rootScope, BaseService, KdnLogistics, $stateParams, $filter, Logistics, Purchase, toaster) {

        $rootScope.active = 'vendor_order';
        document.title = '物流详情-优软商城';
        // 加密过滤器
        var enIdFilter = $filter('EncryptionFilter');

        //配送方式列表
        $scope.deliveryMethod = {
            1301 : '第三方配送',
            1302 : '卖家配送',
            1303 : '上门自提'
        };

        /**
         *  查询物流信息(由于接口需要真实运单号)
         *
         *  @param  kdnCompanyName	快递公司名称
         *  @param	logisticsCode	运单号
         *
         */
        if ($stateParams.purchaseid && $stateParams.purchaseid != '') {
            $scope.purchaseid = $stateParams.purchaseid;
            if(!$scope.purchaseid) {
                toaster.pop('warning', '没有传入有效的订单信息');
            }
            Purchase.get({purchaseId : $scope.purchaseid}, function (data) {
                if(data.code != 1) {
                    toaster.pop('warning', '获取订单信息失败');
                }else {
                    $scope.purchase = data.data;
                    $scope.address = JSON.parse($scope.purchase.jsonAddress);
                    if (!data.data.lgtId) {
                        getPurchaseStatus($scope.purchase.status);
                        $scope.logisticsInfo = [];
                        return;
                    }
                    Logistics.findLogisticsById({lgtid: data.data.lgtId}, function(data){
                        $scope.logistics = data;
                        var params = {};
                        params.companyName = $scope.logistics.companyName;
                        params.logisticsCode = $scope.logistics.number;
                        KdnLogistics.kdnQuery(params, {}, function(response){
                            if(!response.errorInfo) {
                                $scope.logisticsInfo = eval ("(" + response.traces + ")");
                                statusOfLogistics($scope.logisticsInfo[$scope.logisticsInfo.length - 1].AcceptStation);
                                $scope.hasInfo = true;
                            }
                        }, function(){
                            $scope.logisticsInfo = [];
                            toaster.pop('info', '查询物流信息失败,请核对物流公司和运单号');
                        });
                    }, function(){
                        toaster.pop('info', '根据快递ID查询跟订单相关联的物流信息失败');
                    });
                }

            }, function() {
                toaster.pop('warning', '获取订单信息失败。');
            });
        }

        $scope.status = "tobereceiving";

        var getPurchaseStatus = function (status) {
            // 405-503-514-506-511-520,成功的订单
            var success = '405-503-514-506-511-520';
            if (success.indexOf(status) != -1) {
                $scope.status = "signin";
            }
        };
        // 判断物流信息状态
        var statusOfLogistics = function(str) {
            if(str.indexOf("揽件")!=-1 || str.indexOf("收件")!=-1 || str.indexOf("转运")!=-1||str.indexOf("运输")!=-1||str.indexOf("发往")!=-1||
                str.indexOf("发出")!=-1||str.indexOf("收入")!=-1||str.indexOf("扫描")!=-1||str.indexOf("到达")!=-1){
                $scope.status = "transit";
            }
            if(str.indexOf("派送")!=-1 || str.indexOf("派件")!=-1){
                $scope.status = "send";
            }
            if(str.indexOf("签收")!=-1){
                $scope.status = "signin";
            }
        }
        // 联系卖家弹框
        $scope.contactBNox = false;
        $scope.contactSeller = function () {
            $scope.contactBNox = !$scope.contactBNox;
        };
        $scope.closeBox = function () {
            $scope.contactBNox = false;
        };
        /**
         *  日历组件
         *
         */
        $('#date').calendar({
            width: 270,
            height: 220
        });

    }]);




});

