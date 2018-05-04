/**
 * Created by yangck on 2016/11/10.
 */
define(['app/app'], function (app) {
    app.register.controller('exceptionApplyDetailsCtrl', ['$scope', 'AfterSale', 'toaster', '$stateParams', 'BaseService', 'AfterSaleApplyTypes', '$location', 'PuExSrc', '$q', function ($scope, AfterSale, toaster, $stateParams, BaseService, AfterSaleApplyTypes, $location, PuExSrc, $q) {
    	//BaseService.scrollBackToTop();

        /*************************** get data ***************************/
        var getData = function () {
            return AfterSale.getPuExApplyByApplyId({applyId : $stateParams.applyId}, {}, function (data) {
                $scope.apply = data;
                $scope.purchase = data.purchase;
            }, function (error) {
                toaster.pop('error', '获取数据失败', error.data);
            })
        }

        $q.all([getData().$promise]).then(function () {
            if($scope.apply.sellerRead == false) {
                sellerSetApplyMsgRead($scope.apply.applyId);
            }
        })

        /**
         * 卖家设置异常申请消息为已读
         */
        var sellerSetApplyMsgRead = function (applyId) {
            PuExProcess.sellerSetApplyMsgRead({applyId: applyId}, null, function () {

            }, function (error) {
                toaster.pop('error', '设置异常申请消息为已读失败', error)
            })
        }

        $scope.applyTypes = AfterSaleApplyTypes;
        $scope.puExSrc = PuExSrc;


        // 同意处理
        /*$scope.agreeHandling = function () {
            AfterSale.supAgreeHandling({applyId : $scope.apply.applyId}, {}, function (data) {
                toaster.pop('success', '同意处理成功', data);
                $location.path('#/cusPurchase');
            }, function (error) {
                toaster.pop('error', '同意处理失败,请联系商城客服人员', error.data);
            })
        };*/

        // 取消申请
        $scope.cancelApply = function () {
            AfterSale.supCancelApply({applyId : $scope.apply.applyId}, {}, function (data) {
                toaster.pop('success', '取消申请成功', data);
                $location.path('vendor#/cusPurchase');
            }, function (error) {
                toaster.pop('error', '同意处理失败,请联系商城客服人员', error.data);
            })
        }

    }]);
})