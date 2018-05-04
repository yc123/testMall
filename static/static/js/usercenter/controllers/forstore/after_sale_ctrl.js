/**
 * Created by yujia on 2017/3/19.
 *  申请售后的控制器
 */
define(['app/app'], function(app) {
    app.register.controller('afterSaleCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
        $rootScope.active = 'after_sale';
        console.log('afterSaleCtrl');
    }]);
});