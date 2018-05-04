/**
 * Created by yujia on 2017/3/23.
 *  卖家中心首页
 */
define(['app/app', 'calendar'], function(app) {
    'use strict';
    app.register.controller('vendorIndexCtrl', ['$scope', 'toaster', 'VendorService', '$rootScope', 'News', '$filter', '$modal', 'DistributionRule', '$q', 'User', function($scope, toaster, VendorService, $rootScope, News, $filter, $modal, DistributionRule, $q, User) {
        $rootScope.active = 'index';
        $scope.count = 0;
        $scope.userInfo = $rootScope.userInfo;

        $scope.toAccount = function(){
            User.isDevOrProd(null, function(data){
                $scope.isProd = data.data;
                if ($scope.isProd == 'success') {
                    var urlPrex = 'https://account.ubtob.com';
                } else {
                    var urlPrex = 'http://113.105.74.135:8001';
                }
                var url = urlPrex + '/sso/change/userspace?businessCode='+$scope.userInfo.enterprise.enBussinessCode;
                $.ajax({
                    url:url,
                    dataType:'jsonp',
                    processData: false,
                    type:'get',
                    crossDomain: true,
                    jsonp:'callback',
                    jsonpCallback:"successCallback",
                    success:function(data){
                        console.log(data);
                        window.open(urlPrex + '/sso/center?type=apply');
                    },
                    error:function(data) {
                        console.log(data);
                    }
                });
            }, function(response) {
            });
        };

        //个人账户
        if (!$rootScope.userInfo.enterprise){
            window.location.href = './personalMaterial';
        } else {
            $scope.isAdmin = $rootScope.userInfo.enterprise.enAdminuu === $rootScope.userInfo.userUU ? true : false;
        }
        VendorService.getVendorInfo(null, function(data){
            $scope.vendor = data;
        }, function(response) {
            toaster.pop('error', '获取卖家的信息失败，请重新刷新界面获取' + response.data);
        });

        VendorService.getTransactionInfo(null, function(data) {
            $scope.transition = data;
        }, function (response) {
            toaster.pop('error', '获取商家的交易信息失败');
        });

        VendorService.getNotDealApplyCount({businessCode: $scope.userInfo.enterprise.enBussinessCode}, function (data) {
            console.log(data);
            $scope.count = data.data;
        },function (err) {
            toaster.pop('error', '获取未处理审批数据失败');
        })

        var num = $filter('number')(0.1, 6);
        // console.log(num);

        /**
         *  日历组件
         * 
         */
        $('#date').calendar({
            width: 270,
            height: 220
        });

        // News.get({}, {}, function (data) {
        //     $scope.news = data;
        // }, function (res) {
        //
        // });

        var initRuleCount = function () {
            return DistributionRule.findCountOfActiveRule({},{},function (data) {
                if (data.success){
                    $scope.needShowTip = data.data;
                }
            }, function (error) {
                toaster.pop("error", error.data);
            })
        };

        //安全设置提醒框
        $scope.openHomeCenterModel = function() {
            var modalInstance = $modal.open({
              animation: true,
              templateUrl: $rootScope.rootPath + '/static/view/usercenter/modal/homeCenter_modal.html',
              controller:'homeModalCtrl'
            });
            modalInstance.result.then(function(){
            }, function(){
            });
        }

        //安全级别
        if(!($scope.userInfo.pwdEnable && $scope.userInfo.haveUserQuestion && ($scope.userInfo.userEmail==null?false:true))){
            $scope.openHomeCenterModel();
        } else {
            $q.all([initRuleCount().$promise]).then(function (data) {
                if (data){
                    if ($scope.needShowTip){
                        $modal.open({
                            animation: true,
                            templateUrl: 'static/view/common/modal/delivery_rule_modal.html',
                            controller: 'rule_tip_ctrl',
                            resolve : {
                                type : function() {
                                    return 'center';
                                },
                                tipModal : function() {
                                    return true;
                                },
                                success : function () {
                                    return false;
                                },
                                uuid: function () {
                                    return null;
                                }
                            }
                        });
                    }
                }
            });
        }

    }]);

    app.register.controller('homeModalCtrl', ['$rootScope', '$scope',  '$modalInstance', 'toaster', '$http', 'ShippingAddress','$state', function($rootScope, $scope, $modalInstance, toaster, $http, ShippingAddress,$state){
        $rootScope.$on('$stateChangeStart',
          function(event, toState, toParams, fromState, fromParams){
            $modalInstance.dismiss();
        })
        $scope.goLink = function(op) {
            $state.go('vendor_account_management',{op:op});
            $modalInstance.dismiss('cancel');
        }

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        }
    }]);
});