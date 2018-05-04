define([ 'ngResource' ], function() {
	angular.module('goodsServices', [ 'ngResource' ]).factory('Goods', ['$resource', 'BaseService', function($resource, BaseService) {
		var rootPath = BaseService.getRootPath();
		//获取ComponentSubmit的分页数据
		return $resource('trade/goods', {}, {
			//取得完整的消息
			findAllByUuid : {
				url : 'trade/goods/byUuid/:uuid',
				method : 'GET',
				isArray : true
			},
			// 取得价格信息
			findPriceByCode : {
				url : 'trade/goods/price',
				method : 'GET'
			},
			//取得简化的消息
			findSimpleAllByUuid : {
				url : 'trade/goods/simple/byUuid/:uuid',
				method : 'GET',
				isArray : true
			},
			//取得有效的简化的消息
			findSimpleAvailableByUuid : {
				url : 'trade/goods/simple/byUuidAndCurrency',
				method : 'GET',
				isArray : true,
				params : { _status : 'available' }
			},
			// 通过uuid获取批次信息
			findGoodsGroupByStoreOrderByMinrmbPrice : {
				url : 'trade/goods/store/uuid/:uuid',
				method : 'GET',
				isArray : true
			},
			// 上传Excel批量发布产品
			publishByExcel: {
				url: 'trade/goods/publish/excel',
				method: 'POST'
			},
			//获取在售的产品
			findSalingGoods : {
				url : 'trade/goods/saling',
				method :'GET'
			},
			//管理平台获取在售的产品
			findSalingGoodsAdmin : {
				url : 'trade/goods/saling/admin',
				method :'GET' 
			},
			//获取已下架的产品
			findDownedGoods : {
				url : 'trade/goods/downed',
				method :'GET' 
			},
			// 获取上架/下架产品
			findUpAndDown : {
                url : 'trade/goods/upAndDown',
                method :'GET'
            },
			//管理平台获取已下架的产品
			findDownedGoodsAdmin : {
				url : 'trade/goods/downed/admin',
				method :'GET' 
			},
			//更新产品
			updateGoods : {
				url : 'trade/goods',
				method : 'PUT'
			},
			//批量下架产品
			batchDown : {
				url : 'trade/goods/batchdown',
				method : 'DELETE'
			},
			//失效产品全部下架产品
			batchDownAll : {
				url : 'trade/goods/batchdownAll',
				method : 'DELETE'
			},
			//根据批次号获取产品详情
			findByBatchCode : {
				url : 'trade/goods/:batchCode/detail',
				method : 'GET'
			},
			//判断商品是否被送样
			isSample : {
				url : 'trade/goods/:id/issample',
				method : 'GET'
			},
			//刷新批次有效期
			refresh : {
				url : 'trade/goods/refresh/:id',
				method : 'GET'
			},
			//获取即将失效批次
			getOvertime : {
				url : 'trade/goods/overtime',
				method : 'GET',
				isArray : true
			},
			// 获取发布人信息
			getPublisherInfo : {
				url : 'trade/goods/publisher/info',
				method : 'GET'
			},
			getStatistics : {
				url : 'trade/goods/statistics',
				method : 'GET'
			},
			// 根据关键字、库存来源和器件类目分页获取商品信息列表
			findGoodsByKeyword : {
				url : 'api/product/component/goods/original/:original',
				method : 'GET'
			},
			// 根据批次号获取批次信息变更记录（卖家）
			findGoodsHistoryWithVendor : {
				url : 'trade/goods/goodsHistory',
				method : 'GET'
			},
			// 分页获取当前店铺的某一状态的商品信息
			getGoodsByPageAndStatus : {
				url : 'trade/goods/store/status',
				method : 'GET'
			},
			// 重新上架已下架商品 该方法的后台代码又问题，被弃用
			putOnCommodityOnce : {
				url : rootPath + '/trade/goods/:batchCode/putOnOnce',
				method : 'PUT'
			},
			//商品上架
			putOn : {
				url : 'trade/goods/putOn/:id',
				method: 'PUT'
			},
			downNowEnterpriseGoods: {
				url : 'trade/goods/down/enUU',
				method: 'PUT'
			},
			// 删除列表
			deleteGoodsByIdList: {
				url : 'trade/goods/delete/batch',
				method: 'PUT'
			},
			// 删除企业下在售
			deleteGoodsByEnUU: {
				url : 'trade/goods/delete/enUU',
				method: 'PUT'
			},
			// 卖家下架已上架商品
			offShelfGoodsByProvider : {
				url : 'trade/goods/provider/off/shelf',
				method : 'PUT'
			},
			// 卖家下架已上架商品
			offShelfGoodsByids : {
				url : rootPath + '/trade/goods/provider/down/id',
				method : 'PUT'
			},
			// 随机生成4个热卖商品 Deprecated
            randomGetHotCommodity : {
				url : rootPath + '/trade/goods/hot/random',
				method : 'GET'
			},
			// 据店铺UUID获取商品和品牌的数量
            findCommodityAndKindNumberByStore : {
				url : rootPath + '/trade/goods/storeid/:storeUuid/counts',
				method : 'GET'
			},
			//获取最近的库存信息
			getLatestGoods: {
				url : rootPath + '/api/commodity/latest',
				method : 'GET',
				isArray : true
			},
			// 各月新增在售批次数量
			getIncreaseBatch: {
				url : rootPath + '/trade/goods/increaseBatchCount',
				method : 'GET',
				isArray : true
			},
			// 各月新增在售器件数量
			getIncreaseCmp: {
				url : rootPath + '/trade/goods/increaseCmpCount',
				method : 'GET',
				isArray : true
			},
			getDownLoadStatus: {
				url : 'release/product/release/failure/status',
				method : 'GET'
			},
			/**
			 * 获取类似的产品
			 */
			getSimilarityPro : {
				url : 'trade/goods/similarities',
				method : 'GET'
			},
            /**
             * 获取类似的产品
             */
            getSimilarityProCount : {
                url : 'trade/goods/similarities/count',
                method : 'GET'
            },
            /**
             * 获取类似的产品
             */
            getSimilarityProCount : {
                url : 'trade/goods/similarities/count',
                method : 'GET'
            },
            /**
             * 批量获取类似的产品
             */
            getSimilarityProCount : {
                url : 'trade/goods/similarities/count/batch',
                method : 'POST'
            },
			/**
			 * 下架该公司所有的产品
			 */
			downAllGoodsByEnterprise : {
				url : 'trade/goods/downAllGoods/enterprise',
				method : 'GET'
			},
			/**
			 * 根据产品id获取对应上架信息
			 */
			getGoodsByProductId : {
				url : 'trade/goods/by/productId',
				method : 'GET',
				isArray : true
			},
			/**
			 * 修改goods状态，转为在售
			 */
			modifyGoodsStatus : {
				url : 'trade/goods/turn/sale',
				method : 'PUT'
			},
			/**
			 * 是否被推荐了
			 */
			isRecommendGoods : {
				url : 'trade/goods/isRecommend/:id',
				method: 'GET'
			},

			/**
			 * 删除产品信息
			 */
			deleteGoodsById : {
				url : 'trade/goods/delete/:id',
				method:  'DELETE'
			},
			/**
			 * 添加产品信息
			 */
			addGoods : {
				url : 'trade/goods/addGoods',
				method : 'POST'
			},
			getDeleteProductMessage : {
				url : 'trade/goods/:productid/deleteMessage',
				method : 'GET'
			},
			getRepeatByTagAndProductId : {
				url : 'trade/goods/repeat/tag',
				method : 'GET'
			}
		});
	}]);
});
