define(['app/app'], function (app) {
    'use strict';
    app.register.controller('showRateCtrl', ['$scope', '$rootScope', '$stateParams', '$filter', 'Order', 'toaster', 'Rate', 'ngTableParams', function ($scope, $rootScope, $stateParams, $filter, Order, toaster, Rate, ngTableParams) {
        $scope.isAnony = 1;
        $scope.goodsRate = [];
        $scope.cont = false;
        $scope.setContFalse = function () {
            $scope.cont = false;
        };
        document.title = '查看评价-优软商城';
        $scope.vendorRate = {};
        if ($stateParams.orderid && $stateParams.orderid != '') {
            $scope.orderid = $stateParams.orderid;
            if (!$scope.orderid) {
                toaster.pop('warning', '没有传入有效的订单信息');
            }
            $scope.$$kdnData = {};
            $scope.showRateTableParams = new ngTableParams({
                page: 1,
                count: 10
            }, {
                total: 0,
                getData: function ($defer, params) {

                    Order.get({orderid: $scope.orderid}, function (data) {
                        if (data.length != 1) {
                            toaster.pop('warning', '获取订单信息失败');
                            return;
                        }
                        $scope.order = data[0];
                        Rate.getRateVendor({orderId: $scope.order.orderid}, function (data) {
                            $scope.vendorRate = data.data;
                        });
                        Rate.getRateGoodsByOrderId({orderId: $scope.order.orderid,page:1,count:10}, function (data) {
                            $scope.$$kdnData.totalElements = data.data.totalElements;
                            if(Number(data.data.totalElements) > 0) {
                                $scope.$$kdnData.start = Number(data.data.size) * (Number(data.data.number) - 1) + 1;
                            }else {
                                $scope.$$kdnData.start = 0;
                            }
                            $scope.$$kdnData.end = Number(data.data.size) * (Number(data.data.number) - 1) + Number(data.data.numberOfElements);
                            $scope.buyerRate = data.data.content;
                            angular.forEach($scope.buyerRate, function (item, index) {
                                for (var i = 0; i < $scope.order.orderDetails.length; i++) {

                                    if (item.goodsId == $scope.order.orderDetails[i].id) {

                                        item.goodsDetail = $scope.order.orderDetails[i];
                                    }
                                }
                            });
                            console.log($scope.buyerRate);
                        });
                        Rate.getRateBuyer({orderId: $scope.order.orderid}, function (data) {
                            $scope.vendorRateBuyer = data.data;
                        });
                    });
                }
            });
        }


        $scope.submit = function () {
            $scope.count = 0;
            for (var i = 0; i < $scope.buyerRate.length; i++) {
                delete $scope.buyerRate[i].goodsDetail;
                if ($scope.buyerRate[i].buyerAfterRate) {
                    $scope.count++;
                }
            }
            if ($scope.count == 0) {
                toaster.pop('error', '您还没有填写追评内容');
                return;
            }
            Rate.saveAfterRateGoods({orderId: $scope.order.orderid}, $scope.buyerRate, function (data) {
                if (data.success) {
                    window.location.href = 'user#/order';
                }
            }, function (error) {
                toaster.pop('error', '评价失败');
            });

        };


    }]);
});