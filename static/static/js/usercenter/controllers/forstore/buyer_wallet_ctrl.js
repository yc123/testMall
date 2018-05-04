/**
 * Created by yujia on 2017/3/17.
 *
 */
define(['app/app', 'calendar'], function(app) {
   'use strict';
    app.register.controller('walletCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
        $rootScope.active = 'my_wallet';
        console.log('wallet');
        
        /**
         *  日历组件
         * 
         */
        $('#date').calendar({
            width: 270,
            height: 220
        });
        
    }]);
});