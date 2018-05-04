define(['app/app'], function(app) {
    'use strict';
    app.register.controller('firstRateCtrl', ['$scope', '$rootScope', '$stateParams','$filter','Order', 'toaster', 'Rate', function ($scope, $rootScope, $stateParams , $filter , Order , toaster , Rate) {
        document.title = '初次评价-优软商城';
        $scope.isAnony = 1;
        $scope.goodsRate =[];
        $scope.vendorRate = {};
        $scope.$$kdnData ={};
        $scope.$$kdnData.start=1;
        $scope.$$kdnData.end = 1;
        $scope.cont =false;
        $scope.setContFalse = function () {
            $scope.cont = false;
        };

        if ($stateParams.orderid && $stateParams.orderid != '') {
            $scope.orderid = $stateParams.orderid;
            if(!$scope.orderid) {
                toaster.pop('warning', '没有传入有效的订单信息');
            }
            Order.get({orderid : $scope.orderid}, function (data) {
                if(data.length != 1) {
                    toaster.pop('warning', '获取订单信息失败');
                    return ;
                }
                $scope.order = data[0];
                $scope.$$kdnData.totalElements = $scope.order.orderDetails.length;
                for (var i=0; i < $scope.order.orderDetails.length;i++){
                    $scope.goodsRate[i] = {};
                    $scope.goodsRate[i].level = 1;
                    $scope.goodsRate[i].isAnony = $scope.isAnony;
                }

                console.log($scope.goodsRate);
            });
        }

        $scope.submit = function () {
            if ($scope.descObj.a == 0 || $scope.descObj.b == 0 || $scope.descObj.c == 0){
                toaster.pop('error', '请先对店铺进行评价');
                return;
            }
            for (var i=0; i < $scope.order.orderDetails.length;i++){
                $scope.goodsRate[i].isAnony = $scope.isAnony;
                if ( $scope.goodsRate[i].buyerRate == null){
                    $scope.goodsRate[i].buyerRate = '此用户没有填写评价！';
                }
                $scope.goodsRate[i].goodsId = $scope.order.orderDetails[i].id;
                $scope.goodsRate[i].storeId = $scope.order.orderDetails[i].storeid;
                $scope.goodsRate[i].enuu = $scope.order.orderDetails[i].supEnuu;
            }
            var params = {};
            params.goodsRate = $scope.goodsRate;
            params.vendorRate = {enuu : $scope.order.sellerenuu,
                storeId : $scope.order.storeid,
                describeLevel : $scope.descObj.a,
                vendorLevel : $scope.descObj.b,
                logisticsLevel : $scope.descObj.c};
            Rate.saveBuyerRate({orderId : $scope.order.orderid},params,function (data) {
                if (data.success){
                    window.location.href='user#/order';
                }

            },function (error) {
                toaster.pop('error', '评价失败');
            });

        };

        /**
         * 获取买家评价店铺的信息
         */

        $scope.saveRateGoods = function () {
            Rate.saveRateGoods({orderId : $scope.order.orderid},{}, function (data) {
                if(data.length != 1) {
                    toaster.pop('warning', '获取订单信息失败');
                    return ;
                }
            }, function() {
                toaster.pop('warning', '评价失败。');
            });
        };

        $scope.descObj = {};
        $scope.descObj.a = 0;
        $scope.descObj.b = 0;
        $scope.descObj.c = 0;

        $scope.setLevel = function (type, level) {
            $scope.descObj[type] = level;
        }

        $scope.listenRateContent = function ($index) {
            var str = $scope.goodsRate[$index].buyerRate;
            if (str.length > 200) {
                var el = angular.element('#rateContent');
                el.blur();
                $scope.goodsRate[$index].buyerRate = str.substring(0, 200);
                el.focus();
            }
        }

    }]);
});