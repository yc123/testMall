/**
 * Created by yujia on 2017/7/10.
 * 出入库的获取方法
 */

define(['ngResource'], function(ngResource) {
    angular.module('stockInOutModule', ['ngResource']).factory('stockInOutService', ['$resource', function ($resource) {
        return $resource('trade/stockInOut', {}, {
            /**
             * 保存出入库记录
             */
            save : {
                url : 'trade/stockInOut/save',
                method : 'POST'
            },
            getstockInOutHist : {
                url : 'trade/stockInOut/get/proId',
                method : 'GET',
                isArray : true
            }
        });

    }]);
});
