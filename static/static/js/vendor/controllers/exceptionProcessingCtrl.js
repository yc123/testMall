/**
 * Created by yangck on 2016/11/7.
 */
define(['app/app'], function (app) {
    'use strict';
    app.register.controller('exceptionProcessingCtrl', ['$scope', 'toaster', 'AfterSale', 'BaseService', 'ngTableParams', 'AfterSaleApplyTypes', function ($scope, toaster, AfterSale, BaseService, ngTableParams, AfterSaleApplyTypes) {
        /************************************ general ************************************/
    	BaseService.scrollBackToTop();
    	
    	// shortcuts for get last element of an array
        if (!Array.prototype.last){
            Array.prototype.last = function(){
                return this[this.length - 1];
            };
        };

        $scope.active = 'all';
        // 选择状态
        $scope.setActive = function(state) {
            if($scope.active != state) {
                $scope.active = state;
            }
        };

        $scope.applyTypes = AfterSaleApplyTypes;

        /************************************ data ************************************/
        var getData = function () {
            $scope.applyDetailTableParams = new ngTableParams({
                page : 1,
                count : 10
            }, {
                total : 0,
                getData : function ($defer, params) {
                    $scope.paginationParams = params;
                    var pageParams = params.url();
                    AfterSale.getApplyDetailList(BaseService.parseParams(pageParams), function (data) {
                        $defer.resolve(data.content);
                        params.total(data.totalElements);
                    }, function (res) {
                        toaster.pop('error', '获取信息失败 ', res.data);
                    })
                }
            })
        }
        getData();

        /************************************ operation ************************************/
        $scope.ensureSend = function (applyDetail) {
            var info = {};
            info.applyType = applyDetail.applyType;
            info.applyReason = applyDetail.applyReason;
            info.applyDetailId = applyDetail.applyDetailId;
            AfterSale.updateApplyDetailBySup({}, info, function (data) {
                toaster.pop("success", "确认成功", "请耐心等待");
                getData();
            }, function (error) {
                toaster.pop("error", "确认失败", error.data);
            })
        }
    }])
})