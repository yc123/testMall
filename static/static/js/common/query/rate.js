define([ 'ngResource' ], function() {
    angular.module('rateServices', [ 'ngResource' ]).factory('Rate', ['$resource', function($resource) {
        return $resource('rate/rateBuyer/:orderId', {}, {
            //查询该订单的卖家评价买家
            getRateBuyer : {
                url : 'rate/rateBuyer/:orderId',
                method : 'GET'
            },
            // 查询该订单的买家评价商品(根据goodsId)
            getRateGoodsByGoodsId : {
                url : 'rate/rateGoodsByGoodsId/:goodsId',
                method : 'GET'
            },
            // 查询该订单的买家评价商品(根据订单id)
            getRateGoodsByOrderId : {
                url : 'rate/rateGoodsByOrderId/:orderId',
                method : 'GET'
            },
            // 查询该订单的买家评价卖家
            getRateVendor : {
                url : 'rate/rateVendor/:orderId',
                method : 'GET'
            },
            // 查询该企业下的所有模版信息
            getRateTemplate : {
                url : 'rate/rateTemplate/:storeuuid',
                method : 'GET'
            },

            // 买家评价卖家店铺
            saveRateVendor : {
                url : 'rate/rateVendor/:orderId',
                method : 'POST'
            },
            // 买家评价商品
            saveRateGoods : {
                url : 'rate/rateGoods/:orderId',
                method : 'POST'
            },
            // 买家评价商品(合)
            saveBuyerRate : {
                url : 'rate/buyerRate/:orderId',
                method : 'POST'
            },
            //买家追评评价商品
            saveAfterRateGoods : {
                url : 'rate/afterRateGoods/:orderId',
                method : 'POST'
            },
            //卖家评价买家
            saveRateBuyer : {
                url : 'rate/rateBuyer/:purchaseId',
                method : 'POST'
            },
            //卖家追评价买家
            saveAfterRateBuyer : {
                url : 'rate/afterRateBuyer/:purchaseId',
                method : 'POST'
            },
            //保存或修改评价模版
            saveRateTemplate : {
                url : 'rate/rateTemplate/:storeuuid',
                method : 'POST'
            },
            //卖家为商品评价添加回复（初评）
            saveReply : {
                url : 'rate/rateReply/:orderId',
                method : 'POST'
            },
            //卖家为商品评价添加回复（追评）
            saveAfterReply : {
                url : 'rate/afterRateReply/:orderId',
                method : 'POST'
            },
            //卖家为商品评价添加回复（批量）
            saveAllReply : {
                url : 'rate/allRateReply/:orderId',
                method : 'POST'
            }
        });
    }]);
});