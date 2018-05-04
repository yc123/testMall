/**
 * Created by yujia on 2017/3/24.
 *  库存寄售的控制器
 */
define(['app/app'], function (app) {
    "use strict";
    app.register.controller('vendorStockAgentCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
        $rootScope.active = 'vendor_stock_agent';
    }]);
});
