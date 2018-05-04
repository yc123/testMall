/**
 * Created by yujia on 2017/7/25.
 *
 */
define(['app/app'], function (app) {
    'use strict';
    app.register.controller('downGoodsByEnterpriseCtrl', ['$scope', 'toaster', 'Goods', function ($scope, toaster, Goods) {
        $scope.$$downGoods = {};

        $scope.comfirm = function () {
            if($scope.$$downGoods.eName) {
                Goods.downAllGoodsByEnterprise({eName : $scope.$$downGoods.eName}, function (data) {
                    if(data.code == 1) {
                        toaster.pop('success', '成功', '下架' + data.data + '条数据');
                    }else {
                        toaster.pop('info', '失败', data.message);
                    }
                }, function (response) {
                    toaster.pop('warning', '提示', response.data);
                });
            }
        }
    }]);
});