define(['ngResource'], function(){
   angular.module('BrowsingHistory', ['ngResource']).factory('GoodsBrowsingHistory', ['$resource', function($resource){
        return $resource('trade/history', { }, {
            // 保存产品浏览记录
            saveGoods:{
               url : 'trade/history/goods/save',
               method : 'POST'
           },
            getAllHistory : {
               url : 'trade/history/goods/list',
                method : 'GET',
                isArray : true
            },
            getAllHistoryPage : {
                url : 'trade/history/goods/page',
                method : 'GET'
            },
            deleteHistory :{
                url : 'trade/history/goods/delete',
                method : 'POST'
            }
        });
   }])
});