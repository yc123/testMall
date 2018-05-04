/**
 * Created by yujia on 2017/3/24.
 *  售后的控制器
 */
define(['app/app'], function(app) {
    "use strict";
    app.register.controller('vendorAfterSaleCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
        $rootScope.active = 'vendor_after_sale';
    }]);
});
