/**
 * Created by yujia on 2017/3/24.
 *  原厂认证的控制
 */
define(['app/app'], function(app) {
    "use strict";
    app.register.controller('vendorManufactureCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
        $rootScope.active = 'vendor_manufacture';
    }]);
});
