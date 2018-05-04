/**
 * Created by yujia on 2017/7/8.
 * 产品导入的module
 */

define(['ngResource'], function(ngResource) {
    angular.module('productImportModule', ['ngResource']).factory('productImportServie', ['$resource', function($resource) {

        return $resource('trade/productImport/page', {}, {
            getPageProductImport : {
                url : 'trade/productImport/page',
                method : 'GET'
            },
            /**
             * 将匹配不成功的器件选择指定的明细之后更新
             */
            updateFailureMatch : {
                url : 'trade/productImport/failure/update',
                method : 'PUT'
            },
            /**
             * 将产品导入到标准或者非标仓库
             */
            importToProRepository : {
                url : 'trade/productImport/import/repository',
                method : 'POST'
            }
        });
    }]).factory('prodRepositoryService', ['$resource', function($resource) {

        return $resource('trade/products/matchbytype', {} ,{
            matchAll : {
                url : 'trade/products/matchbytype/:type',
                method : 'GET'
            },
            /**
             *  更新匹配的信息
             */
            updateMatch : {
                url : 'trade/products/update',
                method : 'PUT'
            },
            saveMatchInfo : {
                url : 'trade/products/save/matchInfo',
                method : 'POST'
            }
        });
    }]);
})