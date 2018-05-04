/**
 * Created by yangck on 2016/10/31.
 */
define(['ngResource'], function () {
    angular.module('afterSaleService', ['ngResource'])
        .factory('AfterSale', ['$resource', function ($resource) {
            return $resource('trade/afterSale/:orderId', {}, {
                // 买家
                /**
                 * 查询申请单
                 */
                query: {
                    isArray: false /* 因为获取的是单张单，而不是数组 */
                },
                /**
                 * 更新售后申请单
                 */
                updateAfterSaleApply: {
                    url: 'trade/afterSale/:applyId/updateAfterSaleApply',
                    method: 'PUT'
                },
                /**
                 * 创建申请单
                 */
                createAfterSaleApply: {
                    url: 'trade/afterSale/:orderId/createAfterSaleApply',
                    method: 'POST'
                },
                /**
                 * 取消售后申请
                 */
                cancelApply: {
                    url: 'trade/afterSale/:applyId/cancelApply',
                    method: 'PUT'
                },
                /**
                 * 同意售后处理
                 */
                agreeHandling: {
                    url: 'trade/afterSale/:applyId/agreeHandling',
                    method: 'PUT'
                },

                /**
                 * 买家获取异常申请消息状态
                 */
                buyerGetApplyMsgState: {
                    url: 'trade/afterSale/buyerGetApplyMsgState',
                    method: 'GET'
                },
                /**
                 * 买家设置异常申请消息为已读
                 */
                buyerSetApplyMsgRead: {
                    url: 'trade/afterSale/buyerSetApplyMsgRead/:applyId',
                    method: 'PUT'
                },
                /**
                 * 买家获取异常通知消息状态
                 */
                buyerGetNotifyMsgState: {
                    url: 'trade/puExApply/buyerGetNotifyMsgState',
                    method: 'GET'
                },
                /**
                 * 买家设置异常通知消息为已读
                 */
                buyerSetNotifyMsgRead: {
                    url: 'trade/puExApply/buyerSetNotifyMsgRead/:notifyId',
                    method: 'PUT'
                },


                // 商城
                /**
                 * 获取一页售后申请单
                 */
                getApplyList: {
                    url: 'trade/afterSale/getApplyList',
                    method: 'GET'
                },
                /**
                 * 根据申请单号获取订单异常申请单
                 */
                getApplyByApplyIdForMall: {
                    url: 'trade/afterSale/getApplyByApplyIdForMall/:applyId',
                    method: 'GET'
                },
                /**
                 * 启动订单异常流程
                 */
                startOrExProcess: {
                    url: 'trade/afterSale/startOrExProcess/:applyId',
                    method: 'POST'
                },

                // 卖家
                /**
                 * 供应商更新售后申请明细
                 */
                /*updateApplyDetailBySup: {
                    url: 'trade/afterSale/updateApplyDetailBySup',
                    method: 'PUT'
                },*/
                /**
                 * 根据采购异常申请号获取采购异常申请单
                 */
                getPuExApplyByApplyId: {
                    url: 'trade/puExApply/getPuExApplyByApplyId/:applyId',
                    method: 'GET'
                },
                /**
                 * 卖家发送对异常通知的处理意见
                 */
                sendExNotifyMsgToMall: {
                    url: 'trade/puExApply/sendExNotifyMsgToMall/:applyId',
                    method: 'PUT'
                },
                /**
                 * 卖家发起异常申请
                 */
                createPuExApply: {
                    url: 'trade/puExApply/createPuExApply/:purchaseId',
                    method: 'POST'
                },
                /**
                 * 卖家同意处理
                 */
                supAgreeHandling: {
                    url: 'trade/puExApply/supAgreeHandling/:applyId',
                    method: 'PUT'
                },
                /**
                 * 卖家取消申请
                 */
                supCancelApply: {
                    url: 'trade/puExApply/supCancelApply/:applyId',
                    method: 'PUT'
                }
            });
        }]).factory('SupExProcess', ['$resource', function ($resource) {
        return $resource('trade/supExProcess/:applyId', {}, {});
    }])
        .factory('PuExProcess', ['$resource', function ($resource) {
            return $resource('trade/puExApply/:applyId', {}, {
                /**
                 * 为商城获取一页卖家发起的采购异常申请单
                 */
                getPuExApplyListForMall: {
                    url: 'trade/puExApply/getPuExApplyListForMall',
                    method: 'GET'
                },
                /**
                 * 根据异常单号为商城获取指定卖家发起的采购异常申请单
                 */
                getPuExApplyForMall: {
                    url: 'trade/puExApply/getPuExApplyForMall/:applyId',
                    method: 'GET'
                },
                /**
                 * 商城/买家更新采购异常申请单
                 */
                updatePuExApply: {
                    url: 'trade/puExApply/updatePuExApply/:applyId',
                    method: 'PUT'
                },
                /**
                 * 商城启动采购异常流程
                 */
                startPuExProcess: {
                    url: 'trade/puExApply/startPuExProcess/:applyId',
                    method: 'POST'
                },
                /**
                 * 买家获取指定采购异常申请单
                 */
                getPuExApplyForBuyer: {
                    url: 'trade/puExApply/getPuExApplyForBuyer/:applyId',
                    method: 'GET'
                },
                /**
                 * 卖家设置异常申请消息为已读
                 */
                sellerSetApplyMsgRead: {
                    url: 'trade/puExApply/sellerSetApplyMsgRead/:applyId',
                    method: 'PUT'
                },
                /**
                 * 卖家设置异常通知消息为已读
                 */
                sellerSetNotifyMsgRead: {
                    url: 'trade/puExApply/sellerSetNotifyMsgRead/:notifyId',
                    method: 'PUT'
                }
            })
        }])
        /*弃用*/
        .factory('PuExAfterSale', ['$resource', function ($resource) {
        return $resource('trade/puExApply/:purchaseId', {}, {
            /**
             * 创建申请单
             */
            createPuExAfterSaleApply: {
                url: 'trade/puExApply/:purchaseId/create/b2c',
                method: 'POST'
            },
            /**
             * 获取采购的申请单
             */
            getPuExAfterSaleApply: {
                url: 'trade/puExApply/getPuExApplyByApplyId/:applyId',
                method: 'GET'
            },
            /**
             * 取消采购的申请单
             */
            canclePuExAfterSaleApply: {
                url: 'trade/puExApply/:applyId/canclePuExAfterSaleApply',
                method: 'GET'
            },
            /**
             * 管理平台同意异常申请
             */
            agreenHandlePuExAfterSaleApplyByB2C: {
                url: 'trade/puExApply/:applyId/agreenHandlePuExAfterSaleApplyByB2C',
                method: 'POST'
            }
        });
    }])
        .factory('AfterSaleApplyTypes', function () {
            return {
                'CANCEL_BUY': '取消购买',
                'RETURN': '退货',
                'EXCHANGE': '换货',
                'REFUND': '退款',
                'REFUSE': '拒绝',
                'STOCK_OUT': '缺货取消'
            };
        })
        .factory('OrExApplyStatusForBuyer', function () {
            return {
                'BUYER_TO_MALL': '申请处理中',
                'MALL_TO_SUP': '申请处理中',
                'SUP_TO_MALL': '申请处理中',
                'MALL_TO_BUYER': '申请有反馈',
                'CANCELED': '已取消异常申请',
                'FINISHED': '申请有反馈'/*已受理，请查看退换货单*/
            };
        })
        .factory('ExNotifyStatusForBuyer', function () {
            return {
                'SUP_TO_MALL': '异常通知',
                'MALL_TO_BUYER': '异常通知',
                'BUYER_TO_MALL': '已处理异常通知',
                'MALL_TO_SUP': '通知处理中',
                'CANCELED': '卖家已取消',
                'FINISHED': '已处理异常通知'
            };
        })
        .factory('OrExSrc', function () {
            return {
                501: "待确认",
                503: "待付款",
                504: "已付款",
                505: "已付款",
                406: "待出货",
                403: "出货中",
                407: "已出货",
                408: "发货中",
                404: "待收货",
                405: "已收货",
                602: "无效的"
            }
        })
        .factory('PuExSrc', function () {
            return {
                406: "待出货",
                404: "待收货",
                405: "已收货",
                502: "正式订单",/*已确认*/
                503: "待付款",
                504: "已付款"
            }
        })
        .factory('ApplyStatus', function () {
            return {
                // 订单异常的下一个状态
                nextOrExStatus: function (status) {
                    switch (status) {
                        case 'BUYER_TO_MALL':
                            return 'MALL_TO_SUP';
                            break;
                        case 'MALL_TO_SUP':
                            return 'SUP_TO_MALL';
                            break;
                        case 'SUP_TO_MALL':
                            return 'MALL_TO_BUYER';
                            break;
                        case 'MALL_TO_BUYER':
                            return 'FINISHED';
                            break;
                    }
                },
                // 采购单异常的下一个状态
                nextPuExStatus: function (status) {
                    switch (status) {
                        case 'SUP_TO_MALL':
                            return 'MALL_TO_BUYER';
                            break;
                        case 'MALL_TO_BUYER':
                            return 'BUYER_TO_MALL';
                            break;
                        case 'BUYER_TO_MALL':
                            return 'MALL_TO_SUP';
                            break;
                        case 'MALL_TO_SUP':
                            return 'FINISHED';
                            break;
                    }
                }
            }
        });
});





