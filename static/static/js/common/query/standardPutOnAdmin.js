/**
 * Created by yujia on 2017/7/15.
 */
define([ 'ngResource' ], function() {
    'use strict';
    angular.module('StandardPutOnAdminModule', ['ngResource']).factory('StandardPutOnAdminService', ['$resource', function ($resource) {
        return $resource('trade/prodStandPutOnInfo/page', {}, {
            /**
             * 获取分页的数据
             */
            getProductStandardPutOnInfoByPage : {
                url : 'trade/prodStandPutOnInfo/page',
                method : 'GET'
            },

            /**
             * 一键更新标准上架信息
             */
            updateProductStandardPutOnInfoByBatch :  {
                url : 'trade/prodStandPutOnInfo/update/availableToSale/batch',
                method : 'PUT'
            },
            /**
             * 更新标准产品上架的信息
             */
            updateProductStandardPutOnInfo : {
                url : 'trade/prodStandPutOnInfo/update',
                method : 'PUT'
            },
            /**
             * 上架的动作
             */
            productStandardPutOnInfoPutOn : {
                url : 'trade/prodStandPutOnInfo/puton',
                method : 'POST'
            }
        });
    }]);
});
