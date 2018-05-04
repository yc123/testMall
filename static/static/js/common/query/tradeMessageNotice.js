define(['ngResource'], function () {
    'use strict';
    angular.module('tradeMessageNoticeModule', ['ngResource']).factory('tradeMessageNoticeService', ['$resource', function ($resource) {
        return $resource('trade/message', {}, {
            saveMessage : {
                method : 'POST'
            },
            getMessage : {
                url : 'trade/message/:id',
                method : 'GET'
            },
            /**
             * 通知卖家发货
             */
            notifySellerShip : {
                url : 'trade/message/order/:id',
                method : 'POST'
            }
        })
    }]);
});