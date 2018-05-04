/**
 * Created by yangck on 2017/3/30.
 */
define(['ngResource'], function () {
   angular.module('recommendation', ['ngResource']).factory('Recommendation', ['$resource', function ($resource) {
      /**
       * type:资源类型：goods、component、store、comps
       * 查询参数:page、
       *        size、
       *        userUU、
       *        usedFor: user_center、product_detail等
       */
      return $resource('recommendation/:type', {}, {
         getRecommendationGoods: {
            url: 'recommendation/goods',
            method: 'GET',
         },
         getRecommendComps: {
             url: 'recommendation/comps',
             method: 'GET',
         }

      })
   }])
});