define([ 'ngResource' ], function() {
    angular.module('orderServices', [ 'ngResource' ]).factory('Order', ['$resource', 'BaseService', function($resource, BaseService) {
        var rootPath = BaseService.getRootPath();
        //获取order的分页数据
        return $resource('trade/order/:orderid', {}, {
            get: {
                isArray : true
            },
			/*
			 * get,获取order的分页数据
			 */
            //保存
            save: {
                url : 'trade/order/save',
                method : 'POST'
            },
            /**
             * 议价
             */
            applyCharge: {
                url : 'trade/order/applycharge/:detailid',
                method : 'POST'
            },
            getReply: {
                url : 'trade/order/getreply/:detailid',
                method : 'GET',
                isArray: true
            },
            //获得所有简单数据
            getSimpleInfo: {
                url : 'trade/order/simpleinfo/ones',
                method : 'GET',
                isArray : true
            },
            //按照分组策略生成订单
            saveByGroup: {
                url : 'trade/order/saveByGroup',
                method : 'POST',
                isArray : false
            },
            //立即购买
            buyNow: {
                url : 'trade/order/buyNow',
                method : 'POST'
            },
            //立即购买(店铺)
            buyNowInStore: {
                url : 'trade/order/buyNow',
                method : 'POST'
            },
            // 删除订单明细
            deleteDetails: {
                url: 'trade/order/deleteDetails',
                method: 'POST' //DELETE does not send request body
            },
            //确认
            ensure: {
                url : 'trade/order/:orderid/ensure',
                method : 'PUT',
                isArray : false
            },
            //取消
            cancle: {
                url : 'trade/order/:orderid/cancle',
                method : 'PUT'
            },
            //确认收款
            ensurePay: {
                url : 'trade/order/:orderid/ensurePay',
                method : 'PUT',
                isArray : false
            },
            //批量收款
            batchEnsurePay: {
                url : 'trade/order/:orderids/batchToEnsureReceMoney',
                method : 'PUT',
                isArray : false
            },
            //判断是否包含寄售类型产品
            checkConsignment: {
                url : 'trade/order/consignment',
                method : 'POST'
            },
            /**
             * 平台查看
             */
            //平台根据状态查看订单
            getAdminOrders: {
                url : 'trade/order/admin/all',
                method : 'GET'
            },
            //平台管理员根据快递单id查快递单
            getLogistics: {
                url : 'trade/order/:lgtid/logistics',
                method : 'GET'
            },
            /**
             * 买家查看
             */
            // 买家查看对应状态订单
            getIndividualOrder: {
                url : 'trade/order/individual',
                method : 'GET'
            },
            changeOrderUsed:{
                url : 'trade/order/used/:orderid',
                method : 'POST'
            },
            // 送样订单
            getIndividualProof: {
                url : 'trade/order/individual/proof',
                method : 'GET'
            },
            //查询对应原厂型号
            findcode: {
                url:'trade/order/findcode/:ba',
                method : 'GET'
            },
            /**
             * TODO 应不应该放这里还要考虑
             */
            //转采购
            createPurchase: {
                url : 'trade/purchase/create/:orid',
                method : 'PUT'
            },
            //批量转采购
            createPurchases: {
                url : 'trade/purchase/creates/:adrid',
                method : 'PUT'
            },
            /**
             * TODO 应不应该放这里还要考虑
             */
            //转出货
            createinFor: {
                url : 'trade/inFor/create/:orid',
                method : 'PUT'
            },
            //批量转出货单
            batchCreateinFor: {
                url: 'trade/inFor/batch/create',
                method : 'POST'
            },
            /**
             * 判断订单是否可以合并转采购
             * TODO 应不应该放这里还要考虑
             */
            checkPurchase: {
                url : 'trade/purchase/checkPurc',
                method:'POST'
            },
            /**
             * 获取卖家信息
             */
            getSellerInfo: {
                url : 'trade/order/:sellerenuu/findSeller',
                method : 'GET'
            },
            /**
             * 管理员获取订单详情
             */
            getOrderDetail: {
                url : 'trade/order/:orderid/show',
                method: 'GET'
            },
            /**
             * 买家获取订单详情
             */
            getBuyerOrderDetail: {
                url : 'trade/order/:orderid/buyer',
                method: 'GET'
            },
            /**
             * 根据批次号获取标准元器件信息
             */
            getComponentActive: {
                url : 'trade/order/:batchCode/componentActive',
                method: 'GET'
            },
            /**
             * 根据银行转账信息id获取银行转账信息
             */
            getBankInfo: {
                url : 'trade/order/:banktfid/bankTransfer',
                method: 'GET'
            },
            /**
             * 根据订单号获取单个订单
             */
            findByCode: {
                url:'trade/order/findByCode/:orderid',
                method : 'GET'
            },
            /**
             * 根据订单号获取Order对象
             */
            findStatusByOrderid: {
                url:'trade/order/findStatus',
                method : 'GET'
            },
            /**
             * 通过订单号查询管理买家，卖家，供应商等信息
             */
            findUserVenderByCode: {
                url:'trade/order/admin/findUserVender/:orderid',
                method : 'GET'
            },
			/*
			 * 根据指定的状态获取个人订单的个数
			 */
            getPersonalOrderCountByStatus: {
                url : 'trade/order/personal/count',
                method : 'GET'
            },
            //获取待开发票订单
            getOrderOnBill: {
                url : 'trade/order/bill/status',
                method : 'GET'
            },
            //获取待开发票订单
            getOrderOnBillByPersonal: {
                url : 'trade/order/bill/status/personal',
                method : 'GET'
            },
            //开发票
            makeOutBill: {
                url : 'trade/order/bill/:billNum',
                method : 'POST'
            },
            //确认收票comfirmCancle
            confirmBill: {
                url : 'trade/order/bill/confirm',
                method: 'POST'
            },
            //取消订单明细
            comfirmCancle: {
                url : 'trade/order/cancle/detail',
                method: 'POST'
            },
            // 根据订单状态获取订单数
            getAllStatusCounts: {
                url : 'trade/order/personal/counts',
                method : 'GET'
            },
            /**
             * 删除订单
             * @see com.uas.platform.b2c.trade.controller.OrderController.deleteOrder(String)
             */
            deleteOrder : {
                url : "trade/order/:ids",
                method : 'DELETE',
                params : { _status : 'unavailable'}
            },
            /**
             * 【平台】根据参数分页获取订单列表信息
             */
            findAdminOrderPageByParams : {
                url : 'trade/order/admin/orderPage/params',
                method : 'GET'
            },
            drawBill : {
                url : 'trade/order/draw/bill/:id',
                method : 'POST',
                params : {role : 'admin'}
            },
            // 获取取消购买时所有订单明细的是否直接退款的状态
            queryOrderDetailsNotReturn: {
                url		: 'trade/order/:orderId/details/isNotReturn',
                method	: 'GET'
            },
            //获取订单的详细数据，包含库存信息。
            orderContainGoods : {
                url : 'trade/order/orderContainGoods',
                method : 'GET'
            },
            //更新订单的信息
            orderUpdate : {
                url : 'trade/order/:enOrderid',
                method : 'PUT'
            },
            // 检测待付款订单是否存在
            checkToBePaidOrderExist : {
                url : 'trade/order/:orderId/status/exist',
                method : 'GET',
                params : {
                    status : 'toBePaid'
                }
            },
			// 根据店铺UUID获取店铺的订单数量
            countOneStoreOrder : {
            	url : rootPath + '/api/provider/order/storeid/:storeUuid/count',
				method : 'GET'
			},
            /**
             * 审核不通过的动作
             */
            auditFailure : {
                url : 'trade/order/:orderId/payment/failure',
                method : 'PUT'
            }
        });
    }]).factory('OrderSimpleInfo', ['$resource','BaseService', function($resource, BaseService) {
        var rootPath = BaseService.getRootPath();
        //获取order的分页数据
        return $resource('trade/order/simpleinfo', {}, {
            //获得所有简单数据
            getOnes: {
                url : 'trade/order/simpleinfo/ones',
                method : 'GET',
                isArray : true
            },
            //获得某个人待确认订单
            getOnesTobeConfirmed: {
                url : 'trade/order/simpleinfo/ones',
                method : 'GET',
                isArray : true,
                params : { _status : 'tobeConfirmed'}
            },
            //获得某个人待付款订单
            getOnesTobePaid: {
                url : 'trade/order/simpleinfo/ones',
                method : 'GET',
                isArray : true,
                params : { _status : 'tobePaid'}
            },
            //获得某个人待付款订单
            getPageOnesTobePaid: {
                url : 'trade/order/page/simpleinfo/ones',
                method : 'GET',
                params : { _status : 'tobePaid'}
            },
            //查看某个人已付款订单(用户已付款)
            getOnesPaid: {
                url : 'trade/order/simpleinfo/ones',
                method : 'GET',
                isArray : true,
                params : { _status : 'paid'}
            },
            //查看已付款到待收货的所有订单
            getOnesInbounds: {
                url : 'trade/order/simpleinfo/ones',
                method : 'GET',
                isArray : true,
                params : { _status : 'inbounds'}
            },
            //获取已收货订单
            getOnesReceived: {
                url : 'trade/order/simpleinfo/ones',
                method : 'GET',
                isArray : true,
                params : { _status : 'received'}
            },
            //将订单失效（库存不足而失效）
            setUnavailable: {
                url : 'trade/order/simpleinfo/ones/:orderid',
                method : 'PUT',
                params : { _status : 'unavailable'}
            },
            //确认收货
            ensureAccept: {
                url : 'trade/order/simpleinfo/ones/:ids',
                method : 'PUT',
                params : { _status : 'ensureaccept'}
            },
            releaseOrder: {
                url : 'trade/order/simpleinfo/ones/:orderid/release',
                method : 'PUT'
            },
            getBuyPayRecord : {
                url : 'trade/order/buyer/payRecord',
                method : 'GET'
            },
            // 买家同意取消订单申请
            userAuditCancelOrder : {
                url : rootPath + '/trade/order/simpleinfo/ones/:orderid/release/audit',
                method : 'PUT'
            },
            // 买家不同意取消订单申请
            userUnauditCancelOrder : {
                url : rootPath + '/trade/order/simpleinfo/ones/:orderid/release/unaudit',
                method : 'PUT'
            }
        });
    }]);
});
